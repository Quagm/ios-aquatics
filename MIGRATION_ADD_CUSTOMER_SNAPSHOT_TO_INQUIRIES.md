# Migration: Add customer_snapshot to inquiries table

## Overview
This migration adds the `customer_snapshot` JSONB column to the `inquiries` table to store customer account information at the time of inquiry submission.

## Why This Column?
Similar to orders, inquiries now store a snapshot of customer information (name, email, phone, address, etc.) at the time the inquiry was created. This ensures that even if customer account information changes later, the inquiry retains the original customer details.

## SQL Command

Run this SQL in your Supabase SQL Editor:

```sql
ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS customer_snapshot JSONB;
```

## What This Column Stores

The `customer_snapshot` column stores a JSON object with the following structure:

```json
{
  "name": "Full Name",
  "first_name": "First",
  "last_name": "Last",
  "email": "email@example.com",
  "phone": "+63 912 345 6789",
  "address": "Street Address",
  "city": "City",
  "province": "Province",
  "postal_code": "12345"
}
```

## Code Changes

The following code has been updated to handle this column:

1. **`src/lib/queries.js`** - `createInquiry()` function now handles missing column gracefully
2. **`src/components/AquascapeForm.jsx`** - Creates customer snapshot when submitting inquiry
3. **`src/components/admin/InquiryManagement.jsx`** - Displays customer snapshot in inquiry details
4. **`src/components/admin/InquiryHistory.jsx`** - Displays customer snapshot in inquiry details

## Backward Compatibility

The code has been updated to handle cases where the column doesn't exist:
- If the column is missing, the inquiry will still be created without the snapshot
- A helpful error message will be shown with the SQL command to run
- Existing inquiries without snapshots will continue to work

## Verification

After running the migration, verify by:
1. Submitting a new aquascape inquiry
2. Checking the inquiry in the admin dashboard
3. Verifying that the "Account Information" section shows the customer snapshot data

