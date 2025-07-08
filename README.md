# Pharmaceutical Wholesale DSS + IMS System

A secure, scalable, and data-driven **Decision Support System (DSS)** integrated with an **Inventory Management System (IMS)** for pharmaceutical wholesalers.

This system enables:
- Product & inventory tracking
- Supplier & sales management
- Automated reorder suggestions
- Data-driven analytics & reports

---

## Demo Access / Credentials

Use the following test accounts to explore the system by role:

| Role                  | Username  | Password |

| Admin              | `admin`   | `password` 
| Inventory Manager  | `manager` | `password` |
| Sales Clerk        | `clerk`   | `password` |

These are demo credentials for testing purposes only. In production, make sure to change all default passwords and secure user registration.

---

## Core Modules & Features

### 1. User Authentication & Role-Based Access
- JWT-secured login (no public registration)
- Role-based dashboards:
  - **Admin**: Manages users & system settings
  - **Inventory Manager**: Handles inventory and suppliers
  - **Sales Clerk**: Records sales only

### 2. Supplier Management
- CRUD operations for suppliers
- View performance metrics (linked to delivery/sales)
- `Route: /suppliers`

### 3. Inventory Management
- Add/edit/delete inventory items
- Track quantities, expiry dates, and reorder levels
- Auto-deduct stock on sale
- Alerts for low stock or upcoming expiry

### 4. Sales Management
- Record product sales
- Auto-update inventory
- Filter sales history by date or product

### 5. Decision Support System (DSS)
- Reports with charts:
  - Monthly Sales
  - Low Stock
  - Reorder Suggestions
  - Supplier Performance
- Filters: Date range, product
- Visuals via **Chart.js** or **Recharts**

### 6. Reports & Exports
- Daily/Weekly/Monthly reporting
- Export data to **CSV** or **PDF**
- Display key performance metrics (cost, revenue, profit)

---

## Database Schema (PostgreSQL)

```sql
Users      (id, username, password, role)
Products   (id, name, quantity, expiry_date, reorder_level)
Suppliers  (id, name, contact_person, phone, email)
Sales      (id, product_id, quantity, date_sold)
Orders     (id, product_id, quantity_ordered, status)

## Getting Started

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/Mandela-Inegbedion/pharma_inventory_system.git

cd pharma_inventory_system

# 2. Install dependencies
npm install

# 3. Setup your environment
cp .env.local.example .env.local

# 4. Run DB migrations
npx prisma migrate dev   # or npx sequelize db:migrate

# 5. Start the dev server
npm run dev

