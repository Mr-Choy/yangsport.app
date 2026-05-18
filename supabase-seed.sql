-- ============================================================
-- Yang Sport — Demo seed data (matches the prototype)
-- Idempotent: re-running won't duplicate rows.
-- Run AFTER supabase-schema.sql.
-- ============================================================

-- Rewards
insert into rewards (name, name_zh, threshold, is_active) values
  ('Wristband + Sport towel', '运动手环 + 毛巾',   3,  true),
  ('RM30 store voucher',      'RM30 抵用券',        6,  true),
  ('Young Sport jersey',      'Young Sport 球衣',   10, true)
on conflict do nothing;

-- Customers (use ON CONFLICT phone — phone is unique)
insert into customers (phone, name, stamps, total_earned, total_redeemed, last_visit, created_at) values
  ('0123450011', 'Aaron Tan',   8,  14, 6,  now(),                       now() - interval '142 days'),
  ('0193381122', 'Priya Nair',  6,  12, 6,  now(),                       now() - interval '87 days'),
  ('0167778899', 'Wei Ming',    10, 10, 0,  now() - interval '1 day',    now() - interval '53 days'),
  ('0145566021', 'Siti Aishah', 3,  6,  3,  now() - interval '2 days',   now() - interval '198 days'),
  ('0177012345', 'Daniel Lim',  1,  1,  0,  now(),                       now()),
  ('0119234567', 'Farah K.',    2,  5,  3,  now() - interval '4 days',   now() - interval '65 days'),
  ('0182233445', 'Kenny Goh',   0,  9,  9,  now() - interval '38 days',  now() - interval '312 days'),
  ('0136655443', 'Mei Lin',     5,  8,  3,  now() - interval '3 days',   now() - interval '110 days'),
  ('0148877665', 'Raj Kumar',   0,  13, 13, now() - interval '56 days',  now() - interval '401 days'),
  ('0153344556', 'Hui Min',     4,  4,  0,  now(),                       now() - interval '7 days')
on conflict (phone) do nothing;

-- Stringing services for Aaron Tan
do $$
declare aaron_id uuid;
begin
  select id into aaron_id from customers where phone = '0123450011';
  if aaron_id is not null and not exists (select 1 from stringing_services where customer_id = aaron_id) then
    insert into stringing_services (customer_id, racket_brand, racket_model, string_brand, string_model, tension_lbs, service_date, note) values
      (aaron_id, 'Yonex', 'Astrox 99 Pro', 'Yonex',   'BG66 Ultimax',   28, current_date - 3,   ''),
      (aaron_id, 'Yonex', 'Astrox 99 Pro', 'Yonex',   'BG66 Ultimax',   27, current_date - 28,  'broken main'),
      (aaron_id, 'Yonex', 'Nanoflare 800', 'Yonex',   'Exbolt 63',      27, current_date - 38,  ''),
      (aaron_id, 'Yonex', 'Astrox 99 Pro', 'Yonex',   'BG66 Ultimax',   27, current_date - 62,  ''),
      (aaron_id, 'Yonex', 'Astrox 99 Pro', 'Ashaway', 'Zymax 66 Fire',  26, current_date - 95,  'trial'),
      (aaron_id, 'Yonex', 'Nanoflare 800', 'Yonex',   'Aerobite Boost', 26, current_date - 130, ''),
      (aaron_id, 'Yonex', 'Astrox 99 Pro', 'Yonex',   'BG80 Power',     25, current_date - 168, '');
  end if;
end $$;

-- Stringing services for Priya Nair
do $$
declare cid uuid;
begin
  select id into cid from customers where phone = '0193381122';
  if cid is not null and not exists (select 1 from stringing_services where customer_id = cid) then
    insert into stringing_services (customer_id, racket_brand, racket_model, string_brand, string_model, tension_lbs, service_date) values
      (cid, 'Victor', 'Auraspeed 90K', 'Victor', 'VBS-66N',  26, current_date - 6),
      (cid, 'Victor', 'Auraspeed 90K', 'Victor', 'VBS-66N',  26, current_date - 42),
      (cid, 'Victor', 'Auraspeed 90K', 'Yonex',  'BG80 Power', 25, current_date - 88);
  end if;
end $$;

-- Stringing services for Wei Ming (fatigue case — last strung 91 days ago)
do $$
declare cid uuid;
begin
  select id into cid from customers where phone = '0167778899';
  if cid is not null and not exists (select 1 from stringing_services where customer_id = cid) then
    insert into stringing_services (customer_id, racket_brand, racket_model, string_brand, string_model, tension_lbs, service_date) values
      (cid, 'Li-Ning', 'Aeronaut 9000', 'Li-Ning', 'No.1', 24, current_date - 91),
      (cid, 'Li-Ning', 'Aeronaut 9000', 'Li-Ning', 'No.1', 24, current_date - 175);
  end if;
end $$;

-- Equipment presets
insert into equipment_presets (category, name, models) values
  ('racket_brand', 'Yonex',   ARRAY['Astrox 99 Pro', 'Astrox 100 ZZ', 'Nanoflare 800', 'Duora 10', 'Arcsaber 11 Pro']),
  ('racket_brand', 'Victor',  ARRAY['Thruster K Falcon', 'Auraspeed 90K', 'DriveX 9X', 'Brave Sword 12']),
  ('racket_brand', 'Li-Ning', ARRAY['Aeronaut 9000', 'Axforce 90', 'Halbertec 9000']),
  ('racket_brand', 'Mizuno',  ARRAY['Fortius 10 Power', 'JPX']),
  ('racket_brand', 'Apacs',   ARRAY['Z Ziggler', 'Feather Weight 75']),
  ('string_brand', 'Yonex',   ARRAY['BG66 Ultimax', 'BG80 Power', 'Exbolt 63', 'Aerobite Boost', 'Nanogy 99']),
  ('string_brand', 'Victor',  ARRAY['VBS-66N', 'VBS-69N', 'VBS-70']),
  ('string_brand', 'Li-Ning', ARRAY['No.1', 'No.7', 'Aypro 67']),
  ('string_brand', 'Ashaway', ARRAY['Zymax 66 Fire', 'Zymax 62 Fire'])
on conflict do nothing;
