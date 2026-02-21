# FleetFlow

FleetFlow is a high-performance, modular Fleet & Logistics Management System built for enterprise-scale fleet operations.  
It supports multi-role access, real-time monitoring, financial tracking, and compliance management.

---

## 🚀 Core Features

- Supabase Authentication (Email/Password)
- Role-Based Access Control (RBAC)
- Supabase Row-Level Security (RLS)
- Real-time updates (Vehicles, Drivers, Trips)
- Responsive UI built with Tailwind CSS
- 10 Modular Pages
- CRUD operations with validation
- Automated lifecycle & scheduling logic
- CSV & PDF export
- Secure protected routes
- Dynamic role-based dashboards
- Fuel tracking & expense auditing
- Maintenance ROI calculation
- Driver safety score monitoring
- License & compliance expiration alerts
- Trip assignment automation
- Live operational status tracking

---

## 👥 Supported User Roles

- Fleet Manager
- Dispatcher
- Safety Officer
- Financial Analyst

Each role has restricted access to specific modules using frontend guards and backend RLS policies.

---

## 🧱 Tech Stack

Frontend:
- React.js
- Tailwind CSS
- Zustand / React Context

Backend:
- Supabase (Auth, PostgreSQL, Realtime)
- Row-Level Security (RLS)
- Supabase Storage (for reports & exports)

---

## 📦 Setup

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/fleetflow.git
   ```

2. Install dependencies  
   ```bash
   npm install
   ```

3. Create a Supabase project  

4. Add your environment variables in `.env`  

   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

5. Run the development server  
   ```bash
   npm run dev
   ```

---

## 🗂 Pages & Modules

| Route        | Module Name              | Purpose |
|-------------|--------------------------|----------|
| /           | Home                     | Landing page |
| /dashboard  | Command Center           | Role-based overview |
| /vehicles   | Vehicle Registry         | Fleet tracking |
| /trips      | Trip Dispatcher          | Assign & manage trips |
| /maintenance| Maintenance Logs         | Service tracking |
| /expenses   | Expenses & Fuel          | Financial audit |
| /drivers    | Driver Performance       | Driver stats |
| /analytics  | Analytics & Reports      | Insights & graphs |
| /safety     | Safety Scores            | Risk monitoring |
| /compliance | Compliance Tracker       | Expiration alerts |

---

## 🔐 Security Architecture

- Role-Based Access Control (RBAC)
- Supabase Row-Level Security (RLS)
- Protected frontend routes
- Backend validation policies
- Restricted API access per role
- Secure environment variable handling

---

## 🗄 Database Schema

Full schema available at:

```
supabase/schema.sql
```

Includes tables for:
- Users (with roles)
- Vehicles
- Drivers
- Trips
- Maintenance Logs
- Expenses
- Safety Records
- Compliance Records

---

## 🏗 System Architecture

See:

```
ARCHITECTURE.md
```

Architecture follows:
- Modular component structure
- Service-based data layer
- Role-based rendering logic
- Realtime event subscriptions

---

## 📊 Advanced Capabilities

- Real-time dashboard updates
- Automated maintenance reminders
- Fuel cost per vehicle analytics
- Trip efficiency tracking
- Driver risk scoring system
- Compliance alert notifications
- Scalable micro-module architecture

---

## 📄 License

MIT License
