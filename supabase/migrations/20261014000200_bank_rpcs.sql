begin;

create or replace function public.bank_save_listing(
  p_kind text,p_id bigint,p_title text,p_description text,p_category text,p_criteria text[]
) returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); v_id bigint;
begin
 if p_kind not in ('offer','want') or p_kind is null then raise exception 'Invalid listing kind'; end if;
 if char_length(btrim(coalesce(p_title,''))) not between 3 and 120 or
    char_length(btrim(coalesce(p_description,''))) not between 10 and 4000 or
    char_length(btrim(coalesce(p_category,''))) not between 2 and 80 then
   raise exception 'Listing fields are outside allowed lengths'; end if;
 if coalesce(array_ndims(p_criteria),1)<>1 or
    coalesce(array_length(p_criteria,1),0)>18 or exists (
   select 1 from unnest(coalesce(p_criteria,'{}'::text[])) c
   where c is null or c <> all(array[
     'public_place','accessible','daytime_only','evening_only','weekend_only',
     'child_friendly','pet_friendly','wheelchair_accessible','quiet_environment',
     'outdoor','indoor','near_public_transit','parking_available',
     'flexible_schedule','one_time_only','ongoing_help','virtual_ok','in_person_only'
   ])
 ) then raise exception 'Invalid criteria'; end if;
 if p_kind='offer' then
   if p_id is null then
     insert into public.offers(user_id,title,description,category)
     values(v_actor,btrim(p_title),btrim(p_description),btrim(p_category)) returning id into v_id;
   else
     update public.offers set title=btrim(p_title),description=btrim(p_description),category=btrim(p_category)
     where id=p_id and user_id=v_actor and active returning id into v_id;
   end if;
 else
   if p_id is null then
     insert into public.wants(user_id,title,description,category,criteria)
     values(v_actor,btrim(p_title),btrim(p_description),btrim(p_category),coalesce(p_criteria,'{}')) returning id into v_id;
   else
     update public.wants set title=btrim(p_title),description=btrim(p_description),category=btrim(p_category),criteria=coalesce(p_criteria,'{}')
     where id=p_id and user_id=v_actor and active returning id into v_id;
   end if;
 end if;
 if v_id is null then raise exception 'Listing not found or not editable'; end if;
 return v_id;
end $$;

create or replace function public.bank_archive_listing(p_kind text,p_id bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); v_id bigint;
begin
 if p_kind='offer' then
   update public.offers set active=false where id=p_id and user_id=v_actor returning id into v_id;
 elsif p_kind='want' then
   update public.wants set active=false where id=p_id and user_id=v_actor returning id into v_id;
 else raise exception 'Invalid listing kind'; end if;
 if v_id is null then raise exception 'Listing not found'; end if;
 return v_id;
end $$;

create or replace function public.bank_request_exchange(
  p_listing_kind text,p_listing_id bigint,p_minutes integer,p_note text
) returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); v_owner uuid; v_provider uuid; v_requester uuid;
        v_title text; v_category text; v_id bigint;
begin
 if p_minutes is null or p_minutes not between 1 and 2880 then raise exception 'Exchange must be 1–2880 minutes'; end if;
 if char_length(coalesce(p_note,''))>2000 then raise exception 'Note too long'; end if;
 if p_listing_kind='offer' then
   select user_id,title,category into v_owner,v_title,v_category
   from public.offers where id=p_listing_id and active for share;
   v_provider:=v_owner; v_requester:=v_actor;
 elsif p_listing_kind='want' then
   select user_id,title,category into v_owner,v_title,v_category
   from public.wants where id=p_listing_id and active for share;
   v_provider:=v_actor; v_requester:=v_owner;
 else raise exception 'Invalid listing kind'; end if;
 if v_owner is null or v_owner=v_actor then raise exception 'Active listing not found or owned by you'; end if;
 v_title:=coalesce(nullif(btrim(v_title),''),'Untitled');
 v_category:=coalesce(nullif(btrim(v_category),''),'Other');
 insert into public.exchanges(offer_id,want_id,provider_id,requester_id,initiator_id,title,category,minutes)
 values(case when p_listing_kind='offer' then p_listing_id else null end,
        case when p_listing_kind='want' then p_listing_id else null end,
        v_provider,v_requester,v_actor,v_title,v_category,p_minutes)
 returning id into v_id;
 if nullif(btrim(coalesce(p_note,'')),'') is not null then
   insert into public.exchange_messages(exchange_id,sender_id,body)
   values(v_id,v_actor,btrim(p_note));
 end if;
 insert into public.notifications(user_id,title,body)
 values(v_owner,'New exchange request','A member requested an exchange for '||v_title);
 return v_id;
