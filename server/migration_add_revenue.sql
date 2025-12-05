-- Migration script to add revenue tracking to existing database
-- Run this script if you already have an existing database

-- Add total_amount column to reservations table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'reservations' AND column_name = 'total_amount'
    ) THEN
        ALTER TABLE reservations ADD COLUMN total_amount DECIMAL(10, 2) DEFAULT 0;
    END IF;
END $$;

-- Create room_revenue table if it doesn't exist
CREATE TABLE IF NOT EXISTS room_revenue (
    id TEXT PRIMARY KEY,
    room_id TEXT REFERENCES rooms(id) ON DELETE CASCADE,
    reservation_id TEXT REFERENCES reservations(id),
    amount DECIMAL(10, 2) NOT NULL,
    revenue_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_room_revenue_room_id ON room_revenue(room_id);
CREATE INDEX IF NOT EXISTS idx_room_revenue_date ON room_revenue(revenue_date);

COMMIT;
