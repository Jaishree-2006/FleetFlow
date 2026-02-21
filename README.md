# FleetFlow

FleetFlow is a high-performance, modular Fleet & Logistics Management System.

## Features
- Supabase Auth (Email/Password)
- Role-Based Access Control (RBAC)
- Real-time updates (Vehicles, Drivers, Trips)
- Responsive UI with Tailwind CSS
- 8 main pages: Home, Dashboard, Vehicles, Trips, Maintenance, Expenses, Drivers, Analytics
- CRUD operations, validation, automation logic
- CSV/PDF export

## Tech Stack
- React.js (Frontend)
- Tailwind CSS (UI)
- Supabase (Backend, Auth, Realtime, PostgreSQL)
- Zustand/React Context (State Management)

## Setup
1. Clone the repo
2. Install dependencies: `npm install`
3. Set up Supabase project and copy env keys to `.env`
4. Run: `npm start`

## Database Schema
See `supabase/schema.sql` for full schema.

## Architecture
See `ARCHITECTURE.md` for system design.

## Pages
/           Home (Landing)
/dashboard  Command Center
/vehicles   Vehicle Registry
/trips      Trip Dispatcher
/maintenance Maintenance Logs
/expenses   Expenses & Fuel
/drivers    Driver Performance
/analytics  Analytics & Reports
/safety     Safety Scores
/compliance Compliance Tracker

## License
MIT
