-- Ration-pack enquiries: new lead type plus a jsonb column for the
-- structured fields (packs per month, frequency, delivery location).
alter table leads drop constraint leads_type_check;
alter table leads add constraint leads_type_check
  check (type in ('general', 'quote', 'distributor', 'ration_pack'));

alter table leads add column details jsonb;
