

-- Setup script for activity_logs table
-- Run this in the Supabase SQL Editor to create the table

CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  location TEXT NOT NULL,
  activity_category TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  equipment TEXT NOT NULL,
  personnel TEXT NOT NULL,
  material TEXT NOT NULL,
  measurement TEXT,
  status TEXT NOT NULL DEFAULT 'completed',
  notes TEXT,
  media TEXT,
  reference_id TEXT,
  coordinates NUMERIC[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index on timestamp for better performance on time-based queries
CREATE INDEX IF NOT EXISTS activity_logs_timestamp_idx ON activity_logs (timestamp);

-- Create index on location for faster filtering by location
CREATE INDEX IF NOT EXISTS activity_logs_location_idx ON activity_logs (location);

-- Create RLS policy to allow all operations (modify as needed for your security requirements)
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous access to activity_logs" 
ON activity_logs FOR ALL 
TO anon 
USING (true) 
WITH CHECK (true);

-- Create a trigger to update the updated_at column on record updates
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON activity_logs
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

-- Comment to explain table purpose
COMMENT ON TABLE activity_logs IS 'Stores activity log entries for tracking work over time';

