-- ============================================================
-- All In One Tour — PostgreSQL Schema
-- Run this in Supabase SQL Editor or any PostgreSQL client
-- ============================================================

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL PRIMARY KEY,
  full_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  phone      VARCHAR(20),
  country    VARCHAR(80),
  role       VARCHAR(10)  NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  is_active  BOOLEAN      NOT NULL DEFAULT TRUE,
  avatar     VARCHAR(255),
  created_at TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP    NOT NULL DEFAULT NOW(),
  last_login TIMESTAMP
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE SET NULL,
  full_name   VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  phone       VARCHAR(30),
  tour_type   VARCHAR(120) NOT NULL,
  tour_date   DATE         NOT NULL,
  guests      VARCHAR(10)  NOT NULL DEFAULT '1',
  message     TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  admin_notes TEXT,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(150) NOT NULL,
  subject    VARCHAR(200),
  message    TEXT         NOT NULL,
  is_read    BOOLEAN      NOT NULL DEFAULT FALSE,
  replied_at TIMESTAMP,
  created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE SET NULL,
  name        VARCHAR(100) NOT NULL,
  country     VARCHAR(80),
  tour_type   VARCHAR(120),
  rating      SMALLINT     NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review      TEXT         NOT NULL,
  is_approved BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- ACTIVITY LOGS
CREATE TABLE IF NOT EXISTS activity_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INT REFERENCES users(id) ON DELETE SET NULL,
  action      VARCHAR(100) NOT NULL,
  description TEXT,
  ip_address  VARCHAR(45),
  created_at  TIMESTAMP    NOT NULL DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_users_email      ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role       ON users(role);
CREATE INDEX IF NOT EXISTS idx_bookings_status  ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date    ON bookings(tour_date);
CREATE INDEX IF NOT EXISTS idx_messages_read    ON contact_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_testimonials_app ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_logs_user        ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_created     ON activity_logs(created_at);

-- SEED: Default Admin User (password: Admin@2024)
INSERT INTO users (full_name, email, password, role, is_active)
VALUES (
  'Hyacinth HABINEZA',
  'admin@allinonetour.rw',
  '$2a$12$.RDWBx3llgNe6BukRz3wP.YM/TsO/jnPi1Y3emm8Q.oAsIukfeKDa',
  'admin',
  TRUE
)
ON CONFLICT (email) DO NOTHING;
