drop policy "Enable delete for users based on user_id" on "public"."cards";

alter table "public"."decks" add column "has_image" boolean default false;

alter table "public"."members" add column "theme" text default ''::text;

create policy "Enable delete for users based on user_id"
on "public"."cards"
as permissive
for delete
to public
using ((( SELECT auth.uid() AS uid) = member_id));