end $$;

create or replace function public.bank_exchange_action(p_id bigint,p_operation text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); e public.exchanges%rowtype;
        v_payer integer; v_receiver integer; v_other uuid; v_reserved bigint;
begin
 select * into e from public.exchanges where id=p_id for update;
 if not found or v_actor not in (e.provider_id,e.requester_id) then raise exception 'Exchange not found'; end if;
 v_other:=case when v_actor=e.provider_id then e.requester_id else e.provider_id end;
 if p_operation in ('accept','decline') then
   if e.status<>'pending' or v_actor=e.initiator_id then raise exception 'Only the invited member can respond to a pending exchange'; end if;
   if p_operation='accept' then
     -- The payer account serializes all reservations, donations, and settlements.
     select balance_minutes into v_payer from public.accounts
       where user_id=e.requester_id for update;
     if v_payer is null then raise exception 'Requester account not found'; end if;
     select coalesce(sum(minutes),0) into v_reserved from public.exchanges
       where requester_id=e.requester_id and status='accepted' and id<>e.id;
     if v_payer::bigint-v_reserved<e.minutes then
       raise exception 'Requester has insufficient available minutes';
     end if;
   end if;
   update public.exchanges set status=case when p_operation='accept' then 'accepted' else 'declined' end where id=p_id;
   insert into public.notifications(user_id,title,body)
   values(v_other,case when p_operation='accept' then 'Exchange accepted' else 'Exchange declined' end,e.title);
 elsif p_operation='cancel' then
   if e.status not in ('pending','accepted') then raise exception 'Exchange cannot be cancelled'; end if;
   if e.status='accepted' then
     perform 1 from public.accounts where user_id=e.requester_id for update;
   end if;
   update public.exchanges set status='cancelled' where id=p_id;
   insert into public.notifications(user_id,title,body) values(v_other,'Exchange cancelled',e.title);
 elsif p_operation='confirm' then
   if e.status='completed' and
      ((v_actor=e.provider_id and e.provider_confirmed) or
       (v_actor=e.requester_id and e.requester_confirmed)) then
     return p_id;
   end if;
   if e.status<>'accepted' then raise exception 'Only accepted exchanges can be confirmed'; end if;
   if v_actor=e.provider_id and e.provider_confirmed or
      v_actor=e.requester_id and e.requester_confirmed then return p_id; end if;
   if v_actor=e.provider_id then e.provider_confirmed:=true;
   else e.requester_confirmed:=true; end if;
   update public.exchanges set provider_confirmed=e.provider_confirmed,
     requester_confirmed=e.requester_confirmed where id=p_id;
   if e.provider_confirmed and e.requester_confirmed then
     -- Stable UUID ordering prevents opposite-direction exchanges deadlocking.
     perform 1 from public.accounts where user_id in (e.provider_id,e.requester_id)
       order by user_id for update;
     select balance_minutes into v_payer from public.accounts where user_id=e.requester_id;
     select balance_minutes into v_receiver from public.accounts where user_id=e.provider_id;
     if v_payer is null or v_receiver is null or v_payer<e.minutes then
       raise exception 'Requester has insufficient minutes or an account is missing';
     end if;
     update public.accounts set balance_minutes=v_payer-e.minutes where user_id=e.requester_id;
     update public.accounts set balance_minutes=v_receiver+e.minutes where user_id=e.provider_id;
     insert into public.ledger_entries(user_id,amount_minutes,balance_after_minutes,kind,exchange_id,description)
     values(e.requester_id,-e.minutes,v_payer-e.minutes,'exchange',p_id,'Exchange: '||e.title),
           (e.provider_id,e.minutes,v_receiver+e.minutes,'exchange',p_id,'Exchange: '||e.title);
     update public.exchanges set status='completed',completed_at=now() where id=p_id;
     insert into public.notifications(user_id,title,body)
     values(e.requester_id,'Exchange completed',e.title),(e.provider_id,'Exchange completed',e.title);
   else
     insert into public.notifications(user_id,title,body) values(v_other,'Completion confirmation',e.title);
   end if;
 else raise exception 'Invalid exchange operation'; end if;
 return p_id;
