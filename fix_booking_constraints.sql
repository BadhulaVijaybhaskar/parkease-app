-- Fix booking table constraints
-- Run this in Supabase SQL Editor

-- Drop the existing constraint and recreate with correct values
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
  CHECK (status IN ('PAID', 'CHECKED_IN', 'CANCELLED', 'COMPLETED'));

-- Also ensure the default status is correct
ALTER TABLE bookings ALTER COLUMN status SET DEFAULT 'PAID';

-- Check if there are any existing invalid status values and fix them
UPDATE bookings SET status = 'PAID' WHERE status NOT IN ('PAID', 'CHECKED_IN', 'CANCELLED', 'COMPLETED');