-- Public "media" bucket for product/testimonial/section images uploaded
-- from the admin dashboard. Same admin model as everything else: no public
-- signup, so "authenticated" means admin -- see the note at the top of
-- 20260906120000_init_schema.sql.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "public reads media"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'media');

create policy "authenticated uploads media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'media');

create policy "authenticated updates media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'media')
  with check (bucket_id = 'media');

create policy "authenticated deletes media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'media');
