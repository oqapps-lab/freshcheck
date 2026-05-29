-- recipe-images
--
-- Slug-keyed cache for gpt-image-1 hero photos produced by the
-- generate-recipes pipeline. Same slug across users hits the same
-- cached object (one image generated, served to many) — huge cost
-- saving vs per-user image generation. The bucket was originally
-- created via the Supabase dashboard rather than a tracked migration;
-- this file backfills it so a fresh `supabase db push` on a new
-- project still ends up with a working recipe-image edge fn.
--
-- Public read on purpose: the in-app <Image> component pulls the URL
-- directly via getPublicUrl without signed URLs. Writes are restricted
-- to service_role (the edge fn) — clients never upload here directly.
--
-- Idempotent: `on conflict do nothing` + `do…begin…if not exists`
-- so re-applying against the existing prod project is a no-op.

insert into storage.buckets (id, name, public)
values ('recipe-images', 'recipe-images', true)
on conflict (id) do nothing;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'storage'
      and tablename = 'objects'
      and policyname = 'recipe-images bucket: public read'
  ) then
    create policy "recipe-images bucket: public read"
      on storage.objects for select
      using (bucket_id = 'recipe-images');
  end if;
end$$;
