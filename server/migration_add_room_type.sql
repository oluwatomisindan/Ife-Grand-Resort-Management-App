-- Migration script to add room_type column to existing rooms table
-- Run this script if you already have an existing database

-- Add room_type column to rooms table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rooms' AND column_name = 'room_type'
    ) THEN
        ALTER TABLE rooms ADD COLUMN room_type TEXT;
        
        RAISE NOTICE 'room_type column added successfully';
    ELSE
        RAISE NOTICE 'room_type column already exists';
    END IF;
END $$;

COMMIT;
