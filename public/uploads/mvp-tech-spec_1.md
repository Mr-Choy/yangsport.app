# MVP Tech Spec
## Stack: Next.js + Supabase

---

# 🧠 1. Architecture Overview

**Frontend:**
- Next.js (App Router)
- TailwindCSS

**Backend:**
- Supabase (Postgres + Auth optional)

**Flow:**
```
Client → Supabase API → Database
```

---

# 🗄️ 2. Supabase Database Schema (SQL)

## 2.1 customers

```sql
create table customers (
  id uuid primary key default uuid_generate_v4(),
  phone text unique not null,
  stamps integer default 0,
  created_at timestamp default now()
);
```

---

## 2.2 transactions

```sql
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references customers(id) on delete cascade,
  type text check (type in ('earn', 'redeem')),
  value integer not null,
  created_at timestamp default now()
);
```

---

## 2.3 Index（优化查询）

```sql
create index idx_customers_phone on customers(phone);
create index idx_transactions_customer_id on transactions(customer_id);
```

---

# ⚙️ 3. Core Business Logic

## Reward Rules（hardcoded）

```javascript
const REWARDS = [
  { threshold: 3, cost: 3 },
  { threshold: 6, cost: 6 },
  { threshold: 10, cost: 10 },
];
```

---

# 🔌 4. API Design

## 4.1 Get Customers

```
GET /api/customers
```

**Response:**

```json
[
  { "id": "...", "phone": "0123456789", "stamps": 3 }
]
```

---

## 4.2 Create / Get Customer

```
POST /api/customers
```

**Body:**

```json
{ "phone": "0123456789" }
```

**Logic:**

- If exists → return existing
- Else → create new

---

## 4.3 Add Stamp

```
POST /api/customers/:id/stamp
```

**Logic:**

- +1 stamp
- insert transaction

---

## 4.4 Redeem Reward

```
POST /api/customers/:id/redeem
```

**Logic:**

- check threshold
- deduct stamps
- insert transaction

---

# 🧩 5. Supabase Client Setup

## Install

```bash
npm install @supabase/supabase-js
```

---

## client.ts

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

# 🖥️ 6. Frontend Structure (Next.js)

```
/app
  /page.tsx                → Customers Page
  /customer/[id]/page.tsx → Customer Detail
  /promotion/page.tsx     → Promotion

/lib
  supabase.ts

/components
  CustomerList.tsx
  StampIndicator.tsx
  AddStampButton.tsx
  RedeemButton.tsx
```

---

# 🧱 7. Core UI Logic

## 7.1 Add Stamp

```typescript
const addStamp = async (id: string) => {
  await fetch(`/api/customers/${id}/stamp`, {
    method: "POST"
  });
};
```

---

## 7.2 Redeem

```typescript
const redeem = async (id: string) => {
  await fetch(`/api/customers/${id}/redeem`, {
    method: "POST"
  });
};
```

---

# 🔄 8. Example API Route (Next.js)

## /api/customers/route.ts

```typescript
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  const { phone } = await req.json();

  const { data: existing } = await supabase
    .from("customers")
    .select("*")
    .eq("phone", phone)
    .single();

  if (existing) return Response.json(existing);

  const { data } = await supabase
    .from("customers")
    .insert({ phone })
    .select()
    .single();

  return Response.json(data);
}
```

---

# ➕ 9. Stamp API

## /api/customers/[id]/stamp/route.ts

```typescript
export async function POST(req, { params }) {
  const id = params.id;

  // increment stamp
  await supabase.rpc("increment_stamp", { customer_id: id });

  return Response.json({ success: true });
}
```

---

# 🧠 10. Supabase Function (Optional but clean)

```sql
create or replace function increment_stamp(customer_id uuid)
returns void as $$
begin
  update customers
  set stamps = stamps + 1
  where id = customer_id;

  insert into transactions(customer_id, type, value)
  values (customer_id, 'earn', 1);
end;
$$ language plpgsql;
```

---

# 🎁 11. Redeem Logic (Server)

```typescript
const rewards = [10, 6, 3];

const getRedeemable = (stamps: number) => {
  return rewards.find(r => stamps >= r);
};
```

---

# 🚀 12. Deployment

- **Frontend:** Vercel
- **Backend:** Supabase

---

# 🔐 13. MVP Simplification

- ❌ No auth (single merchant)
- ❌ No multi-tenant
- ❌ No role system

---

# 🎯 14. Done Definition

- ✅ Can add customer
- ✅ Can add stamp
- ✅ Can redeem
- ✅ Data persists

---

# ✅ 你现在可以直接做什么

这份已经是**工程级 blueprint**，你可以：

## 👉 1. 直接开 Supabase

- 跑 SQL
- 建表

---

## 👉 2. 开 Next.js

```bash
npx create-next-app
```

---

## 👉 3. 接 API 开始写

---

# ⚠️ 我帮你踩坑（很重要）

你现在这个 MVP 最大风险不是技术，是 **flow 卡顿**。

所以你一定要做到：

| 需求 | 为什么 |
|------|--------|
| 输入手机号 → 自动创建 | 不要让用户等待或填表 |
| +stamp → 无确认 | 一键操作，快速反馈 |
| 不 reload 页面（用 state） | 无缝体验 = 留住用户 |

---

# 🎯 优先级顺序

```
Week 1: 数据库 + API
  ├── 建表
  └── 测试 CRUD

Week 2: 前端基础
  ├── 显示客户列表
  └── 显示章数

Week 3: 核心功能
  ├── 加章
  ├── 兑换
  └── 历史记录

Week 4: Polish
  ├── 错误处理
  ├── Loading states
  └── UI 优化
```

---
