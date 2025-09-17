-- Create database
CREATE DATABASE IF NOT EXISTS HMSCORE2;
USE HMSCORE2;

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  permissions JSON NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  phone_number VARCHAR(20),
  is_active BOOLEAN DEFAULT TRUE,
  last_login DATETIME,
  role_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create room_types table
CREATE TABLE IF NOT EXISTS room_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  base_rate DECIMAL(10, 2) NOT NULL,
  max_occupancy INT NOT NULL,
  bed_type VARCHAR(50) NOT NULL,
  bed_count INT NOT NULL,
  size INT,
  amenities JSON,
  image_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create rooms table
CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_number VARCHAR(10) NOT NULL UNIQUE,
  floor INT NOT NULL,
  status ENUM('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'CLEANING', 'OUT_OF_SERVICE', 'RESERVED') DEFAULT 'AVAILABLE',
  room_type_id INT NOT NULL,
  max_occupancy INT NOT NULL,
  features JSON,
  maintenance_notes TEXT,
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  is_smoking_allowed BOOLEAN DEFAULT FALSE,
  is_pet_friendly BOOLEAN DEFAULT FALSE,
  is_accessible BOOLEAN DEFAULT FALSE,
  view VARCHAR(50),
  housekeeping_status VARCHAR(20) DEFAULT 'CLEAN',
  housekeeping_notes TEXT,
  last_cleaned_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create guests table
CREATE TABLE IF NOT EXISTS guests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  phone_number VARCHAR(20) NOT NULL,
  date_of_birth DATE,
  address VARCHAR(255),
  city VARCHAR(100),
  country VARCHAR(100),
  postal_code VARCHAR(20),
  id_type VARCHAR(50),
  id_number VARCHAR(50),
  nationality VARCHAR(50),
  preferences JSON,
  is_vip BOOLEAN DEFAULT FALSE,
  vip_level INT,
  company VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_guest_name (last_name, first_name),
  INDEX idx_guest_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_number VARCHAR(20) NOT NULL UNIQUE,
  guest_id INT NOT NULL,
  room_id INT NOT NULL,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  adults INT NOT NULL DEFAULT 1,
  children INT DEFAULT 0,
  status ENUM('PENDING', 'CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT', 'CANCELLED', 'NO_SHOW') DEFAULT 'PENDING',
  total_amount DECIMAL(12, 2) NOT NULL,
  paid_amount DECIMAL(12, 2) DEFAULT 0.00,
  special_requests TEXT,
  source VARCHAR(50) DEFAULT 'WEBSITE',
  is_walk_in BOOLEAN DEFAULT FALSE,
  cancellation_reason TEXT,
  cancelled_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE RESTRICT,
  FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE RESTRICT,
  INDEX idx_reservation_dates (check_in_date, check_out_date, status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  payment_number VARCHAR(20) NOT NULL UNIQUE,
  reservation_id INT NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL,
  transaction_id VARCHAR(100),
  status ENUM('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED', 'CANCELLED') DEFAULT 'PENDING',
  payment_date DATETIME NOT NULL,
  processed_at DATETIME,
  notes TEXT,
  is_refund BOOLEAN DEFAULT FALSE,
  refund_reason TEXT,
  refunded_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
  INDEX idx_payment_status (status, payment_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create audit_logs table for tracking changes
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT,
  old_values JSON,
  new_values JSON,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create indexes for better query performance
CREATE INDEX idx_room_status ON rooms(status, room_type_id);
CREATE INDEX idx_reservation_guest ON reservations(guest_id);
CREATE INDEX idx_reservation_room ON reservations(room_id);
CREATE INDEX idx_payment_reservation ON payments(reservation_id);

-- Insert default roles
INSERT IGNORE INTO roles (id, name, description, permissions, is_default) VALUES
(1, 'admin', 'Administrator with full access', 
  '["users:read", "users:create", "users:update", "users:delete", "roles:manage", "rooms:manage", "reservations:manage", "guests:manage", "payments:manage", "reports:view"]', 
  FALSE),
(2, 'manager', 'Hotel manager with most access', 
  '["users:read", "rooms:manage", "reservations:manage", "guests:manage", "payments:manage", "reports:view"]', 
  FALSE),
(3, 'receptionist', 'Front desk staff', 
  '["reservations:manage", "guests:manage", "payments:create"]', 
  FALSE),
(4, 'housekeeping', 'Housekeeping staff', 
  '["rooms:update", "rooms:read"]', 
  FALSE),
(5, 'user', 'Regular user with limited access', 
  '["profile:read", "profile:update"]', 
  TRUE);

-- Insert default admin user (password: admin123)
INSERT IGNORE INTO users (username, email, password, first_name, last_name, phone_number, role_id, is_active) VALUES
('admin', 'admin@hms.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.6YxZ3aU2KQ6JxZvXzR2dQJ6e1Q5JXmW', 'System', 'Administrator', '+1234567890', 1, TRUE);

-- Insert sample room types
INSERT IGNORE INTO room_types (id, name, description, base_rate, max_occupancy, bed_type, bed_count, size, amenities, is_active) VALUES
(1, 'Standard', 'Comfortable standard room with basic amenities', 99.99, 2, 'Queen', 1, 25, '["TV", "WiFi", "Air Conditioning", "Mini Fridge"]', TRUE),
(2, 'Deluxe', 'Spacious deluxe room with premium amenities', 149.99, 3, 'King', 1, 35, '["TV", "WiFi", "Air Conditioning", "Mini Bar", "Coffee Maker", "Safe"]', TRUE),
(3, 'Suite', 'Luxury suite with separate living area', 249.99, 4, 'King', 1, 60, '["TV", "WiFi", "Air Conditioning", "Mini Bar", "Coffee Maker", "Safe", "Sofa Bed", "Kitchenette"]', TRUE),
(4, 'Family', 'Large family room with multiple beds', 179.99, 6, 'Queen', 2, 45, '["TV", "WiFi", "Air Conditioning", "Mini Fridge", "Microwave"]', TRUE),
(5, 'Accessible', 'Accessible room with wheelchair access', 119.99, 2, 'Queen', 1, 30, '["TV", "WiFi", "Air Conditioning", "Roll-in Shower", "Grab Bars"]', TRUE);

-- Insert sample rooms
-- Floors 1-5, 20 rooms per floor, various types
DELIMITER //
CREATE PROCEDURE InsertSampleRooms()
BEGIN
  DECLARE i INT DEFAULT 1;
  DECLARE j INT;
  DECLARE room_num VARCHAR(10);
  DECLARE floor_num INT;
  DECLARE room_type INT;
  DECLARE statuses VARCHAR(200) DEFAULT 'AVAILABLE,AVAILABLE,AVAILABLE,MAINTENANCE,AVAILABLE';
  DECLARE status_index INT;
  
  WHILE i <= 5 DO -- 5 floors
    SET j = 1;
    WHILE j <= 20 DO -- 20 rooms per floor
      SET room_num = CONCAT(i, LPAD(j, 2, '0'));
      SET floor_num = i;
      
      -- Distribute room types
      IF j <= 10 THEN
        SET room_type = 1; -- Standard
      ELSEIF j <= 15 THEN
        SET room_type = 2; -- Deluxe
      ELSEIF j <= 18 THEN
        SET room_type = 3; -- Suite
      ELSEIF j <= 19 THEN
        SET room_type = 4; -- Family
      ELSE
        SET room_type = 5; -- Accessible
      END IF;
      
      -- Random status (mostly available, some in maintenance)
      SET status_index = FLOOR(1 + RAND() * 5);
      
      INSERT INTO rooms (
        room_number, 
        floor, 
        status, 
        room_type_id, 
        max_occupancy,
        is_smoking_allowed,
        is_accessible,
        view,
        housekeeping_status
      ) VALUES (
        room_num,
        floor_num,
        (SELECT ELT(status_index, 'AVAILABLE', 'AVAILABLE', 'AVAILABLE', 'MAINTENANCE', 'CLEANING')),
        room_type,
        (SELECT max_occupancy FROM room_types WHERE id = room_type),
        (j % 5 = 0), -- Some smoking rooms
        (room_type = 5 OR j % 7 = 0), -- All accessible rooms + some others
        CASE 
          WHEN i >= 3 AND j % 2 = 0 THEN 'City View' 
          WHEN i >= 3 AND j % 3 = 0 THEN 'Mountain View' 
          WHEN i >= 3 THEN 'Garden View' 
          ELSE 'Street View' 
        END,
        CASE 
          WHEN status_index = 4 THEN 'INSPECTED' 
          WHEN status_index = 5 THEN 'CLEAN' 
          ELSE 'CLEAN' 
        END
      );
      
      SET j = j + 1;
    END WHILE;
    SET i = i + 1;
  END WHILE;
END //
DELIMITER ;

-- Call the procedure to insert sample rooms
CALL InsertSampleRooms();

-- Drop the procedure after use
DROP PROCEDURE IF EXISTS InsertSampleRooms;
