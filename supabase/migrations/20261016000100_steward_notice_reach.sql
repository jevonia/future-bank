-- Steward notices that reach nobody are reported, not hidden. Fixes finding D1
-- of docs/reviews/agent-review-2026-10-16.md. Apply after
-- 20261015000200_vouches_and_safety.sql.
--
-- 1. bank_notify_stewards drops NULLs from the exclude list. `x <> all('{a,NULL}')`
--    is NULL, so a concern with no named member used to notify no steward.
-- 2. It returns how many stewards were notified.
-- 3. bank_safety_checkin and bank_raise_concern still save the row, and now
--    return (id, stewards_notified). When every active steward is part of the
--    exchange, the reporter, or the subject, stewards_notified is 0 and the
--    page tells the member that no steward could be reached.
-- Input signatures are unchanged. Return types change, so the functions are
-- dropped and recreated in this transaction and their grants are restated.
begin;

drop function if exists public.bank_notify_stewards(text,text,uuid[]);
drop function if exists public.bank_safety_checkin(bigint,text);
drop function if exists public.bank_raise_concern(uuid,bigint,text,boolean);

-- Notify every active steward except the people a notice is about.
create function public.bank_notify_stewards(p_title text,p_body text,p_except uuid[])
returns integer language sql security definer set search_path = '' as $$
 with sent as (
   insert into public.notifications(user_id,title,body)
   select s.user_id,p_title,p_body from public.member_standing s
   where s.level='steward' and not public.bank_is_paused(s.user_id)
     and s.user_id <> all(array_remove(coalesce(p_except,'{}'::uuid[]),null))
   returning 1
 )
 select count(*)::integer from sent
$$;

-- "Please have a steward call me" sends an in-app notice to stewards who are
-- not part of the exchange. It is not an emergency service; the page says so.
-- The check-in is kept even when no steward could be told, so a steward named
-- later still sees it in the safety feed.
create function public.bank_safety_checkin(p_exchange_id bigint,p_kind text,
  out checkin_id bigint,out stewards_notified integer)
language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); e public.exchanges%rowtype;
begin
 if p_kind is null or p_kind not in ('fine','call_me') then raise exception 'Choose a check-in.'; end if;
 select * into e from public.exchanges where id=p_exchange_id;
 if not found or v_actor not in (e.provider_id,e.requester_id) then raise exception 'Exchange not found'; end if;
 if e.status<>'accepted' then raise exception 'Check-ins are for accepted exchanges.'; end if;
 insert into public.exchange_safety_checkins(exchange_id,member_id,kind)
 values(p_exchange_id,v_actor,p_kind) returning id into checkin_id;
 stewards_notified := null;
 if p_kind='call_me' then
   stewards_notified := public.bank_notify_stewards('A member asked a steward to call them',
     coalesce((select username from public.profiles where id=v_actor),'A member')||' asked for a call during an exchange. Please reach them soon.',
     array[e.provider_id,e.requester_id]);
 end if;
end $$;

-- Conduct only: the form asks what happened and what the person did.
-- A concern about the only steward, or raised by the only steward, is saved
-- but reaches nobody; stewards_notified = 0 lets the page say so.
create function public.bank_raise_concern(p_about_id uuid,p_exchange_id bigint,p_body text,p_share_name boolean,
  out concern_id bigint,out stewards_notified integer)
language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); e public.exchanges%rowtype; v_about uuid := p_about_id;
begin
 if char_length(btrim(coalesce(p_body,''))) not between 10 and 4000 then raise exception 'Please write 10 to 4000 characters.'; end if;
 if p_share_name is null then raise exception 'Choose whether your name may be shared.'; end if;
 if p_exchange_id is not null then
   select * into e from public.exchanges where id=p_exchange_id;
   if not found or v_actor not in (e.provider_id,e.requester_id) then raise exception 'Exchange not found'; end if;
   if v_about is null then v_about:=case when v_actor=e.provider_id then e.requester_id else e.provider_id end;
   elsif v_about not in (e.provider_id,e.requester_id) then raise exception 'That member is not part of this exchange.'; end if;
 end if;
 if v_about is not null and (v_about=v_actor or not exists(select 1 from public.profiles where id=v_about)) then
   raise exception 'Member not found.';
 end if;
 insert into public.concerns(reporter_id,about_id,exchange_id,body,share_name)
 values(v_actor,v_about,p_exchange_id,btrim(p_body),p_share_name) returning id into concern_id;
 stewards_notified := public.bank_notify_stewards('A private concern needs a steward',
   'Please write back to the member within two days.',array[v_actor,v_about]);
end $$;

-- New functions are executable by PUBLIC by default; restate the grants.
revoke all on function public.bank_notify_stewards(text,text,uuid[]) from public,anon,authenticated;
revoke all on function public.bank_safety_checkin(bigint,text) from public,anon,authenticated;
revoke all on function public.bank_raise_concern(uuid,bigint,text,boolean) from public,anon,authenticated;
grant execute on function
  public.bank_safety_checkin(bigint,text),
  public.bank_raise_concern(uuid,bigint,text,boolean)
to authenticated;
commit;
