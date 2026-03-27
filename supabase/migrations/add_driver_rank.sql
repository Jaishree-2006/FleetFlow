-- Add rank column to drivers table
ALTER TABLE drivers ADD COLUMN rank text DEFAULT 'Unassigned';
