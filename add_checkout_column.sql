-- Add missing checked_out_at column to bookings table
-- Run this in Supabase SQL Editor

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS checked_out_at TIMESTAMP WITH TIME ZONE;