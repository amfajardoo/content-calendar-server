-- Create a secure trigger function that inserts a profile row when a new auth.user is created
create or replace function public.handle_new_user_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.users (id, name, currency, "createdAt")
  values (
    new.id,
    coalesce(new.raw_user_meta_data->> 'name', 'Anonymous'),
    'USD',
    now() at time zone 'utc'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Trigger on auth.users to call the function after a new user is inserted
drop trigger if exists auth_handle_new_user on auth.users;
create trigger auth_handle_new_user
after insert on auth.users
for each row
execute function public.handle_new_user_trigger();

-- Revoke execute to prevent anon/authenticated from running the security definer function directly
revoke execute on function public.handle_new_user_trigger() from authenticated, anon;