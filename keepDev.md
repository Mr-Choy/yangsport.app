# Young Sport — 在另一台 Mac 上继续开发

## 1. 前置要求

- **Node.js ≥ 18**（本机开发版本 `v22.17.0`）
- **npm**（项目使用 `npm`，不要用 `pnpm` / `yarn`）
- **Git**
- 可选：**Supabase 账号**（现有项目可直接复用，见第 4 节）
- 可选：**GitNexus CLI**（代码分析工具，见第 9 节）

## 2. 克隆项目

```bash
git clone https://github.com/Mr-Choy/yangsport.app.git
cd yangsport.app
```

## 3. 安装依赖

```bash
npm install
```

⚠ **不要用 pnpm** — 项目用的是 `npm`（`package-lock.json`）。如果全局有 pnpm，确保当前目录没有 `pnpm-lock.yaml` 干扰。运行 `npm run dev` 时如果报 `Cannot find module '../server/require-hook'`，按第 12 节排错。

## 4. 配置 Supabase

有两种模式：

### 模式 A：不连数据库（快速体验）

无需任何配置，直接 `npm run dev`。App 使用内存种子数据（10 个客户、12 条穿线记录），所有功能正常，但**刷新页面后数据重置**。

### 模式 B：连接现有 Supabase 项目

```bash
cp .env.example .env.local
```

修改 `.env.local` 填入现有项目凭证：

```
NEXT_PUBLIC_SUPABASE_URL=https://qrlkozrlcuyqulckhkel.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_NOs3sLC2Bj7vAQg048cShw_0qq2FHfN
```

浏览器控制台出现 `[Yang Sport] Supabase connected` 即连接成功。

### 模式 C：创建全新 Supabase 项目

