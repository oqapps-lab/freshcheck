-- Storage bucket for scan photos. Each user writes under their own
-- uid/ prefix; public reads are allowed so signed URLs aren't needed
-- for in-app image display. Switch to private + signed URLs before prod.

insert into storage.buckets (id, name, public)
values ('scans', 'scans', true)
on conflict (id) do nothing;

create policy "scans bucket: self upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'scans' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "scans bucket: self update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'scans' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "scans bucket: self delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'scans' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "scans bucket: public read"
  on storage.objects for select
  using (bucket_id = 'scans');
