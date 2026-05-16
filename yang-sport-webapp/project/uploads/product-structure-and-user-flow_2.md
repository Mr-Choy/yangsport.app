# Product Structure & User Flow
## Customer Loyalty & Promotion Web App

---

# 🧭 1. Product Structure Diagram

## Overview

This is a merchant-focused web application that unifies:
- Customer Management (CRM)
- Loyalty / Stamp System
- Promotion Broadcasting
- Business Dashboard

---

## Structure

```
Web App (Merchant Dashboard)
│
├── Dashboard
│   ├── Total Customers
│   ├── New Customers (Daily)
│   ├── Returning Rate
│   └── Campaign Performance
│
├── Customers (CRM)
│   ├── Customer List
│   └── Customer Profile
│       ├── Phone Number
│       ├── Stamp / Points
│       └── Visit History
│
├── Loyalty System
│   ├── Reward Rules
│   │   ├── 3 Visits → Reward A
│   │   ├── 6 Visits → Reward B
│   │   └── 10 Visits → Reward C
│   └── Add Stamp (Manual / Auto)
│
├── Promotions
│   ├── Create Campaign
│   ├── Broadcast Message
│   └── Campaign History
│
└── Settings
    ├── Store Info
    └── Notification Settings
```

---

# 🔄 2. User Flow

## 2.1 Merchant Daily Operation Flow

```
[Customer Makes Purchase]
         ↓
  Merchant Opens Web App
         ↓
  Search / Enter Customer Phone Number
         ↓
  Is New Customer?
  ├── Yes → Create New Customer
  └── No  → Open Customer Profile
         ↓
  Click "Add Stamp / Points"
         ↓
  System Updates Progress
         ↓
  Reward Reached?
  ├── Yes → Show Reward Available
  └── No  → End
```

---

## 2.2 Reward Redemption Flow

```
Customer Reaches Reward Threshold
         ↓
  System Notifies Merchant
         ↓
  Merchant Clicks "Redeem"
         ↓
  Deduct Stamps / Points
         ↓
  Reward Given to Customer
         ↓
  End
```

---

## 2.3 Promotion Broadcast Flow

```
Merchant Goes to Promotions
         ↓
  Click "Create Campaign"
         ↓
  Enter Promotion Details
         ↓
  Select Target Audience (All Customers)
         ↓
  Click Send
         ↓
  Customers Receive Notification
  (SMS / WhatsApp / Push)
```

---

## 2.4 Customer Journey Flow

```
Customer Visits Store
         ↓
  Gets Recorded (Phone Number)
         ↓
  Earns Stamp / Points
         ↓
  Accumulates Rewards
         ↓
  Receives Promotions
         ↓
  Returns to Store
         ↓
  (Loop)
```

---

# 🔁 3. Core Product Loop

```
Purchase → Earn → Reward → Notify → Return
```

This loop is the core engine that drives customer retention.

---

# 🎯 4. Key Product Goal

To provide a simple, unified system for merchants to:
- Track customers
- Reward loyalty
- Drive repeat visits through promotions

---

# 🚀 5. Future Enhancements (Optional)

- Customer segmentation (new vs returning)
- Automated campaigns (e.g. inactive users)
- Advanced analytics dashboard
- WhatsApp API integration

---
