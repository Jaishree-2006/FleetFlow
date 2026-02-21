# FleetFlow Supabase Schema

-- Vehicles Table
CREATE TABLE vehicles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    plate text UNIQUE NOT NULL,
    max_load integer NOT NULL,
    odometer integer NOT NULL,
    acquisition_cost numeric NOT NULL,
    status vehicle_status NOT NULL,
    created_at timestamp DEFAULT now()
);

-- Drivers Table
CREATE TABLE drivers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    license_expiry date NOT NULL,
    status driver_status NOT NULL,
    created_at timestamp DEFAULT now()
);

-- Trips Table
CREATE TABLE trips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid REFERENCES vehicles(id),
    driver_id uuid REFERENCES drivers(id),
    cargo_weight integer NOT NULL,
    revenue numeric NOT NULL,
    status trip_status NOT NULL,
    created_at timestamp DEFAULT now()
);

-- Expenses Table
CREATE TABLE expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    vehicle_id uuid REFERENCES vehicles(id),
    type expense_type NOT NULL,
    liters numeric,
    amount numeric NOT NULL,
    created_at timestamp DEFAULT now()
);

-- ENUM Types
CREATE TYPE vehicle_status AS ENUM ('Available', 'On Trip', 'In Shop', 'Retired');
CREATE TYPE driver_status AS ENUM ('On Duty', 'Off Duty', 'Suspended');
CREATE TYPE trip_status AS ENUM ('Draft', 'Dispatched', 'Completed', 'Cancelled');
CREATE TYPE expense_type AS ENUM ('Fuel', 'Maintenance');

-- Profiles Table
CREATE TABLE profiles (
    id uuid PRIMARY KEY REFERENCES auth.users(id),
    full_name text,
    role user_role NOT NULL
);
CREATE TYPE user_role AS ENUM ('Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst');

-- Row Level Security
-- Enable RLS for all tables
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Example RLS policies (customize as needed)
-- Only allow users to access their own profile
CREATE POLICY "Users can view their profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- Realtime
-- Enable realtime for vehicles, drivers, trips
-- (Supabase dashboard: toggle Realtime for these tables)

-- Foreign Key Constraints
-- Already included in table definitions

-- Additional policies and automation logic to be added as needed