end $$;

create or replace function public.bank_send_message(p_exchange_id bigint,p_body text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); e public.exchanges%rowtype; v_id bigint; v_other uuid;
begin
 if char_length(btrim(coalesce(p_body,''))) not between 1 and 4000 then raise exception 'Message length must be 1–4000'; end if;
 select * into e from public.exchanges where id=p_exchange_id;
 if not found or v_actor not in (e.provider_id,e.requester_id) then raise exception 'Exchange not found'; end if;
 if e.status not in ('pending','accepted') then raise exception 'Exchange conversation is closed'; end if;
 v_other:=case when v_actor=e.provider_id then e.requester_id else e.provider_id end;
 insert into public.exchange_messages(exchange_id,sender_id,body)
 values(p_exchange_id,v_actor,btrim(p_body)) returning id into v_id;
 insert into public.notifications(user_id,title,body) values(v_other,'New exchange message',e.title);
 return v_id;
end $$;

create or replace function public.bank_give_kudos(p_exchange_id bigint,p_labels text[],p_note text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); e public.exchanges%rowtype; v_recipient uuid; v_id bigint;
begin
 select * into e from public.exchanges where id=p_exchange_id;
 if not found or e.status<>'completed' or v_actor not in (e.provider_id,e.requester_id) then
   raise exception 'Completed exchange not found'; end if;
 if coalesce(array_ndims(p_labels),1)<>1 or
    coalesce(array_length(p_labels,1),0) not between 1 and 5 or exists (
   select 1 from unnest(coalesce(p_labels,'{}'::text[])) x
   where x is null or x <> all(array[
     'Great Teacher','Patient Listener','Creative Problem-Solver',
     'Reliable & Punctual','Generous Spirit'
   ])
 ) or char_length(coalesce(p_note,''))>1000 then
   raise exception 'Invalid kudos'; end if;
 v_recipient:=case when v_actor=e.provider_id then e.requester_id else e.provider_id end;
 insert into public.kudos(exchange_id,sender_id,recipient_id,labels,note)
 values(p_exchange_id,v_actor,v_recipient,coalesce(p_labels,'{}'),nullif(btrim(p_note),''))
 on conflict (exchange_id,sender_id) do nothing returning id into v_id;
 if v_id is null then select id into v_id from public.kudos where exchange_id=p_exchange_id and sender_id=v_actor;
 else insert into public.notifications(user_id,title,body) values(v_recipient,'You received kudos',e.title); end if;
 return v_id;
end $$;

create or replace function public.bank_donate(p_minutes integer,p_note text,p_request_id uuid)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); v_balance integer; v_id bigint;
        v_key public.bank_operation_keys%rowtype; v_hash text; v_reserved bigint;
