# Migration: Add appointment_at Column to Inquiries Table

## Problem
The `appointment_at` column is missing from the `inquiries` table, causing errors when trying to update inquiry statuses or schedule appointments.

## Solution
Run the following SQL in your Supabase SQL Editor to add the missing column.

## Steps

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Run this SQL command:

```sql
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS appointment_at TIMESTAMP WITH TIME ZONE;
```

4. Verify the column was added by running:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'inquiries' AND column_name = 'appointment_at';
```

You should see a row with `appointment_at` and `timestamp with time zone`.

## Alternative: Run the migration file

You can also run the SQL file: `add-appointment-column.sql`

## After Migration

Once the column is added, the inquiry status updates and appointment scheduling should work correctly.

