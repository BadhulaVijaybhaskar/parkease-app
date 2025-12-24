-- Add the actual lot IDs used by mock data
-- Run this in Supabase SQL Editor

INSERT INTO parking_lots (id, name, address, lat, lng, price_per_hour) VALUES
('LOT1', 'City Center Parking', '123 MG Road, Central Business District', 12.9716, 77.5946, 40),
('LOT2', 'Mall Parking Complex', '456 Brigade Road, Shopping District', 12.9716, 77.5946, 50),
('LOT3', 'Metro Station Parking', '789 Station Road, Near Metro Exit 2', 12.9716, 77.5946, 25),
('LOT4', 'Tech Park Parking', '321 IT Corridor, Whitefield', 12.9716, 77.5946, 35),
('LOT5', 'Hospital Parking Zone', '555 Health Avenue, Medical District', 12.9716, 77.5946, 30)
ON CONFLICT (id) DO NOTHING;

-- Add slots for these lots
INSERT INTO slots (lot_id, label, status) VALUES
-- LOT1 slots
('LOT1', 'A1', 'AVAILABLE'), ('LOT1', 'A2', 'AVAILABLE'), ('LOT1', 'A3', 'BLOCKED'),
('LOT1', 'A4', 'AVAILABLE'), ('LOT1', 'A5', 'AVAILABLE'), ('LOT1', 'A6', 'AVAILABLE'),
('LOT1', 'B1', 'AVAILABLE'), ('LOT1', 'B2', 'AVAILABLE'), ('LOT1', 'B3', 'AVAILABLE'),
('LOT1', 'B4', 'AVAILABLE'), ('LOT1', 'B5', 'AVAILABLE'), ('LOT1', 'B6', 'AVAILABLE'),
-- LOT2 slots
('LOT2', 'A1', 'AVAILABLE'), ('LOT2', 'A2', 'BLOCKED'), ('LOT2', 'A3', 'AVAILABLE'),
('LOT2', 'B1', 'AVAILABLE'), ('LOT2', 'B2', 'AVAILABLE'), ('LOT2', 'B3', 'AVAILABLE'),
-- LOT3 slots
('LOT3', 'A1', 'AVAILABLE'), ('LOT3', 'A2', 'AVAILABLE'), ('LOT3', 'A3', 'AVAILABLE'),
('LOT3', 'B1', 'BLOCKED'), ('LOT3', 'B2', 'AVAILABLE'), ('LOT3', 'B3', 'AVAILABLE'),
-- LOT4 slots
('LOT4', 'A1', 'AVAILABLE'), ('LOT4', 'A2', 'AVAILABLE'), ('LOT4', 'A3', 'AVAILABLE'),
('LOT4', 'B1', 'AVAILABLE'), ('LOT4', 'B2', 'BLOCKED'), ('LOT4', 'B3', 'AVAILABLE'),
-- LOT5 slots
('LOT5', 'A1', 'AVAILABLE'), ('LOT5', 'A2', 'AVAILABLE'), ('LOT5', 'A3', 'AVAILABLE'),
('LOT5', 'B1', 'AVAILABLE'), ('LOT5', 'B2', 'AVAILABLE'), ('LOT5', 'B3', 'BLOCKED')
ON CONFLICT DO NOTHING;