begin
 if p_request_id is null or p_minutes is null or p_minutes not between 1 and 10080 or char_length(coalesce(p_note,''))>1000 then raise exception 'Invalid donation'; end if;
 v_hash:=md5(p_minutes::text||':'||coalesce(p_note,''));
 insert into public.bank_operation_keys(request_id,user_id,kind,payload_hash)
 values(p_request_id,v_actor,'donation',v_hash) on conflict (request_id) do nothing;
 select * into v_key from public.bank_operation_keys where request_id=p_request_id for update;
 if v_key.user_id<>v_actor or v_key.kind<>'donation' or v_key.payload_hash<>v_hash then
   raise exception 'Donation request ID reused with different details';
 end if;
 if v_key.result_id is not null then return v_key.result_id; end if;
 -- Account first, then fund: the same order is used for fund approval.
 select balance_minutes into v_balance from public.accounts where user_id=v_actor for update;
 if v_balance is null then raise exception 'Account not found'; end if;
 select coalesce(sum(minutes),0) into v_reserved from public.exchanges
   where requester_id=v_actor and status='accepted';
 if v_balance::bigint-v_reserved<p_minutes then raise exception 'Insufficient available minutes'; end if;
 update public.accounts set balance_minutes=v_balance-p_minutes where user_id=v_actor;
 update public.community_fund set balance_minutes=balance_minutes+p_minutes where id=1;
 insert into public.ledger_entries(user_id,amount_minutes,balance_after_minutes,kind,description)
 values(v_actor,-p_minutes,v_balance-p_minutes,'donation','Community fund donation: '||left(coalesce(p_note,''),100))
 returning id into v_id;
 update public.bank_operation_keys set result_id=v_id where request_id=p_request_id;
 return v_id;
end $$;

create or replace function public.bank_request_fund(p_minutes integer,p_reason text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); v_id bigint;
begin
 if p_minutes is null or p_minutes not between 1 and 10080 or char_length(btrim(coalesce(p_reason,''))) not between 10 and 2000 then
   raise exception 'Invalid fund request'; end if;
 insert into public.fund_requests(user_id,minutes,reason)
 values(v_actor,p_minutes,btrim(p_reason)) returning id into v_id;
 insert into public.notifications(user_id,title,body)
 select user_id,'New fund request','A private fund request needs review'
 from public.member_roles where role='facilitator' and user_id<>v_actor;
 return v_id;
end $$;

create or replace function public.bank_review_fund(p_id bigint,p_decision text)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); r public.fund_requests%rowtype;
        v_balance integer; v_fund integer;
begin
 if not public.bank_is_facilitator() then raise exception 'Facilitator role required'; end if;
 if p_decision is null or p_decision not in ('approve','decline') then raise exception 'Invalid decision'; end if;
 select * into r from public.fund_requests where id=p_id for update;
 if not found or r.status<>'pending' then raise exception 'Pending fund request not found'; end if;
 if r.user_id=v_actor then raise exception 'Facilitators cannot review their own fund requests'; end if;
 if p_decision='approve' then
   -- Account first, fund second, matching donations.
   select balance_minutes into v_balance from public.accounts where user_id=r.user_id for update;
   select balance_minutes into v_fund from public.community_fund where id=1 for update;
   if v_fund<r.minutes then raise exception 'Community fund has insufficient minutes'; end if;
   update public.accounts set balance_minutes=v_balance+r.minutes where user_id=r.user_id;
   update public.community_fund set balance_minutes=v_fund-r.minutes where id=1;
   insert into public.ledger_entries(user_id,amount_minutes,balance_after_minutes,kind,fund_request_id,description)
   values(r.user_id,r.minutes,v_balance+r.minutes,'fund',p_id,'Community fund request #'||p_id);
 end if;
 update public.fund_requests set status=case when p_decision='approve' then 'approved' else 'declined' end,
   reviewed_at=now(),reviewed_by=v_actor where id=p_id;
 insert into public.notifications(user_id,title,body)
 values(r.user_id,case when p_decision='approve' then 'Fund request approved' else 'Fund request declined' end,
        'Request #'||p_id);
 return p_id;
