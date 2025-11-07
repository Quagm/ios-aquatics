-- Add appointment_at column to inquiries table
-- Run this in your Supabase SQL Editor

ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS appointment_at TIMESTAMP WITH TIME ZONE;

