-- Add safety score, completion rate, and elite status to drivers table
ALTER TABLE drivers 
ADD COLUMN safety_score integer DEFAULT 90,
ADD COLUMN completion_rate integer DEFAULT 90,
ADD COLUMN elite_status boolean DEFAULT false;