1. 在 [Supabase Dashboard](https://supabase.com) 创建新项目
2. 在 SQL Editor 中依次执行：
   - **先** `supabase-schema.sql` — 建表 + RPC 函数 + RLS
   - **后** `supabase-seed.sql` — 填充演示数据（幂等，可重复跑）
3. 从 Project Settings → API 复制 URL 和 Publishable Key 填入 `.env.local`

## 5. 启动开发服务器

```bash
npm run dev
```

浏览器打开 `http://localhost:3000`

## 6. 登录凭据

| 角色 | 路径 | 账号 |
|------|------|------|
| 商家 | `/login/admin` | `admin` / `1234` |
| 客户 | `/login/customer` | 任意种子手机号（如 `0123450011`），密码 `1234` |

> 会话保存在 `localStorage` 的 `yang_sport_session` 中。
> ⚠ 这是演示级安全。生产环境需接入 Supabase Auth + merchant_id RLS 策略。

## 7. 项目目录关系

```
/Users/.../yangsport/               # 根目录（本机，不提交 git）
├── yangsport.app/                  # ★ 主力开发目录（git 仓库）
├── webapp/                         # 开发副本（无 git，可删除）
└── backup/                         # 设计文档 & 旧版备份
```

| 目录 | git | GitNexus | 说明 |
|------|-----|----------|------|
| **`yangsport.app/`** | ✅ `origin → github.com/Mr-Choy/yangsport.app` | ✅ 已索引 | **所有开发在此进行** |
| `webapp/` | ❌ | ❌ | 早期本地副本，与 `yangsport.app/` 结构相同但无版本控制 |
| `backup/` | ❌ | ❌ | 设计稿、技术规格、旧版 SQL 等参考资料 |

> **建议：** 只维护 `yangsport.app/`，`webapp/` 可删除或保留作参考。

## 8. 项目结构速览

```
yangsport.app/
├── app/                          # Next.js App Router 页面
│   ├── layout.tsx                # 根布局 (Shell 包裹)
│   ├── page.tsx                  # / — 商家首页仪表板
│   ├── login/                    # 登录页 (角色选择 + admin/customer)
│   ├── me/page.tsx               # /me — 客户仪表板
│   ├── customers/                # 客户列表 + 详情
│   ├── promo/page.tsx            # 促销活动
│   ├── more/page.tsx             # 更多 / 设置
│   └── globals.css               # 全局样式 (dark, fire accent, CSS变量主题)
├── components/
│   ├── Shell.tsx                 # 路由守卫 + TabBar + Sheet 容器
│   ├── brand.tsx                 # YLogo, YMini, ChevronStamp
│   ├── icons.tsx                 # SVG 图标集
│   ├── ui/                       # Sheet, TabBar, Toast, TopBar, Avatar, KPI, StampGrid
│   ├── sheets/                   # AddStampSheet, RedeemSheet, NewCampaignSheet, RewardRulesSheet, RecordStringingSheet
│   └── screens/                  # CustomerDetail (admin), CustomerDashboard (customer), ArsenalPanel
├── lib/
│   ├── types.ts                  # Customer, Reward, Transaction, StringingService, Campaign, ...
│   ├── store.ts                  # Zustand 全局状态 (核心: 数据 + UI + 增删改查, 双模式)
│   ├── db.ts                     # Supabase REST + RPC 操作层
│   ├── mappers.ts                # DB Row → App 类型转换 + status/daysAgo 计算
│   ├── supabase.ts               # Supabase 客户端 + isDbEnabled 标志
│   ├── session.ts                # zustand 会话 (admin/customer, localStorage 持久化)
│   ├── i18n.ts                   # 中英文国际化字符串 (400+ key)
│   ├── useHydratedLang.ts        # useT() hook (hydration 安全)
│   ├── seed.ts                   # 种子数据 (10客户, 12穿线, 4活动, etc.)
│   └── utils.ts                  # formatPhone, relTime, getRedeemable, getRackets, ...
├── AGENTS.md                     # GitNexus 安全规则（AI 用）
├── CLAUDE.md                     # AI 行为规则（旧版）
├── supabase-schema.sql           # DB Schema + 3 个 RPC 函数 + RLS (幂等)
├── supabase-seed.sql             # 演示数据 (幂等)
├── .env.example                  # 环境变量模板
├── next.config.mjs               # Next.js 配置
├── tsconfig.json                 # TypeScript 配置
├── keepDev.md                    # 本文件
└── README.md                     # 完整文档 (含 DB→App 映射表)
```

## 9. GitNexus 代码分析（推荐）

项目使用 **GitNexus** 提供代码智能分析（723 符号，1397 关系，62 执行流程）。在新 Mac 上使用 AI 开发时需要安装：

```bash
npx gitnexus init        # 初始化 GitNexus
npx gitnexus analyze     # 索引代码库
```

项目已配置 `AGENTS.md` 中的安全规则：

| 规则 | 说明 |
|------|------|
| **改前影响分析** | 修改函数/类前必须运行 `gitnexus_impact({target: "symbolName", direction: "upstream"})` |
| **提交前检测** | 提交前必须运行 `gitnexus_detect_changes()` 确认变更范围符合预期 |
| **安全重命名** | 禁止 find-and-replace 重命名，必须用 `gitnexus_rename` |

> 如提示索引过期，运行 `npx gitnexus analyze` 刷新。

## 10. 数据库 RPC 函数

业务逻辑在 PostgreSQL 层，Schema 中定义：

| 函数 | 作用 |
|------|------|
| `add_stamp(cust_id)` | 印章 +1，更新 last_visit，写 transaction |
| `redeem_stamp(cust_id, amount)` | 印章 -amount，写 transaction |
| `record_stringing(cust_id, r_brand, r_model, s_brand, s_model, tension, s_date)` | 写 stringing_services，更新 last_visit，写 transaction |

## 11. 已知修复记录

### 2026-05-19 — Service Date 自定义日期无功能

**文件：** `components/sheets/RecordStringingSheet.tsx`

**问题：** Custom 按钮无 `onClick` 处理程序，`serviceDate` 状态只支持 `'today' | 'yesterday'`，不存在自定义日期功能。

**修复：** 5 处改动

| # | 改动 |
|---|------|
| 1 | `serviceDate` 类型扩展为 `'today' \| 'yesterday' \| 'custom'`，新增 `customDate` 状态 |
| 2 | reset 逻辑补充 `customDate` 重置 |
| 3 | `handleSave` 中 `daysAgo` 计算增加 custom 分支 |
| 4 | Custom 按钮绑定 `onClick={() => setServiceDate('custom')}` + 选中高亮样式 |
| 5 | `serviceDate === 'custom'` 时显示 `<input type="date">` |

**后续修改参考：** 如需修改其他 sheet 的日期选择，参考此模式。

## 12. backup/ 目录参考

```
backup/
├── design-architecture_1.md       # 设计架构文档
├── mvp-tech-spec_1.md             # MVP 技术规格
├── product-structure-and-user-flow_2.md  # 产品结构 & 用户流程
├── supabase-schema-production.sql # 生产环境 SQL 备份
├── Yang Sport webapp-handoff.zip  # 设计交接包
├── yang-sport-webapp/             # 旧版项目展开
├── yangsport-webapp/              # 旧版项目展开
└── new/                           # 新版备份
    ├── webapp/                    # 新版 webapp 备份
    └── youngsportwebapp.zip       # 新版压缩包
```

## 13. 代码要点

| 概念 | 位置 | 说明 |
|------|------|------|
| **双数据模式** | `lib/supabase.ts` | `isDbEnabled` 决定数据来源：有 Supabase 密钥 → DB 驱动；无密钥 → 内存种子 |
| **状态管理** | `lib/store.ts` | Zustand，所有增删改查通过此 store，内部区分 DB 模式和 seed 模式 |
| **DB 操作** | `lib/db.ts` | Supabase REST + RPC 调用，业务逻辑在 PostgreSQL 函数中（schema 定义） |
| **路由守卫** | `components/Shell.tsx` | 未登录 → `/login`；admin → 全部路由；customer → 仅 `/me` |
| **国际化** | `lib/i18n.ts` | 中英文 400+ key 完整覆盖，通过 `useT()` hook 使用 |
| **主题** | `app/globals.css` | 4 种主题色 (fire/red/yellow/blue)，通过 `data-theme` CSS 变量切换 |
| **会话** | `lib/session.ts` | Zustand persist + localStorage，admin/customer 两种角色 |
| **类型映射** | `lib/mappers.ts` | DB snake_case → App camelCase，字段派生（status, daysSince 等） |
| **离线 seed** | `lib/seed.ts` | 10 客户 + 12 穿线记录 + 奖励规则 + 器材预设 + 7 天访问数据 |

## 14. 排错

**`npm run dev` 报错 `Cannot find module '../server/require-hook'`**

`node_modules/.bin/next` 的 symlink 解析错位。清理重建：

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**浏览器白屏或报错 `[Yang Sport] Supabase not configured`**

这是正常提示，表示使用内存种子模式。如需连接数据库，参考第 4 节配置 `.env.local`。

**数据不持久化（刷新后重置）**

未连接 Supabase 时数据在内存中。连接数据库后所有数据持久保存在 PostgreSQL。

## 15. 本地构建 & 测试

```bash
# 构建生产包
npm run build

# 本地测试生产模式
npm run start
```

访问 `http://localhost:3000` 确认：

- 登录 / 路由守卫正常
- 加章 / 兑换 / 穿线 CRUD 正常
- 中英文切换正常
- 主题切换正常

> 如果 `npm run build` 报错，先 `rm -rf .next` 再试。

## 16. 部署 — 方案 A：单商户 MVP

当前代码可立即部署上线，适合一家店自用。

### 16.1 选择托管平台

| 平台 | 推荐度 | 理由 |
|------|--------|------|
| **Vercel** | ⭐ 首选 | Next.js 原生集成，免费套餐，自动 HTTPS，GitHub 联动自动部署 |
| Cloudflare Pages | 次选 | 性能好，但 Next.js SSR 兼容性略弱 |
| 自建 VPS | 不推荐 | 运维成本高，无必要 |

### 16.2 Vercel 部署

**方式一：Vercel Dashboard（推荐）**

1. 登录 [vercel.com](https://vercel.com)（用 GitHub 账号）
2. Add New → Project
3. Import `github.com/Mr-Choy/yangsport.app`
4. **关键：** Settings → Environment Variables 填入：

```
NEXT_PUBLIC_SUPABASE_URL=https://qrlkozrlcuyqulckhkel.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_NOs3sLC2Bj7vAQg048cShw_0qq2FHfN
```

5. Deploy → 等待 2 分钟 → 获得线上 URL

**方式二：Vercel CLI**

```bash
npm i -g vercel
vercel
```

### 16.3 Supabase RLS 加固

当前 `supabase-schema.sql` 中 RLS 是 `allow all`，任何人都能直接读写数据库。
部署前建议替换为以下策略：

```sql
-- ============================================================
-- RLS: single-merchant production (MVP)
-- ============================================================

-- 1. 删除旧策略
drop policy if exists "allow all customers"          on customers;
drop policy if exists "allow all transactions"       on transactions;
drop policy if exists "allow all rewards"            on rewards;
drop policy if exists "allow all stringing_services" on stringing_services;
drop policy if exists "allow all equipment_presets"  on equipment_presets;

-- 2. 公开读（业务需要展示数据）
create policy "read customers"          on customers          for select using (true);
create policy "read transactions"       on transactions       for select using (true);
create policy "read rewards"            on rewards            for select using (true);
create policy "read stringing_services" on stringing_services for select using (true);
create policy "read equipment_presets"  on equipment_presets  for select using (true);

-- 3. 写入只能通过 RPC（已在 schema 中定义 add_stamp / redeem_stamp / record_stringing）
-- RPC 函数执行不受 RLS 限制，所以不需要写 INSERT/UPDATE/DELETE policy。
-- 这意味着恶意用户不能直接 `DELETE FROM customers`。

-- 4. 如需表级写入（如 rewards CRUD），加写策略：
-- create policy "write rewards" on rewards for insert using (true) with check (true);
-- create policy "write rewards" on rewards for update using (true);
-- create policy "write rewards" on rewards for delete using (true);
```

RLS 策略变化总结：

| 操作 | 改前 | 改后 |
|------|------|------|
| SELECT 任何表 | ✅ 任意用户 | ✅ 任意用户 |
| INSERT / UPDATE / DELETE customers | ✅ 任意用户 | ❌ 只能通过 RPC |
| INSERT / UPDATE / DELETE transactions | ✅ 任意用户 | ❌ 只能通过 RPC |
| INSERT / UPDATE / DELETE stringing_services | ✅ 任意用户 | ❌ 只能通过 RPC |
| INSERT / UPDATE / DELETE rewards | ✅ 任意用户 | ❌ 需要额外策略才允许（见注释） |
| INSERT / UPDATE / DELETE equipment_presets | ✅ 任意用户 | ❌ 禁止 |

### 16.4 自定义域名

Vercel Dashboard → Project → Settings → Domains → Add

输入你的域名（如 `yang-sport.com`）→ DNS 配置 CNAME 指向 `cname.vercel-dns-dns.com`

### 16.5 CI/CD

部署后默认开启：每次 `git push` 到 `main` 分支 → Vercel 自动构建 + 部署。零配置。

### 16.6 检查清单（上线前）

- [ ] `.env.local` 中 Supabase key 指向生产项目（非测试项目）
- [ ] RLS 策略已更新（见 16.3）
- [ ] `supabase-schema.sql` 中的 RPC 函数生产环境已创建
- [ ] `supabase-seed.sql` 已执行（如需演示数据）
- [ ] 自定义域名 DNS 生效
- [ ] HTTPS 证书自动签发（Vercel 默认）
- [ ] 本地 `npm run build && npm run start` 通过

## 17. 部署 — 方案 B：多商户生产级

当前代码是单商户 MVP。如需支持多商户独立管理，需要以下改造。

### 17.1 改造清单总览

| # | 改动 | 涉及文件 | 预估工时 |
|---|------|----------|----------|
| 1 | 数据库加 `merchant_id` | `supabase-schema.sql` | 1h |
| 2 | RLS 按商户隔离 | `supabase-schema.sql` | 1h |
| 3 | 集成 Supabase Auth | `lib/supabase.ts`, `lib/session.ts`, `app/login/` | 3h |
| 4 | 商户注册 / 邀请 | `app/register/`（新页） | 2h |
| 5 | DB 查询加 merchant 过滤 | `lib/db.ts` | 1h |
| 6 | merchant_id 写入 | `lib/store.ts` | 1h |
| 7 | 商户设置页 | `app/settings/`（新页） | 3h |

### 17.2 数据库改造

```sql
-- 每张业务表加 merchant_id
alter table customers          add column merchant_id uuid references auth.users(id);
alter table transactions       add column merchant_id uuid references auth.users(id);
alter table rewards            add column merchant_id uuid references auth.users(id);
alter table stringing_services add column merchant_id uuid references auth.users(id);
alter table equipment_presets  add column merchant_id uuid references auth.users(id);

-- 索引
create index idx_customers_merchant          on customers(merchant_id);
create index idx_transactions_merchant       on transactions(merchant_id);
create index idx_rewards_merchant            on rewards(merchant_id);
create index idx_stringing_services_merchant on stringing_services(merchant_id);

-- RLS：商户只能读写自己的数据
drop policy if exists "read customers" on customers;
create policy "merchant own customers" on customers
  for all using (merchant_id = auth.uid()) with check (merchant_id = auth.uid());

-- 同理处理 transactions, rewards, stringing_services, equipment_presets

-- RPC 函数也需要加 merchant_id 参数
create or replace function add_stamp(cust_id uuid, m_id uuid)
returns void as $$
begin
  -- 校验该客户属于该商户
  if not exists (select 1 from customers where id = cust_id and merchant_id = m_id) then
    raise exception 'customer not found for this merchant';
  end if;
  -- ... 原有逻辑
end;
$$ language plpgsql;
```

### 17.3 Auth 集成

**`lib/supabase.ts`** — 开启会话持久化：

```ts
_client = createClient(url, key, {
  auth: { persistSession: true, autoRefreshToken: true },
});
```

**`lib/session.ts`** — 去掉硬编码密码：

```ts
import { supabase } from './supabase';

// 登录
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data.user;
}

// 注册
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data.user;
}

// 退出
export async function signOut() {
  await supabase.auth.signOut();
}
```

**新增页面 `app/register/page.tsx`** — 商户注册，创建后自动生成默认奖励规则和店铺配置。

### 17.4 Store / DB 改造

**`lib/db.ts`** — 每个查询加 `merchant_id` 过滤：

```ts
export async function fetchCustomers(merchantId: string) {
  return client()
    .from('customers')
    .select('*')
    .eq('merchant_id', merchantId)
    .order('created_at', { ascending: false });
}
```

**`lib/store.ts`** — 从 session 中取 merchantId 传入 DB 层：

```ts
const session = useSession.getState().session;
const merchantId = session?.kind === 'admin' ? session.userId : null;
if (merchantId) await db.fetchCustomers(merchantId);
```

### 17.5 商户设置页

新增 `app/settings/page.tsx`，功能包括：

| 功能 | 说明 |
|------|------|
| 店铺名称 | 修改商户显示名称 |
| 主题色 | fire / red / yellow / blue |
| 默认语言 | 中 / 英文 |
| 团队管理 | 添加/移除店员（店员角色只能操作，不能改配置） |

### 17.6 选装功能

以下功能未来可按需加入：

| 功能 | 说明 | 预估工时 |
|------|------|----------|
| **Audit log** | 记录每个操作的操作人、时间、变更内容 | 2d |
| **CSV 导出** | 导出客户列表 / 交易记录 | 1d |
| **支付集成** | Stripe / Billplz 订阅收费 | 3d |
| **真实推送** | WhatsApp Business API / Twilio 发送 campaign | 5d |
| **Analytics** | 更丰富的趋势图表（月度对比、客户留存等） | 3d |
| **客户端推送** | 客户手机上推送优惠/奖励通知 | 2d |

## 18. 建议上线路线图

```
Phase 1（现在）
├── Vercel 部署单商户 MVP
├── 替换 RLS 为只读 + RPC 写入
└── 绑定自定义域名
     ↓ 预计 1-2 天

Phase 2（本周~下月）
├── Supabase Auth 集成
├── 商户注册流程
├── 多 merchant_id 隔离
└── 商户设置页
     ↓ 预计 1-2 周

Phase 3（视需求）
├── 支付集成
├── 真实推送（WhatsApp / Email）
└── Analytics 增强
     ↓

Phase 4（未来）
├── 多门店支持
├── 客户 App / 小程序
└── 库存管理 / POS 集成
```
