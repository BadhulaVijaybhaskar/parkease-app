-- ParkEase Database Setup
-- Run this in Supabase SQL Editor

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'truck')),
  vehicle_number VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create parking_lots table (for reference)
CREATE TABLE IF NOT EXISTS parking_lots (
  id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  price_per_hour INTEGER NOT NULL,
  total_slots INTEGER NOT NULL,
  available_slots INTEGER NOT NULL,
  amenities TEXT[],
  rating DECIMAL(2, 1) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lot_id VARCHAR(10) REFERENCES parking_lots(id),
  vehicle_number VARCHAR(20) NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED' CHECK (status IN ('CONFIRMED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED')),
  amount_paid INTEGER NOT NULL,
  refund_amount INTEGER DEFAULT 0,
  refund_status VARCHAR(20) CHECK (refund_status IN ('INITIATED', 'COMPLETED')),
  cancelled_at TIMESTAMP WITH TIME ZONE,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  checked_out_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample parking lots
INSERT INTO parking_lots (id, name, address, latitude, longitude, price_per_hour, total_slots, available_slots, amenities, rating) VALUES
('LOT001', 'Central Mall Parking', '123 Main Street, Downtown', 40.7128, -74.0060, 50, 100, 45, ARRAY['Security', 'CCTV', 'Covered'], 4.5),
('LOT002', 'Business District Plaza', '456 Business Ave, Financial District', 40.7589, -73.9851, 75, 80, 32, ARRAY['Security', 'EV Charging', 'Valet'], 4.2),
('LOT003', 'Airport Terminal Parking', '789 Airport Road, Terminal 1', 40.6413, -73.7781, 100, 200, 89, ARRAY['24/7 Access', 'Shuttle Service', 'Security'], 4.0),
('LOT004', 'Shopping Center Lot', '321 Retail Street, Mall District', 40.7505, -73.9934, 40, 150, 67, ARRAY['Covered', 'Security', 'Restrooms'], 4.3),
('LOT005', 'Hospital Parking', '654 Medical Center Dr, Health District', 40.7282, -73.9942, 60, 120, 23, ARRAY['24/7 Access', 'Security', 'Disabled Access'], 4.1);

-- Enable Row Level Security
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for vehicles
CREATE POLICY "Users can view their own vehicles" ON vehicles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vehicles" ON vehicles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vehicles" ON vehicles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vehicles" ON vehicles
  FOR DELETE USING (auth.uid() = user_id);

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_vehicles_user_id ON vehicles(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON bookings(start_time);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_vehicles_updated_at BEFORE UPDATE ON vehicles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();