end $$;

create or replace function public.bank_create_project(p_title text,p_description text,p_category text,p_goal_minutes integer)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); v_id bigint;
begin
 if char_length(btrim(coalesce(p_title,''))) not between 3 and 120 or
    char_length(btrim(coalesce(p_description,''))) not between 10 and 4000 or
    char_length(btrim(coalesce(p_category,''))) not between 2 and 80 or
    p_goal_minutes is null or p_goal_minutes not between 1 and 1000000 then raise exception 'Invalid project'; end if;
 insert into public.projects(owner_id,title,description,category,goal_minutes)
 values(v_actor,btrim(p_title),btrim(p_description),btrim(p_category),p_goal_minutes)
 returning id into v_id;
 return v_id;
end $$;

create or replace function public.bank_contribute_project(p_project_id bigint,p_minutes integer,p_note text,p_request_id uuid)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); v_owner uuid; v_id bigint;
        v_key public.bank_operation_keys%rowtype; v_hash text;
begin
 if p_request_id is null or p_project_id is null or p_minutes is null or p_minutes not between 1 and 2880 or char_length(coalesce(p_note,''))>1000 then raise exception 'Invalid contribution'; end if;
 v_hash:=md5(p_project_id::text||':'||p_minutes::text||':'||coalesce(p_note,''));
 insert into public.bank_operation_keys(request_id,user_id,kind,payload_hash)
 values(p_request_id,v_actor,'project_contribution',v_hash) on conflict (request_id) do nothing;
 select * into v_key from public.bank_operation_keys where request_id=p_request_id for update;
 if v_key.user_id<>v_actor or v_key.kind<>'project_contribution' or v_key.payload_hash<>v_hash then
   raise exception 'Contribution request ID reused with different details';
 end if;
 if v_key.result_id is not null then return v_key.result_id; end if;
 select owner_id into v_owner from public.projects where id=p_project_id and active for update;
 if v_owner is null then raise exception 'Active project not found'; end if;
 insert into public.project_contributions(project_id,user_id,minutes,note)
 values(p_project_id,v_actor,p_minutes,nullif(btrim(p_note),'')) returning id into v_id;
 update public.bank_operation_keys set result_id=v_id where request_id=p_request_id;
 if v_owner<>v_actor then
   insert into public.notifications(user_id,title,body) values(v_owner,'Project contribution','A member contributed to your project');
 end if;
 return v_id;
end $$;

create or replace function public.bank_close_project(p_id bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); v_id bigint;
begin
 update public.projects set active=false where id=p_id and owner_id=v_actor returning id into v_id;
 if v_id is null then raise exception 'Project not found'; end if;
 return v_id;
end $$;

create or replace function public.bank_amplify_want(p_id bigint)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor(); v_id bigint; v_title text;
begin
 -- Serializes all amplification attempts by this member, across different wants.
 perform 1 from public.member_preferences where user_id=v_actor for update;
 if exists(select 1 from public.wants where user_id=v_actor and amplified_at>=now()-interval '24 hours') then
   raise exception 'Urgent alerts are limited to one per day';
 end if;
 update public.wants set is_urgent=true,amplified_at=now()
 where id=p_id and user_id=v_actor and active
   and (amplified_at is null or amplified_at < now()-interval '7 days')
 returning id,title into v_id,v_title;
 if v_id is null then raise exception 'Want not found or urgent alert is on cooldown'; end if;
 insert into public.notifications(user_id,title,body)
 select user_id,'Urgent community request',v_title
 from public.member_preferences where urgent_opt_in and user_id<>v_actor;
 return v_id;
end $$;

create or replace function public.bank_set_urgent_opt_in(p_enabled boolean)
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor();
begin
 if p_enabled is null then raise exception 'Preference required'; end if;
 insert into public.member_preferences(user_id,urgent_opt_in) values(v_actor,p_enabled)
 on conflict (user_id) do update set urgent_opt_in=excluded.urgent_opt_in;
 return null;
