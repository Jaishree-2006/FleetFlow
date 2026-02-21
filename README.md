#  FleetFlow

> Logistics simplified. Fleet managed smarter.

FleetFlow is a high-performance, modular Fleet & Logistics Management System built for enterprise-scale fleet operations.  
It supports multi-role access, real-time monitoring, financial tracking, safety analysis, and compliance management — all in one centralized dashboard.

---

##  Live Demo

[![Watch the demo](https://img.youtube.com/vi/Q8wIgyuKf68/0.jpg)](https://youtu.be/Q8wIgyuKf68)

Click the image above to watch the full system walkthrough.

---

##  Core Features

- Supabase Authentication (Email/Password + Google OAuth)
- Role-Based Access Control (RBAC)
- Supabase Row-Level Security (RLS)
- Real-time updates (Vehicles, Drivers, Trips)
- Responsive UI built with Tailwind CSS
- 10 Modular Pages
- Full CRUD operations with validation
- Automated lifecycle & scheduling logic
- CSV & PDF export functionality
- Secure protected routes
- Dynamic role-based dashboards
- Fuel tracking & expense auditing
- Maintenance ROI calculation
- Driver safety score monitoring
- License & compliance expiration alerts
- Trip assignment & completion tracking
- Live operational status indicators

---

##  Supported User Roles

FleetFlow supports multi-role enterprise access:

- **Fleet Manager**
- **Dispatcher**
- **Safety Officer**
- **Financial Analyst**

Each role has restricted module access enforced via frontend route guards and backend Supabase RLS policies.

---

##  Tech Stack

### Frontend
- React.js
- Tailwind CSS
- Zustand / React Context (State Management)

### Backend
- Supabase (Auth, PostgreSQL, Realtime)
- Row-Level Security (RLS)
- Supabase Storage (Reports & exports)

---

##  Setup Instructions

1. Clone the repository  
   ```bash
   git clone https://github.com/your-username/fleetflow.git
   ```

2. Navigate to project folder  
   ```bash
   cd fleetflow
   ```

3. Install dependencies  
   ```bash
   npm install
   ```

4. Create a Supabase project  

5. Add environment variables in `.env`  

   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

6. Start development server  
   ```bash
   npm run dev
   ```

---

##  Pages & Modules

| Route        | Module Name            | Purpose |
|-------------|------------------------|----------|
| /           | Home                   | Landing page |
| /dashboard  | Command Center         | Role-based overview |
| /vehicles   | Vehicle Registry       | Fleet tracking & filtering |
| /trips      | Trip Dispatcher        | Assign & manage trips |
| /maintenance| Maintenance Logs       | Service & repair tracking |
| /expenses   | Expenses & Fuel        | Financial monitoring |
| /drivers    | Driver Performance     | Driver stats & records |
| /analytics  | Analytics & Reports    | Data insights & visualizations |
| /safety     | Safety Scores          | Risk monitoring |
| /compliance | Compliance Tracker     | Expiration & regulation alerts |

---

##  Security Architecture

FleetFlow enforces enterprise-level security using:

- Role-Based Access Control (RBAC)
- Supabase Row-Level Security (RLS)
- Protected frontend routes
- Backend validation policies
- Restricted API access per role
- Secure environment variable handling

This ensures complete data isolation between user roles.

---

##  Database Schema

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

##  System Architecture

See:

```
ARCHITECTURE.md
```

Architecture principles:

- Modular component structure
- Service-based data layer
- Role-based rendering logic
- Real-time event subscriptions
- Scalable enterprise design

---

##  Advanced Capabilities

- Real-time dashboard synchronization
- Automated maintenance reminders
- Fuel cost per vehicle analytics
- Trip efficiency tracking
- Driver risk scoring system
- Compliance alert notifications
- Interactive financial graphs
- Vehicle ROI breakdown analysis

---

##  License

This project is licensed under the MIT License.
