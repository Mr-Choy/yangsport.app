-- =========================
-- 1. EXTENSIONS
-- =========================
create extension if not exists "uuid-ossp";

-- =========================
-- 2. CUSTOMERS TABLE
-- =========================
create table customers (
  id uuid primary key default uuid_generate_v4(),
  phone text not null,
  name text,
  stamps integer not null default 0,
  total_earned integer not null default 0,
  total_redeemed integer not null default 0,
  last_visit timestamp,
  created_at timestamp default now()
);

create unique index idx_customers_phone_unique
on customers(phone);

-- =========================
-- 3. TRANSACTIONS TABLE
-- =========================
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete cascade,
  type text not null check (type in ('earn', 'redeem')),
  stamp_change integer not null,
  note text,
  created_at timestamp default now()
);

create index idx_transactions_customer
on transactions(customer_id);

-- =========================
-- 4. REWARDS CONFIG TABLE (future-proof)
-- =========================
create table rewards (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  threshold integer not null,
  is_active boolean default true,
  created_at timestamp default now()
);

-- default rewards
insert into rewards (name, threshold) values
('Small Reward', 3),
('Medium Reward', 6),
('Big Reward', 10);

-- =========================
-- 5. BUSINESS LOGIC: ADD STAMP
-- =========================
create or replace function add_stamp(cust_id uuid)
returns void as $$
begin
  update customers
  set
    stamps = stamps + 1,
    total_earned = total_earned + 1,
    last_visit = now()
  where id = cust_id;

  insert into transactions(customer_id, type, stamp_change)
  values (cust_id, 'earn', 1);
end;
$$ language plpgsql;

-- =========================
-- 6. BUSINESS LOGIC: REDEEM
-- =========================
create or replace function redeem_stamp(cust_id uuid, amount int)
returns void as $$
begin
  update customers
  set
    stamps = stamps - amount,
    total_redeemed = total_redeemed + amount
  where id = cust_id;

  insert into transactions(customer_id, type, stamp_change, note)
  values (cust_id, 'redeem', -amount, 'reward redeemed');
end;
$$ language plpgsql;

-- =========================
-- 7. GET REDEEMABLE REWARD
-- =========================
create or replace function get_redeemable(cust_id uuid)
returns table (
  reward_name text,
  threshold int
) as $$
begin
  return query
  select name, threshold
  from rewards
  where is_active = true
  order by threshold desc
  limit 1;
end;
$$ language plpgsql;

-- =========================
-- 8. ROW LEVEL SECURITY (IMPORTANT)
-- =========================

alter table customers enable row level security;
alter table transactions enable row level security;
alter table rewards enable row level security;

-- allow all (MVP single merchant mode)
create policy "allow all customers"
on customers for all
using (true)
with check (true);

create policy "allow all transactions"
on transactions for all
using (true)
with check (true);

create policy "allow all rewards"
on rewards for all
using (true)
with check (true);

-- =========================
-- 9. OPTIONAL: FUTURE MULTI-TENANT READY
-- =========================
-- (commented for now)
-- alter table customers add column merchant_id uuid;
-- alter table transactions add column merchant_id uuid;