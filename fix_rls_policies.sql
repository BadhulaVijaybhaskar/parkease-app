-- Fix RLS policies for vehicles table
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;
DROP POLICY IF EXISTS "Users can delete their own vehicles" ON vehicles;

-- Create new policies with proper auth.uid() check
CREATE POLICY "Users can view their own vehicles" ON vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles" ON vehicles
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles" ON vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Also ensure the vehicles table has the nickname column
ALTER TABLE vehicles ADD COLUMN IF NOT EXISTS nickname VARCHAR(50);