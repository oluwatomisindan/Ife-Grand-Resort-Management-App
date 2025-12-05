-- Migration script to add category column to existing rooms table
-- Run this script if you already have an existing database

-- Add category column to rooms table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'rooms' AND column_name = 'category'
    ) THEN
        ALTER TABLE rooms ADD COLUMN category TEXT NOT NULL DEFAULT 'Standard';
        
        -- Update existing rooms with appropriate categories based on their type
        UPDATE rooms SET category = 'Premium' WHERE type = 'Deluxe';
        UPDATE rooms SET category = 'Super Premium' WHERE type = 'Suite';
        UPDATE rooms SET category = 'Kings' WHERE type = 'Villa';
        
        RAISE NOTICE 'Category column added successfully';
    ELSE
        RAISE NOTICE 'Category column already exists';
    END IF;
END $$;

COMMIT;
