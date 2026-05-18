-- ============================================================
-- Yang Sport — Supabase Schema (merged: loyalty + Arsenal addon)
-- Idempotent: safe to re-run.
-- ============================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. CUSTOMERS
create table if not exists customers (
  id             uuid primary key default uuid_generate_v4(),
  phone          text not null,
  name           text,
  stamps         integer not null default 0,
  total_earned   integer not null default 0,
  total_redeemed integer not null default 0,
  last_visit     timestamp,
  created_at     timestamp default now()
);

create unique index if not exists idx_customers_phone_unique
  on customers(phone);

-- 3. TRANSACTIONS
create table if not exists transactions (
  id           uuid primary key default uuid_generate_v4(),
  customer_id  uuid references customers(id) on delete cascade,
  type         text not null check (type in ('earn', 'redeem', 'stringing_service')),
  stamp_change integer not null default 0,
  note         text,
  created_at   timestamp default now()
);

create index if not exists idx_transactions_customer
  on transactions(customer_id);

-- 4. REWARDS (+ name_zh for the bilingual UI)
create table if not exists rewards (
  id         uuid primary key default uuid_generate_v4(),
  name       text not null,
  name_zh    text,
  threshold  integer not null,
  is_active  boolean default true,
  created_at timestamp default now()
);

-- Add name_zh if the table already existed without it
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'rewards' and column_name = 'name_zh'
  ) then
    alter table rewards add column name_zh text;
  end if;
end $$;

-- 5. STRINGING SERVICES (Arsenal)
create table if not exists stringing_services (
  id            uuid primary key default uuid_generate_v4(),
  customer_id   uuid references customers(id) on delete cascade,
  racket_brand  text not null,
  racket_model  text not null,
  string_brand  text not null,
  string_model  text not null,
  tension_lbs   integer not null,
  service_date  date default current_date,
  note          text,
  created_at    timestamp default now()
);

create index if not exists idx_stringing_customer
  on stringing_services(customer_id);

-- 6. EQUIPMENT PRESETS
create table if not exists equipment_presets (
  id       uuid primary key default uuid_generate_v4(),
  category text not null check (category in ('racket_brand', 'string_brand')),
  name     text not null,
  models   text[]
);

-- ============================================================
-- RPC: business logic
-- ============================================================

create or replace function add_stamp(cust_id uuid)
returns void as $$
begin
  update customers
  set stamps = stamps + 1,
      total_earned = total_earned + 1,
      last_visit = now()
  where id = cust_id;

  insert into transactions(customer_id, type, stamp_change)
  values (cust_id, 'earn', 1);
end;
$$ language plpgsql;

create or replace function redeem_stamp(cust_id uuid, amount int)
returns void as $$
begin
  update customers
  set stamps = stamps - amount,
      total_redeemed = total_redeemed + amount
  where id = cust_id;

  insert into transactions(customer_id, type, stamp_change, note)
  values (cust_id, 'redeem', -amount, 'reward redeemed');
end;
$$ language plpgsql;

create or replace function record_stringing(
  cust_id  uuid,
  r_brand  text,
  r_model  text,
  s_brand  text,
  s_model  text,
  tension  int,
  s_date   date
) returns void as $$
begin
  insert into stringing_services(customer_id, racket_brand, racket_model,
                                 string_brand, string_model, tension_lbs, service_date)
  values (cust_id, r_brand, r_model, s_brand, s_model, tension, s_date);

  update customers set last_visit = now() where id = cust_id;

  insert into transactions(customer_id, type, stamp_change, note)
  values (cust_id, 'stringing_service', 0, r_brand || ' ' || r_model || ' stringing');
end;
$$ language plpgsql;

-- ============================================================
-- ROW LEVEL SECURITY  (MVP: open for single-merchant mode)
-- ⚠️ For production, replace with merchant_id-scoped policies.
-- ============================================================

alter table customers          enable row level security;
alter table transactions       enable row level security;
alter table rewards            enable row level security;
alter table stringing_services enable row level security;
alter table equipment_presets  enable row level security;

drop policy if exists "allow all customers"          on customers;
drop policy if exists "allow all transactions"       on transactions;
drop policy if exists "allow all rewards"            on rewards;
drop policy if exists "allow all stringing_services" on stringing_services;
drop policy if exists "allow all equipment_presets"  on equipment_presets;

create policy "allow all customers"          on customers          for all using (true) with check (true);
create policy "allow all transactions"       on transactions       for all using (true) with check (true);
create policy "allow all rewards"            on rewards            for all using (true) with check (true);
create policy "allow all stringing_services" on stringing_services for all using (true) with check (true);
create policy "allow all equipment_presets"  on equipment_presets  for all using (true) with check (true);
