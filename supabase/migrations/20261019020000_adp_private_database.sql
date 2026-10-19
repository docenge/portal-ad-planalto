-- New AD Planalto tables only. Existing application data is preserved.
begin;
create table if not exists public.adp_admins (
 user_id uuid primary key references auth.users(id) on delete cascade,
 can_manage_contacts boolean not null default false,
 can_manage_prayers boolean not null default false,
 can_manage_newsletter boolean not null default false,
 active boolean not null default true,
 created_at timestamptz not null default now()
);
create table if not exists public.adp_contacts (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 email text not null check(char_length(email)<=254),
 full_name text, street text, neighborhood text, city text, state text, postal_code text,
 phone text, whatsapp text,
 consent_version text not null,
 status text not null default 'novo' check(status in ('novo','em_atendimento','concluido')),
 expires_at timestamptz not null default (now()+interval '180 days')
);
create table if not exists public.adp_prayer_requests (
 id uuid primary key default gen_random_uuid(),
 contact_id uuid not null references public.adp_contacts(id) on delete cascade,
 created_at timestamptz not null default now(),
 request_text text not null check(char_length(request_text) between 1 and 3000),
 consent_version text not null,
 status text not null default 'novo' check(status in ('novo','em_oracao','concluido')),
 expires_at timestamptz not null default (now()+interval '90 days')
);
create table if not exists public.adp_newsletter_signups (
 id uuid primary key default gen_random_uuid(),
 email text not null unique check(char_length(email)<=254),
 created_at timestamptz not null default now(),
 consent_version text not null,
 status text not null default 'aguardando_confirmacao' check(status in ('aguardando_confirmacao','confirmado','cancelado'))
);
create table if not exists public.adp_admin_audit (
 id uuid primary key default gen_random_uuid(),
 created_at timestamptz not null default now(),
 admin_user_id uuid references auth.users(id),
 action text not null,
 record_id uuid
);
alter table public.adp_admins enable row level security;
alter table public.adp_contacts enable row level security;
alter table public.adp_prayer_requests enable row level security;
alter table public.adp_newsletter_signups enable row level security;
alter table public.adp_admin_audit enable row level security;
revoke all on public.adp_admins, public.adp_contacts, public.adp_prayer_requests, public.adp_newsletter_signups, public.adp_admin_audit from anon, authenticated;
grant select,insert,update,delete on public.adp_admins, public.adp_contacts, public.adp_prayer_requests, public.adp_newsletter_signups, public.adp_admin_audit to service_role;
create or replace function public.adp_submit_contact(payload jsonb) returns void language plpgsql security definer set search_path=public,pg_temp as $$
declare contact_id uuid;
begin
 insert into public.adp_contacts(email,full_name,street,neighborhood,city,state,postal_code,phone,whatsapp,consent_version)
 values(payload->>'email',payload->>'fullName',payload->>'street',payload->>'neighborhood',payload->>'city',payload->>'state',payload->>'postalCode',payload->>'phone',payload->>'whatsapp','2026-10-19-v1') returning id into contact_id;
 if coalesce(payload->>'prayer','')<>'' then
  if payload->>'prayerConsent'<>'true' then raise exception 'Prayer consent required'; end if;
  insert into public.adp_prayer_requests(contact_id,request_text,consent_version) values(contact_id,payload->>'prayer','2026-10-19-v1');
 end if;
end;
$$;
revoke all on function public.adp_submit_contact(jsonb) from public, anon, authenticated;
grant execute on function public.adp_submit_contact(jsonb) to service_role;
commit;
select tablename, rowsecurity from pg_tables where schemaname='public' and tablename like 'adp_%' order by tablename;
