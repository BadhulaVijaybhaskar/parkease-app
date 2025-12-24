-- Ensure parking_lots table has all required lot IDs
-- Run this in Supabase SQL Editor

-- Insert all parking lots from mock data
INSERT INTO parking_lots (id, name, address, lat, lng, price_per_hour) VALUES
('LOT001', 'Central Mall Parking', '123 Main Street, Downtown', 40.7128, -74.0060, 50),
('LOT002', 'Business District Plaza', '456 Business Ave, Financial District', 40.7589, -73.9851, 75),
('LOT003', 'Airport Terminal Parking', '789 Airport Road, Terminal 1', 40.6413, -73.7781, 100),
('LOT004', 'Shopping Center Lot', '321 Retail Street, Mall District', 40.7505, -73.9934, 40),
('LOT005', 'Hospital Parking', '654 Medical Center Dr, Health District', 40.7282, -73.9942, 60),
('central-mall', 'Central Mall Parking', '123 Main Street, Downtown', 40.7128, -74.0060, 50),
('business-plaza', 'Business District Plaza', '456 Business Ave, Financial District', 40.7589, -73.9851, 75),
('airport-terminal', 'Airport Terminal Parking', '789 Airport Road, Terminal 1', 40.6413, -73.7781, 100),
('shopping-center', 'Shopping Center Lot', '321 Retail Street, Mall District', 40.7505, -73.9934, 40),
('hospital-parking', 'Hospital Parking', '654 Medical Center Dr, Health District', 40.7282, -73.9942, 60)
ON CONFLICT (id) DO NOTHING;

-- Also add slots for the new lot IDs if they don't exist
INSERT INTO slots (lot_id, label, status) VALUES
-- central-mall slots
('central-mall', 'A1', 'AVAILABLE'), ('central-mall', 'A2', 'AVAILABLE'), ('central-mall', 'A3', 'BLOCKED'),
('central-mall', 'B1', 'AVAILABLE'), ('central-mall', 'B2', 'AVAILABLE'), ('central-mall', 'B3', 'AVAILABLE'),
('central-mall', 'C1', 'AVAILABLE'), ('central-mall', 'C2', 'AVAILABLE'), ('central-mall', 'C3', 'AVAILABLE'),
('central-mall', 'C4', 'AVAILABLE'), ('central-mall', 'C5', 'AVAILABLE'), ('central-mall', 'C6', 'AVAILABLE'),
-- business-plaza slots  
('business-plaza', 'A1', 'AVAILABLE'), ('business-plaza', 'A2', 'BLOCKED'), ('business-plaza', 'A3', 'AVAILABLE'),
('business-plaza', 'B1', 'AVAILABLE'), ('business-plaza', 'B2', 'AVAILABLE'), ('business-plaza', 'B3', 'AVAILABLE'),
-- airport-terminal slots
('airport-terminal', 'A1', 'AVAILABLE'), ('airport-terminal', 'A2', 'AVAILABLE'), ('airport-terminal', 'A3', 'AVAILABLE'),
('airport-terminal', 'B1', 'BLOCKED'), ('airport-terminal', 'B2', 'AVAILABLE'), ('airport-terminal', 'B3', 'AVAILABLE'),
-- shopping-center slots
('shopping-center', 'A1', 'AVAILABLE'), ('shopping-center', 'A2', 'AVAILABLE'), ('shopping-center', 'A3', 'AVAILABLE'),
('shopping-center', 'B1', 'AVAILABLE'), ('shopping-center', 'B2', 'BLOCKED'), ('shopping-center', 'B3', 'AVAILABLE'),
-- hospital-parking slots
('hospital-parking', 'A1', 'AVAILABLE'), ('hospital-parking', 'A2', 'AVAILABLE'), ('hospital-parking', 'A3', 'AVAILABLE'),
('hospital-parking', 'B1', 'AVAILABLE'), ('hospital-parking', 'B2', 'AVAILABLE'), ('hospital-parking', 'B3', 'BLOCKED')
ON CONFLICT DO NOTHING;