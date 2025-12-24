-- ParkEase Database Setup - Updated to match existing schema
-- Run this in Supabase SQL Editor

-- Create vehicles table (if not exists)
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vehicle_number VARCHAR(20) NOT NULL,
  type VARCHAR(10) NOT NULL CHECK (type IN ('car', 'bike')),
  nickname VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parking_lots table (if not exists)
CREATE TABLE IF NOT EXISTS parking_lots (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  lat DECIMAL(10, 8) NOT NULL,
  lng DECIMAL(11, 8) NOT NULL,
  price_per_hour INTEGER NOT NULL
);

-- Create slots table (if not exists)
CREATE TABLE IF NOT EXISTS slots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  lot_id VARCHAR(10) REFERENCES parking_lots(id) ON DELETE CASCADE,
  label VARCHAR(10) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE' CHECK (status IN ('AVAILABLE', 'BLOCKED'))
);

-- Create bookings table (if not exists)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lot_id VARCHAR(10) REFERENCES parking_lots(id),
  slot_label VARCHAR(10) NOT NULL,
  vehicle_number VARCHAR(20) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  amount_paid INTEGER NOT NULL,
  refund_amount INTEGER DEFAULT NULL,
  refund_status VARCHAR(20) CHECK (refund_status IN ('INITIATED', 'COMPLETED')),
  status VARCHAR(20) NOT NULL DEFAULT 'PAID' CHECK (status IN ('PAID', 'CHECKED_IN', 'CANCELLED', 'COMPLETED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  cancelled_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Insert sample parking lots
INSERT INTO parking_lots (id, name, address, lat, lng, price_per_hour) VALUES
('LOT001', 'Central Mall Parking', '123 Main Street, Downtown', 40.7128, -74.0060, 50),
('LOT002', 'Business District Plaza', '456 Business Ave, Financial District', 40.7589, -73.9851, 75),
('LOT003', 'Airport Terminal Parking', '789 Airport Road, Terminal 1', 40.6413, -73.7781, 100),
('LOT004', 'Shopping Center Lot', '321 Retail Street, Mall District', 40.7505, -73.9934, 40),
('LOT005', 'Hospital Parking', '654 Medical Center Dr, Health District', 40.7282, -73.9942, 60)
ON CONFLICT (id) DO NOTHING;

-- Insert sample slots for each lot
INSERT INTO slots (lot_id, label, status) VALUES
-- LOT001 slots
('LOT001', 'A1', 'AVAILABLE'), ('LOT001', 'A2', 'AVAILABLE'), ('LOT001', 'A3', 'BLOCKED'),
('LOT001', 'B1', 'AVAILABLE'), ('LOT001', 'B2', 'AVAILABLE'), ('LOT001', 'B3', 'AVAILABLE'),
-- LOT002 slots  
('LOT002', 'A1', 'AVAILABLE'), ('LOT002', 'A2', 'BLOCKED'), ('LOT002', 'A3', 'AVAILABLE'),
('LOT002', 'B1', 'AVAILABLE'), ('LOT002', 'B2', 'AVAILABLE'), ('LOT002', 'B3', 'AVAILABLE'),
-- LOT003 slots
('LOT003', 'A1', 'AVAILABLE'), ('LOT003', 'A2', 'AVAILABLE'), ('LOT003', 'A3', 'AVAILABLE'),
('LOT003', 'B1', 'BLOCKED'), ('LOT003', 'B2', 'AVAILABLE'), ('LOT003', 'B3', 'AVAILABLE'),
-- LOT004 slots
('LOT004', 'A1', 'AVAILABLE'), ('LOT004', 'A2', 'AVAILABLE'), ('LOT004', 'A3', 'AVAILABLE'),
('LOT004', 'B1', 'AVAILABLE'), ('LOT004', 'B2', 'BLOCKED'), ('LOT004', 'B3', 'AVAILABLE'),
-- LOT005 slots
('LOT005', 'A1', 'AVAILABLE'), ('LOT005', 'A2', 'AVAILABLE'), ('LOT005', 'A3', 'AVAILABLE'),
('LOT005', 'B1', 'AVAILABLE'), ('LOT005', 'B2', 'AVAILABLE'), ('LOT005', 'B3', 'BLOCKED')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicles
DROP POLICY IF EXISTS "Users can view their own vehicles" ON vehicles;
CREATE POLICY "Users can view their own vehicles" ON vehicles
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own vehicles" ON vehicles;
CREATE POLICY "Users can insert their own vehicles" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own vehicles" ON vehicles;
CREATE POLICY "Users can update their own vehicles" ON vehicles
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own vehicles" ON vehicles;
CREATE POLICY "Users can delete their own vehicles" ON vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for bookings
DROP POLICY IF EXISTS "Users can view their own bookings" ON bookings;
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own bookings" ON bookings;
CREATE POLICY "Users can insert their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own bookings" ON bookings;
CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow public read access to parking_lots and slots
ALTER TABLE parking_lots ENABLE ROW LEVEL SECURITY;
ALTER TABLE slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view parking lots" ON parking_lots;
CREATE POLICY "Anyone can view parking lots" ON parking_lots
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can view slots" ON slots;
CREATE POLICY "Anyone can view slots" ON slots
  FOR SELECT USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_slots_lot_id ON slots(lot_id);