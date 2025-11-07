# Migration: Add user_accounts table

## Overview
This migration creates the `user_accounts` table to store user account information in the database instead of localStorage.

## SQL Command

Run this SQL in your Supabase SQL Editor:

```sql
CREATE TABLE IF NOT EXISTS user_accounts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_accounts_user_id ON user_accounts(user_id);

ALTER TABLE user_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own account" ON user_accounts FOR SELECT USING (true);
CREATE POLICY "Users can insert their own account" ON user_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own account" ON user_accounts FOR UPDATE USING (true);
```

## Steps to Run

1. Go to your Supabase Dashboard
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Paste the SQL above
5. Click "Run" or press Ctrl+Enter
6. You should see "Success. No rows returned"

## Verification

After running the migration:

1. Go to "Table Editor" in Supabase
2. You should see `user_accounts` table in the list
3. Try saving account information in your app
4. Check the table - you should see a new row with your user_id and account data

## Troubleshooting

If you get an error:
- **"relation already exists"** - The table already exists, you can skip this migration
- **"permission denied"** - Make sure you're using the correct database user
- **"syntax error"** - Copy the SQL exactly as shown above

## What This Table Stores

- `user_id` - Clerk user ID (unique)
- `name` - Full name
- `email` - Email address
- `phone` - Phone number
- `address` - Street address
- `city` - City
- `province` - Province
- `postal_code` - Postal code

