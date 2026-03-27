-- Add dynamic editable metrics to drivers table for Safety Officer control
ALTER TABLE drivers
ADD COLUMN speeding_events integer DEFAULT 0,
ADD COLUMN incidents integer DEFAULT 0;
