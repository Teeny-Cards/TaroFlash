alter table "public"."members" drop column "theme";

alter table "public"."members" add column "avatar_url" text;

alter table "public"."members" add column "email" text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_member_on_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$begin
  insert into public.members (
    id,
    display_name,
    avatar_url,
    email
  )
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data->>'user_name',
      new.raw_user_meta_data->>'display_name',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url',
    new.email
  )
  on conflict (id) do nothing;

  return new;
end;$function$
;


