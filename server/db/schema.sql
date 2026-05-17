-- ============================================================
-- All In One Tour - MySQL Database Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS all_in_one_tour
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE all_in_one_tour;

-- ============================================================
-- USERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  full_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  phone       VARCHAR(20),
  country     VARCHAR(80),
  role        ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  is_active   TINYINT(1) NOT NULL DEFAULT 1,
  avatar      VARCHAR(255),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  last_login  DATETIME,
  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB;

-- ============================================================
-- BOOKINGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT,
  full_name    VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL,
  phone        VARCHAR(30),
  tour_type    VARCHAR(120) NOT NULL,
  tour_date    DATE NOT NULL,
  guests       VARCHAR(10) NOT NULL DEFAULT '1',
  message      TEXT,
  status       ENUM('pending','confirmed','cancelled','completed') NOT NULL DEFAULT 'pending',
  admin_notes  TEXT,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_status     (status),
  INDEX idx_tour_date  (tour_date),
  INDEX idx_email      (email)
) ENGINE=InnoDB;

-- ============================================================
-- CONTACT MESSAGES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  subject     VARCHAR(200),
  message     TEXT NOT NULL,
  is_read     TINYINT(1) NOT NULL DEFAULT 0,
  replied_at  DATETIME,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB;

-- ============================================================
-- TESTIMONIALS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT,
  name        VARCHAR(100) NOT NULL,
  country     VARCHAR(80),
  tour_type   VARCHAR(120),
  rating      TINYINT NOT NULL DEFAULT 5,
  review      TEXT NOT NULL,
  is_approved TINYINT(1) NOT NULL DEFAULT 0,
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_approved (is_approved)
) ENGINE=InnoDB;

-- ============================================================
-- ACTIVITY LOGS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS activity_logs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT,
  action      VARCHAR(100) NOT NULL,
  description TEXT,
  ip_address  VARCHAR(45),
  created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_user_id   (user_id),
  INDEX idx_created   (created_at)
) ENGINE=InnoDB;

-- ============================================================
-- SEED: Default Admin User
-- Password: Admin@2024 (bcrypt hash)
-- ============================================================
INSERT IGNORE INTO users (full_name, email, password, role, is_active)
VALUES (
  'Hyacinth HABINEZA',
  'admin@allinonetour.rw',
  '$2a$12$.RDWBx3llgNe6BukRz3wP.YM/TsO/jnPi1Y3emm8Q.oAsIukfeKDa',
  'admin',
  1
);
