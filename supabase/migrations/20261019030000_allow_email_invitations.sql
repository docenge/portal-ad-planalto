-- Invitations provide an email without full_name metadata. Keep the original
-- member role; administrative privileges are assigned separately in adp_admins.
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path=public,pg_temp as $$
begin
 insert into public.profiles(id,full_name,email,role)
 values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),new.email,'member');
 return new;
end;
$$;
