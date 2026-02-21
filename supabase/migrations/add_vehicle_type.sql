-- FleetFlow Migration: Add Vehicle Type
-- Run this in your Supabase SQL Editor

-- 1. Create a new enum for vehicle types if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'vehicle_type') THEN
        CREATE TYPE vehicle_type AS ENUM ('Truck', 'Van');
    END IF;
END$$;

-- 2. Add the type column to the vehicles table
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS type vehicle_type DEFAULT 'Truck';

-- 3. (Optional) Retroactively update existing data based on names
UPDATE vehicles SET type = 'Truck' WHERE name ILIKE '%truck%' OR name ILIKE '%scania%' OR name ILIKE '%volvo%';
UPDATE vehicles SET type = 'Van' WHERE name ILIKE '%van%' OR name ILIKE '%ford%';
