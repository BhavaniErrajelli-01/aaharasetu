-- ===================================================================
-- Aahara Setu - SQLite Database Schema
-- Defines users, beneficiaries, slots, slot_assignments, distribution_records
-- ===================================================================

PRAGMA foreign_keys = ON;

-- 1. Users Table (Authentication & Role Management)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('DEALER', 'USER'))
);


-- 2. Beneficiaries Table (Ration Card Holders)
CREATE TABLE IF NOT EXISTS beneficiaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ration_card_number TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    fps_shop_number TEXT NOT NULL,
    registered_mobile TEXT,
    preferred_language TEXT DEFAULT 'te',
    village TEXT
);

-- 3. Slots Table (Distribution Time Windows)
CREATE TABLE IF NOT EXISTS slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slot_date TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    capacity INTEGER NOT NULL CHECK (capacity > 0)
);

-- 4. Slot Assignments Table (Mapping Beneficiaries to Slots)
CREATE TABLE IF NOT EXISTS slot_assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    slot_id INTEGER NOT NULL,
    assignment_status TEXT NOT NULL CHECK (assignment_status IN ('ASSIGNED', 'ARRIVED', 'COMPLETED', 'MISSED', 'REALLOCATED')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES slots(id) ON DELETE CASCADE
);

-- 5. Distribution Records Table (Biometric/FPS Fulfillment Tracking)
CREATE TABLE IF NOT EXISTS distribution_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    slot_id INTEGER,
    arrival_time TEXT,
    distribution_time TEXT,
    status TEXT NOT NULL CHECK (status IN ('ASSIGNED', 'ARRIVED', 'COMPLETED', 'MISSED', 'REALLOCATED')),
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE,
    FOREIGN KEY (slot_id) REFERENCES slots(id) ON DELETE SET NULL
);

-- Additional Table for Notifications Auditing
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    beneficiary_id INTEGER NOT NULL,
    channel TEXT NOT NULL, -- SMS_ENGLISH, SMS_TELUGU, VOICE_CALL_ENGLISH, VOICE_CALL_TELUGU, ANNOUNCEMENT_LIST, USER_PORTAL
    status TEXT NOT NULL,  -- SENT, PENDING, DELIVERED, ANNOUNCED
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (beneficiary_id) REFERENCES beneficiaries(id) ON DELETE CASCADE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_beneficiaries_card ON beneficiaries(ration_card_number);
CREATE INDEX IF NOT EXISTS idx_beneficiaries_fps ON beneficiaries(fps_shop_number);
CREATE INDEX IF NOT EXISTS idx_slot_assignments_ben ON slot_assignments(beneficiary_id);
CREATE INDEX IF NOT EXISTS idx_slot_assignments_slot ON slot_assignments(slot_id);
CREATE INDEX IF NOT EXISTS idx_distribution_records_ben ON distribution_records(beneficiary_id);
