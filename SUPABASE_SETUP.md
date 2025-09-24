# Supabase Setup Guide for Web iOS Aquatics

This guide will help you set up Supabase for your aquatics e-commerce application.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- Your project cloned locally

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `web-ios-aquatics` (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project"
6. Wait for the project to be created (this takes a few minutes)

## Step 2: Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJ...`)

## Step 3: Configure Environment Variables

1. In your project root, create a `.env.local` file:
   ```bash
   # Copy from env.example and fill in your values
   cp env.example .env.local
   ```

2. Edit `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire contents of `database-schema.sql` from your project
3. Paste it into the SQL Editor
4. Click **Run** to execute the schema

This will create:
- ✅ `products` table with sample data
- ✅ `inquiries` table with status tracking
- ✅ `orders` table for order management
- ✅ `order_items` table for order details
- ✅ Row Level Security (RLS) policies
- ✅ Performance indexes

## Step 5: Verify the Setup

1. In your Supabase dashboard, go to **Table Editor**
2. You should see all 4 tables created
3. Check the `products` table - it should have 8 sample products

## Step 6: Test the Connection

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open your browser console and look for:
   ```
   ✅ Supabase connection successful
   ```

3. If you see connection errors, double-check your environment variables

## Database Tables Overview

### Products Table
- Stores aquarium products with categories
- Fields: `id`, `name`, `price`, `image`, `category`, `created_at`
- Sample categories: Equipment, Lighting, Food, Chemicals, Decorations, Accessories

### Inquiries Table
- Customer inquiries and support tickets
- Fields: `id`, `first_name`, `last_name`, `email`, `phone`, `subject`, `message`, `status`, `created_at`
- Status options: `pending`, `in_progress`, `resolved`, `closed`

### Orders Table
- Customer orders
- Fields: `id`, `total`, `status`, `created_at`
- Status options: `pending`, `processing`, `shipped`, `delivered`, `cancelled`

### Order Items Table
- Individual items within orders
- Fields: `id`, `order_id`, `product_id`, `quantity`, `price`
- Links orders to products with quantities and prices

## Security Configuration

The database is configured with Row Level Security (RLS) and public policies that allow:
- ✅ Reading all products
- ✅ Creating/reading/updating/deleting products (for admin features)
- ✅ Creating and reading inquiries
- ✅ Updating inquiry status
- ✅ Creating and reading orders
- ✅ Updating order status

**Note**: In production, you should implement proper authentication and restrict these policies based on user roles.

## API Functions Available

Your `queries.js` file provides these functions:

### Products
- `fetchProducts({ category })` - Get products, optionally filtered by category
- `createProduct(product)` - Add new product
- `updateProduct(productId, updates)` - Update existing product
- `deleteProductById(productId)` - Delete product

### Inquiries
- `fetchInquiries()` - Get all inquiries
- `createInquiry(inquiry)` - Submit new inquiry
- `updateInquiryStatus(inquiryId, status)` - Update inquiry status
- `deleteInquiryById(inquiryId)` - Delete inquiry

### Orders
- `fetchOrders()` - Get all orders with items and product details
- `createOrder({ items, total })` - Create new order
- `updateOrderStatus(orderId, status)` - Update order status

### Analytics
- `getSalesAnalytics()` - Get comprehensive sales analytics

## Troubleshooting

### Connection Issues
- Verify your environment variables are correct
- Check that `.env.local` is in your project root
- Restart your development server after changing environment variables

### Database Errors
- Check the Supabase logs in your dashboard
- Verify the schema was applied correctly
- Ensure RLS policies are properly configured

### API Errors
- Check browser console for detailed error messages
- Verify required fields are provided when creating records
- Check that IDs exist when updating/deleting records

## Next Steps

1. **Authentication**: Consider adding user authentication with Supabase Auth
2. **File Storage**: Use Supabase Storage for product images
3. **Real-time**: Enable real-time subscriptions for live updates
4. **Production**: Review and tighten security policies before going live

## Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- Check the browser console for detailed error messages
