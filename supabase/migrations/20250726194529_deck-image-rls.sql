alter table "public"."decks" drop column "image_path";

CREATE UNIQUE INDEX cards_id_key ON public.cards USING btree (id);

CREATE UNIQUE INDEX decks_id_key ON public.decks USING btree (id);

alter table "public"."cards" add constraint "cards_id_key" UNIQUE using index "cards_id_key";

alter table "public"."decks" add constraint "decks_id_key" UNIQUE using index "decks_id_key";

create policy "Enable delete for users based on user_id"
on "public"."decks"
as permissive
for delete
to authenticated
using ((( SELECT auth.uid() AS uid) = member_id));


create policy "Enable update for authenticated users"
on "public"."decks"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = member_id));