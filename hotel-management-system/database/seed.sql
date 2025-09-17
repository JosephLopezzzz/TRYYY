-- Seed script for Hotel Management System
-- This script populates the database with sample data for testing and development

USE HMSCORE2;

-- Disable foreign key checks temporarily to avoid reference issues
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate tables to start fresh (except for roles and users which have default data)
TRUNCATE TABLE payments;
TRUNCATE TABLE reservations;
TRUNCATE TABLE guests;
TRUNCATE TABLE rooms;
TRUNCATE TABLE room_types;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Reset auto-increment counters
ALTER TABLE payments AUTO_INCREMENT = 1;
ALTER TABLE reservations AUTO_INCREMENT = 1;
ALTER TABLE guests AUTO_INCREMENT = 1;
ALTER TABLE rooms AUTO_INCREMENT = 1;
ALTER TABLE room_types AUTO_INCREMENT = 1;

-- Insert sample room types
INSERT INTO room_types (id, name, description, base_rate, max_occupancy, bed_type, bed_count, size, amenities, is_active) VALUES
(1, 'Standard', 'Comfortable standard room with basic amenities', 99.99, 2, 'Queen', 1, 25, '["TV", "WiFi", "Air Conditioning", "Mini Fridge"]', TRUE),
(2, 'Deluxe', 'Spacious deluxe room with premium amenities', 149.99, 3, 'King', 1, 35, '["TV", "WiFi", "Air Conditioning", "Mini Bar", "Coffee Maker", "Safe"]', TRUE),
(3, 'Suite', 'Luxury suite with separate living area', 249.99, 4, 'King', 1, 60, '["TV", "WiFi", "Air Conditioning", "Mini Bar", "Coffee Maker", "Safe", "Sofa Bed", "Kitchenette"]', TRUE),
(4, 'Family', 'Large family room with multiple beds', 179.99, 6, 'Queen', 2, 45, '["TV", "WiFi", "Air Conditioning", "Mini Fridge", "Microwave"]', TRUE),
(5, 'Accessible', 'Accessible room with wheelchair access', 119.99, 2, 'Queen', 1, 30, '["TV", "WiFi", "Air Conditioning", "Roll-in Shower", "Grab Bars"]', TRUE);

