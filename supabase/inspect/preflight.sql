-- READ-ONLY preflight for the actual Supabase project. Run before any migration.
-- This file reads metadata and aggregate counts only. It does not print users,
-- emails, passwords, tokens, or individual balances.

select current_database() as database_name,current_user as executing_role,
       current_setting('server_version') as postgres_version;

select n.nspname as schema_name,c.relname as relation_name,c.relkind,
       c.relrowsecurity as rls_enabled,c.relforcerowsecurity as rls_forced,
       c.reltuples::bigint as estimated_rows
from pg_class c join pg_namespace n on n.oid=c.relnamespace
where (n.nspname='public' and c.relname=any(array[
  'profiles','offers','wants','accounts','member_preferences','member_roles',
  'exchanges','legacy_exchanges','transactions','exchange_messages','ledger_entries',
  'notifications','kudos','community_fund','fund_requests','projects',
  'project_contributions','bank_operation_keys']))
   or (n.nspname='supabase_migrations' and c.relname='schema_migrations')
order by 1,2;

select table_name,column_name,data_type,is_nullable,column_default
from information_schema.columns
where table_schema='public' and table_name=any(array[
  'profiles','offers','wants','accounts','exchanges','transactions','ledger_entries',
  'community_fund','fund_requests','projects','project_contributions'])
order by table_name,ordinal_position;

select schemaname,tablename,policyname,cmd,roles,qual,with_check
from pg_policies
where schemaname='public' and tablename=any(array[
  'profiles','offers','wants','accounts','member_roles','exchanges','legacy_exchanges',
  'transactions','ledger_entries','fund_requests','community_fund'])
order by tablename,policyname;

select r.rolname,r.rolbypassrls,r.rolsuper,
       c.relname as table_name,
       has_table_privilege(r.oid,c.oid,'SELECT') as table_select,
       has_table_privilege(r.oid,c.oid,'INSERT') as table_insert,
       has_table_privilege(r.oid,c.oid,'UPDATE') as table_update,
       has_table_privilege(r.oid,c.oid,'DELETE') as table_delete
from pg_roles r cross join pg_class c join pg_namespace n on n.oid=c.relnamespace
where r.rolname=any(array['anon','authenticated','service_role'])
  and n.nspname='public' and c.relname=any(array[
    'profiles','offers','wants','accounts','member_roles','exchanges',
    'legacy_exchanges','transactions','ledger_entries','fund_requests'])
order by r.rolname,c.relname;

select r.rolname,a.attname as profile_column,
       has_column_privilege(r.oid,to_regclass('public.profiles'),a.attname,'SELECT') as can_select,
       has_column_privilege(r.oid,to_regclass('public.profiles'),a.attname,'UPDATE') as can_update
from pg_roles r cross join pg_attribute a
where to_regclass('public.profiles') is not null
  and r.rolname=any(array['anon','authenticated'])
  and a.attrelid=to_regclass('public.profiles') and a.attnum>0 and not a.attisdropped
order by r.rolname,a.attnum;

select n.nspname,p.proname,p.oid::regprocedure as signature,
       p.prosecdef as security_definer,p.proconfig as settings,
       r.rolname,has_function_privilege(r.oid,p.oid,'EXECUTE') as can_execute
from pg_proc p join pg_namespace n on n.oid=p.pronamespace
cross join pg_roles r
where n.nspname='public' and (
  p.proname like 'bank_%' or p.proname=any(array[
    'handle_new_user','create_exchange_request','accept_exchange_request',
    'decline_exchange_request','complete_exchange','cancel_exchange']))
  and r.rolname=any(array['anon','authenticated'])
order by p.proname,r.rolname;

select t.tgname as auth_user_trigger,n.nspname as function_schema,
       p.proname as function_name
from pg_trigger t join pg_proc p on p.oid=t.tgfoid
join pg_namespace n on n.oid=p.pronamespace
where t.tgrelid='auth.users'::regclass and not t.tgisinternal
order by t.tgname;

-- Exact aggregate counts and migration versions are printed as NOTICEs so
-- missing optional tables do not make the preflight fail.
do $$ declare v_table text; v_count bigint; v_version record;
          v_negative bigint; v_fractional bigint;
begin
 for v_table in select unnest(array[
   'profiles','offers','wants','accounts','exchanges','legacy_exchanges',
   'transactions','ledger_entries','fund_requests','projects','project_contributions']) loop
   if to_regclass(format('public.%I',v_table)) is not null then
     execute format('select count(*) from public.%I',v_table) into v_count;
     raise notice '%.rows = %',v_table,v_count;
   end if;
 end loop;
 if exists(select 1 from information_schema.columns where table_schema='public'
           and table_name='profiles' and column_name='time_balance') then
   execute 'select count(*) filter (where time_balance<0),
                   count(*) filter (where time_balance is not null and
                     time_balance::numeric*60 <> trunc(time_balance::numeric*60))
            from public.profiles' into v_negative,v_fractional;
   raise notice 'profiles.negative_legacy_balances = %',v_negative;
   raise notice 'profiles.fractional_minute_balances = %',v_fractional;
 end if;
 if to_regclass('supabase_migrations.schema_migrations') is not null then
   for v_version in execute 'select version::text as version from supabase_migrations.schema_migrations order by version' loop
     raise notice 'migration.version = %',v_version.version;
   end loop;
 else
   raise notice 'supabase_migrations.schema_migrations is absent';
 end if;
end $$;