end $$;

create or replace function public.bank_read_notifications(p_ids bigint[])
returns bigint language plpgsql security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor();
begin
 if p_ids is null or coalesce(array_ndims(p_ids),1)<>1 or
    coalesce(array_length(p_ids,1),0) not between 1 and 100 or exists (
   select 1 from unnest(p_ids) x where x is null or x<1
 ) then raise exception 'Invalid notification IDs'; end if;
 update public.notifications set read_at=coalesce(read_at,now())
 where user_id=v_actor and id=any(coalesce(p_ids,'{}'::bigint[]));
 return null;
end $$;

create or replace function public.bank_project_summaries()
returns table(project_id bigint,current_minutes bigint,contributor_count bigint)
language plpgsql stable security definer set search_path = '' as $$
begin
 perform public.bank_actor();
 return query
 select p.id,coalesce(sum(c.minutes),0)::bigint,count(distinct c.user_id)::bigint
 from public.projects p left join public.project_contributions c on c.project_id=p.id
 group by p.id;
end $$;

create or replace function public.bank_account_summary()
returns table(balance_minutes integer,reserved_minutes bigint,available_minutes bigint)
language plpgsql stable security definer set search_path = '' as $$
declare v_actor uuid := public.bank_actor();
begin
 return query
 select a.balance_minutes,coalesce(r.reserved,0)::bigint,
        a.balance_minutes::bigint-coalesce(r.reserved,0)::bigint
 from public.accounts a
 left join lateral (
   select sum(e.minutes) as reserved from public.exchanges e
   where e.requester_id=a.user_id and e.status='accepted'
 ) r on true
 where a.user_id=v_actor;
 if not found then raise exception 'Account not found'; end if;
end $$;

create or replace function public.bank_public_summary()
returns table(member_count bigint,completed_exchanges bigint,contributed_minutes bigint,active_projects bigint)
language sql stable security definer set search_path = '' as $$
 select (select count(*) from public.profiles p join auth.users u on u.id=p.id
         where u.email_confirmed_at is not null),
        (select count(*) from public.exchanges where status='completed'),
        (select coalesce(sum(minutes),0) from public.exchanges where status='completed') +
        (select coalesce(sum(minutes),0) from public.project_contributions),
        (select count(*) from public.projects where active)
$$;

-- Functions are created by the migration owner; SECURITY DEFINER bypasses
-- client table grants. Exactly these entry points are exposed to members.
do $$ declare r record; begin
 for r in select p.oid::regprocedure as signature,p.proname
          from pg_proc p join pg_namespace n on n.oid=p.pronamespace
          where n.nspname='public' and p.proname like 'bank_%' loop
   execute format('revoke all on function %s from public,anon,authenticated',r.signature);
 end loop;
end $$;
grant execute on function
  public.bank_is_member(),public.bank_actor(),public.bank_is_facilitator(),
  public.bank_save_listing(text,bigint,text,text,text,text[]),
  public.bank_archive_listing(text,bigint),
  public.bank_request_exchange(text,bigint,integer,text),
  public.bank_exchange_action(bigint,text),
  public.bank_send_message(bigint,text),
  public.bank_give_kudos(bigint,text[],text),
  public.bank_donate(integer,text,uuid),
  public.bank_request_fund(integer,text),
  public.bank_review_fund(bigint,text),
  public.bank_create_project(text,text,text,integer),
  public.bank_contribute_project(bigint,integer,text,uuid),
  public.bank_close_project(bigint),
  public.bank_amplify_want(bigint),
  public.bank_set_urgent_opt_in(boolean),
  public.bank_read_notifications(bigint[]),
  public.bank_project_summaries(),
  public.bank_account_summary()
to authenticated;
grant execute on function public.bank_public_summary() to anon,authenticated;
commit;