-- Insert sample rooms (simplified to 10 rooms)
INSERT INTO rooms (room_number, floor, status, room_type_id, max_occupancy, is_smoking_allowed, is_accessible, view, housekeeping_status, last_cleaned_at) VALUES
-- Floor 1
('101', 1, 'AVAILABLE', 1, 2, FALSE, FALSE, 'Garden View', 'CLEAN', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('102', 1, 'AVAILABLE', 1, 2, TRUE, FALSE, 'Street View', 'CLEAN', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('103', 1, 'MAINTENANCE', 5, 2, FALSE, TRUE, 'Garden View', 'INSPECTED', DATE_SUB(NOW(), INTERVAL 2 DAY)),
-- Floor 2
('201', 2, 'AVAILABLE', 2, 3, FALSE, FALSE, 'City View', 'CLEAN', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('202', 2, 'OCCUPIED', 2, 3, FALSE, FALSE, 'City View', 'DIRTY', DATE_SUB(NOW(), INTERVAL 3 DAY)),
-- Floor 3
('301', 3, 'AVAILABLE', 3, 4, FALSE, FALSE, 'Mountain View', 'CLEAN', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('302', 3, 'RESERVED', 3, 4, FALSE, FALSE, 'Mountain View', 'CLEAN', NOW()),
-- Floor 4
('401', 4, 'AVAILABLE', 4, 6, FALSE, FALSE, 'City View', 'CLEAN', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('402', 4, 'AVAILABLE', 4, 6, FALSE, TRUE, 'City View', 'CLEAN', DATE_SUB(NOW(), INTERVAL 1 DAY)),
('501', 5, 'AVAILABLE', 3, 4, FALSE, FALSE, 'Panoramic View', 'CLEAN', NOW());

-- Insert sample guests
INSERT INTO guests (first_name, last_name, email, phone_number, date_of_birth, address, preferences, is_vip) VALUES
('John', 'Doe', 'john.doe@example.com', '+1234567890', '1985-05-15', '123 Main St, New York, USA', '{"preferred_floor": "high", "room_service": true}', FALSE),
('Jane', 'Smith', 'jane.smith@example.com', '+1987654321', '1990-08-22', '456 Park Ave, Los Angeles, USA', '{"preferred_floor": "any", "room_service": false}', TRUE),
('Robert', 'Johnson', 'robert.j@example.com', '+1122334455', '1978-11-30', '789 Broadway, Chicago, USA', '{"preferred_floor": "low", "room_service": true}', FALSE),
('Emily', 'Williams', 'emily.w@example.com', '+1555666777', '1992-03-10', '321 Oak St, Houston, USA', '{"preferred_floor": "high", "room_service": true}', TRUE);

-- Insert sample reservations
INSERT INTO reservations (reservation_number, guest_id, room_id, check_in_date, check_out_date, adults, children, status, total_amount, paid_amount, source, created_at) VALUES
-- Past reservation
('RES-20230001', 1, 1, DATE_SUB(CURRENT_DATE, INTERVAL 10 DAY), DATE_SUB(CURRENT_DATE, INTERVAL 7 DAY), 2, 0, 'CHECKED_OUT', 349.97, 349.97, 'WEBSITE', DATE_SUB(NOW(), INTERVAL 12 DAY)),
-- Current stay
('RES-20230002', 2, 5, DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY), 2, 1, 'CHECKED_IN', 449.97, 300.00, 'PHONE', DATE_SUB(NOW(), INTERVAL 5 DAY)),
-- Future reservation
('RES-20230003', 3, 7, DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY), 2, 2, 'CONFIRMED', 599.98, 599.98, 'WEBSITE', DATE_SUB(NOW(), INTERVAL 2 DAY)),
-- Cancelled reservation
('RES-20230004', 4, 8, DATE_ADD(CURRENT_DATE, INTERVAL 10 DAY), DATE_ADD(CURRENT_DATE, INTERVAL 12 DAY), 4, 2, 'CANCELLED', 539.97, 0.00, 'WEBSITE', DATE_SUB(NOW(), INTERVAL 1 DAY));

-- Insert sample payments
INSERT INTO payments (payment_number, reservation_id, amount, payment_method, status, payment_date, created_at) VALUES
-- Payment for past reservation
('PAY-20230001', 1, 349.97, 'CREDIT_CARD', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 12 DAY)),
-- Deposit for current stay
('PAY-20230002', 2, 150.00, 'CREDIT_CARD', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 5 DAY)),
-- Second payment for current stay
('PAY-20230003', 2, 150.00, 'CASH', 'COMPLETED', NOW(), NOW()),
-- Payment for future reservation
('PAY-20230004', 3, 599.98, 'CREDIT_CARD', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- Update room statuses based on reservations
UPDATE rooms r
JOIN reservations res ON r.id = res.room_id
SET r.status = 'OCCUPIED'
WHERE res.check_in_date <= CURRENT_DATE 
AND res.check_out_date >= CURRENT_DATE
AND res.status = 'CHECKED_IN';

-- Mark some rooms for maintenance
UPDATE rooms 
SET status = 'MAINTENANCE',
    maintenance_notes = 'Plumbing issue needs attention',
    last_maintenance_date = DATE_SUB(CURRENT_DATE, INTERVAL 15 DAY),
    next_maintenance_date = DATE_ADD(CURRENT_DATE, INTERVAL 7 DAY)
WHERE id = 3;

-- Create sample audit logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
(1, 'CREATE', 'RESERVATION', 1, NULL, '{"status": "CONFIRMED"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', DATE_SUB(NOW(), INTERVAL 12 DAY)),
(1, 'UPDATE', 'ROOM', 5, '{"status": "AVAILABLE"}', '{"status": "OCCUPIED"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 'CREATE', 'PAYMENT', 2, NULL, '{"amount": 150.00, "status": "COMPLETED"}', '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', DATE_SUB(NOW(), INTERVAL 5 DAY));

-- Update room 302 to show it's reserved
UPDATE rooms SET status = 'RESERVED' WHERE id = 7;
