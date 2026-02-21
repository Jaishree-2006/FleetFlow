# FleetFlow Architecture

## Overview
FleetFlow is a modular fleet and logistics management system built with Next.js, Tailwind CSS, and Supabase.

## Frontend
- Next.js pages for each feature
- Tailwind CSS for styling
- Zustand/React Context for state management
- Supabase JS client for API/auth/realtime
- Responsive, modern SaaS UI

## Backend
- Supabase PostgreSQL database
- Auth: Email/password, RBAC via profiles table
- Realtime subscriptions for Vehicles, Drivers, Trips
- Row Level Security (RLS) for data protection
- Validation and automation via DB constraints and triggers

## Data Flow
1. User logs in via Supabase Auth
2. Session stored securely (JWT)
3. Role fetched from profiles table
4. Frontend displays pages/components based on role
5. CRUD operations via Supabase client
6. Realtime listeners update UI automatically

## Database Schema
See `supabase/schema.sql` for full schema.

## Pages & Routing
- Home: Landing page, login modal
- Dashboard: KPIs, filters, overview tables
- Vehicles: CRUD registry
- Trips: Dispatcher, validation, automation
- Maintenance: Logs, auto status update
- Expenses: Fuel, maintenance, cost summary
- Drivers: Performance, compliance, metrics
- Analytics: Reports, export

## Security
- RLS enabled for all tables
- Policies restrict access by user/role

## Extensibility
- Modular page/component structure
- Easy to add new features
- Supabase triggers for automation

## Export
- CSV/PDF export via frontend libraries
