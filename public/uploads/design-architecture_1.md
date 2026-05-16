# 🧠 设计说明（重点理解）

---

## 1️⃣ 为什么这样设计？

你这个产品本质是：

👉 **"customer + event log + simple rules"**

所以我给你拆成：

- **customers**（状态）
- **transactions**（事件）
- **rewards**（规则）

这是 **SaaS 标准结构** 👇

```
┌─────────────────────────────────────┐
│   Customers (State)                 │
│   ├── phone                         │
│   ├── current_stamps                │
│   └── metadata                      │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Transactions (Events)             │
│   ├── customer_id                   │
│   ├── action (add/redeem)           │
│   ├── amount                        │
│   └── timestamp                     │
└─────────────────────────────────────┘
           ↓
┌─────────────────────────────────────┐
│   Rewards (Rules)                   │
│   ├── threshold                     │
│   ├── reward_name                   │
│   └── reward_value                  │
└─────────────────────────────────────┘
```

---

## 2️⃣ 为什么加 transactions？

因为以后你会需要：

- 📅 **查历史** - 用户什么时候领的章？什么时候兑换的？
- 📊 **做 analytics** - 哪些用户活跃？哪些奖励最受欢迎？
- 🔄 **做 retention** - 找出即将流失的客户，自动推促销

**如果没有 transactions → 以后一定重写** ⚠️

---

## 3️⃣ 为什么 reward 独立表？

因为未来你会想要：

- 🔧 **改 reward（不改 code）** - 商家可以在后台自己改奖励规则，不需要我们改代码
- 🏪 **每个商家不同 reward（SaaS升级）** - 不同的商家可以设置不同的奖励梯度

| 场景 | 需要什么 |
|------|--------|
| MVP（现在） | 所有商家用同一套 reward | 一次性配置 |
| SaaS 升级 | 商家自己配置 reward | 拖拽 UI + 数据库存储 |

---

# ⚙️ Supabase RPC（你会用到的 API）

## ➕ Add Stamp

```sql
select add_stamp('customer-uuid');
```

**作用**：给客户加一个章

**返回**：
```json
{
  "success": true,
  "current_stamps": 2,
  "next_reward_at": 3
}
```

---

## 🎁 Redeem

```sql
select redeem_stamp('customer-uuid', 3);
```

**作用**：兑换 3 个章

**返回**：
```json
{
  "success": true,
  "remaining_stamps": 0,
  "reward": "Free Coffee"
}
```

---

## 📊 Get Redeemable Reward

```sql
select * from get_redeemable('customer-uuid');
```

**作用**：查看这个客户可以兑换什么奖励

**返回**：
```json
[
  {
    "threshold": 3,
    "reward_name": "Free Coffee",
    "is_redeemable": true
  },
  {
    "threshold": 6,
    "reward_name": "50% Off",
    "is_redeemable": false
  }
]
```

---

# 🚀 API 对应（你前端会这样用）

## Add Stamp

```javascript
await supabase.rpc("add_stamp", { cust_id })
```

**使用场景**：
- 客户购买后，点击"加章"按钮

---

## Redeem

```javascript
await supabase.rpc("redeem_stamp", {
  cust_id,
  amount: 3
})
```

**使用场景**：
- 客户达到 3 个章，可以兑换奖励

---

## Get Redeemable

```javascript
const rewards = await supabase
  .from('rewards')
  .select('*')
  .order('threshold', { ascending: true })
```

**使用场景**：
- 显示奖励梯度（3 章 → 咖啡，6 章 → 折扣，等等）

---

# 🔐 安全设计（重要但简单）

## 现在 MVP：

- ✅ **RLS = open**（允许全部）
  - 原因：专注功能，暂时不用登录系统
  
- ✅ **单 merchant 模式**
  - 原因：快速验证商业模式

---

## 以后升级：

- 🔒 **merchant_id → multi-tenant**
  - 一个数据库服务多个商家
  - 通过 merchant_id 隔离数据

- 🔑 **auth.users → login**
  - 每个商家有自己的账号
  - RLS 规则：`auth.uid == row.owner_id`

```sql
-- RLS 规则示例（以后用）
CREATE POLICY "只看自己的数据" ON customers
  FOR SELECT USING (merchant_id = auth.user_id);
```

---

# 🧱 你现在拥有的 backend

你现在这个 backend 已经是：

| ✔ | 特性 | 说明 |
|---|------|------|
| ✔ | **可上线** | 所有表都齐全，RPC 都写好了 |
| ✔ | **可扩展 SaaS** | 结构支持未来加 merchant_id |
| ✔ | **可做多店系统** | 数据隔离已预留位置 |
| ✔ | **可做数据分析** | transactions 表记录所有事件 |
| ✔ | **可直接接 Next.js** | RPC 就是 API，supabase.rpc() 即可调用 |

---

# 🎯 下一步行动清单

- [ ] 确认 Supabase 项目创建完毕
- [ ] 跑一遍初始化 SQL 脚本
- [ ] 测试 RPC 函数
- [ ] 在 Next.js 中集成 supabase client
- [ ] 构建前端页面

---
