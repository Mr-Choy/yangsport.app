# **Database Schema (Production v2.0)**

This schema extends the original loyalty system to include the **Badminton Arsenal** and **Stringing Management** features.  
`-- =========================`  
`-- 1. EXTENSIONS`  
`-- =========================`  
`create extension if not exists "uuid-ossp";`

`-- =========================`  
`-- 2. CUSTOMERS TABLE`  
`-- =========================`  
`create table customers (`  
  `id uuid primary key default uuid_generate_v4(),`  
  `phone text not null,`  
  `name text,`  
  `stamps integer not null default 0,`  
  `total_earned integer not null default 0,`  
  `total_redeemed integer not null default 0,`  
  `last_visit timestamp,`  
  `created_at timestamp default now()`  
`);`

`create unique index idx_customers_phone_unique on customers(phone);`

`-- =========================`  
`-- 3. TRANSACTIONS TABLE`  
`-- =========================`  
`create table transactions (`  
  `id uuid primary key default uuid_generate_v4(),`  
  `customer_id uuid references customers(id) on delete cascade,`  
  `type text not null check (type in ('earn', 'redeem', 'stringing_service')),`  
  `stamp_change integer not null default 0,`  
  `note text,`  
  `created_at timestamp default now()`  
`);`

`create index idx_transactions_customer on transactions(customer_id);`

`-- =========================`  
`-- 4. REWARDS CONFIG TABLE`  
`-- =========================`  
`create table rewards (`  
  `id uuid primary key default uuid_generate_v4(),`  
  `name text not null,`  
  `threshold integer not null,`  
  `is_active boolean default true,`  
  `created_at timestamp default now()`  
`);`

`-- Default rewards`  
`insert into rewards (name, threshold) values`  
`('Small Reward', 3),`  
`('Medium Reward', 6),`  
`('Big Reward', 10);`

`-- =========================`  
`-- 5. NEW: STRINGING SERVICES TABLE (The Arsenal)`  
`-- =========================`  
`create table stringing_services (`  
  `id uuid primary key default uuid_generate_v4(),`  
  `customer_id uuid references customers(id) on delete cascade,`  
    
  `-- Racket Info`  
  `racket_brand text not null,`  
  `racket_model text not null,`  
    
  `-- String Info`  
  `string_brand text not null,`  
  `string_model text not null,`  
  `tension_lbs integer not null,`  
    
  `service_date date default current_date,`  
  `note text,`  
  `created_at timestamp default now()`  
`);`

`create index idx_stringing_customer on stringing_services(customer_id);`

`-- =========================`  
`-- 6. NEW: EQUIPMENT PRESETS (For UI Search/Suggestions)`  
`-- =========================`  
`create table equipment_presets (`  
  `id uuid primary key default uuid_generate_v4(),`  
  `category text not null check (category in ('racket_brand', 'string_brand')),`  
  `name text not null,`  
  `models text[] -- Array of popular models for that brand`  
`);`

`-- Initial Presets`  
`insert into equipment_presets (category, name, models) values`  
`('racket_brand', 'Yonex', ARRAY['Astrox 99', 'Nanoflare 800', 'Duora 10']),`  
`('racket_brand', 'Victor', ARRAY['Thruster K', 'Auraspeed 90K']),`  
`('string_brand', 'Yonex', ARRAY['BG66UM', 'BG80', 'Exbolt 63']);`

`-- =========================`  
`-- 7. BUSINESS LOGIC: FUNCTIONS`  
`-- =========================`

`-- Add Stamp Function`  
`create or replace function add_stamp(cust_id uuid)`  
`returns void as $$`  
`begin`  
  `update customers`  
  `set`  
    `stamps = stamps + 1,`  
    `total_earned = total_earned + 1,`  
    `last_visit = now()`  
  `where id = cust_id;`

  `insert into transactions(customer_id, type, stamp_change)`  
  `values (cust_id, 'earn', 1);`  
`end;`  
`$$language plpgsql;`

`-- Record Stringing & Add Transaction`  
`create or replace function record_stringing(`  
  `cust_id uuid,`  
  `r_brand text,`  
  `r_model text,`  
  `s_brand text,`  
  `s_model text,`  
  `tension int,`  
  `s_date date`  
`) returns void as$$`  
`begin`  
  `-- Insert into Arsenal`  
  `insert into stringing_services(customer_id, racket_brand, racket_model, string_brand, string_model, tension_lbs, service_date)`  
  `values (cust_id, r_brand, r_model, s_brand, s_model, tension, s_date);`

  `-- Insert into Transaction log (as a service record)`  
  `insert into transactions(customer_id, type, stamp_change, note)`  
  `values (cust_id, 'stringing_service', 0, r_brand || ' ' || r_model || ' Stringing');`  
`end;`  
`$$ language plpgsql;`  
