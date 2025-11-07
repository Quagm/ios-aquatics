# IOS Aquatics - Project Summary & How Everything Works

## Overview
IOS Aquatics is a full-stack e-commerce web application for an aquatic products store. It's built with Next.js 15, React 19, Supabase (PostgreSQL database), Clerk (authentication), and Tailwind CSS.

## Technology Stack

### Frontend
- **Next.js 15.5.2** - React framework with App Router
- **React 19.1.0** - UI library
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Chart.js & React-Chartjs-2** - Data visualization for analytics

### Backend & Services
- **Supabase** - PostgreSQL database with realtime subscriptions
- **Clerk** - Authentication and user management
- **PayMongo** - Payment processing integration
- **Supabase Storage** - File/image uploads

## Project Structure

```
web-ios-aquatics/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.jsx           # Homepage
│   │   ├── store-page/        # Product catalog
│   │   ├── product-page/      # Individual product details
│   │   ├── cart-page/         # Shopping cart
│   │   ├── checkout-page/     # Checkout process
│   │   ├── account-page/      # User account management
│   │   ├── admin/             # Admin dashboard pages
│   │   └── api/               # API routes
│   ├── components/            # React components
│   │   ├── admin/             # Admin-specific components
│   │   └── ui/                # Reusable UI components
│   ├── lib/                   # Utility functions
│   │   └── queries.js         # Database query functions
│   └── middleware.jsx         # Route protection
```

## Core Features & How They Work

### 1. Authentication System (Clerk)

**How it works:**
- Clerk handles all user authentication (sign up, sign in, sign out)
- User sessions are managed by Clerk
- Protected routes use middleware to check authentication
- Admin routes require admin role in Clerk metadata

**Key Files:**
- `src/app/layout.jsx` - Wraps app with ClerkProvider
- `src/middleware.jsx` - Protects `/admin` routes
- `src/components/admin/AdminProtection.jsx` - Additional admin checks

**User Roles:**
- Regular users can browse, shop, and manage their account
- Admin users can access admin dashboard for managing products, orders, and inquiries

### 2. Product Management

**Store Page (`/store-page`):**
- Fetches all products from Supabase `products` table
- Displays products in a grid with filtering by category
- Real-time product updates via Supabase subscriptions
- Search functionality filters products by name, SKU, or category

**Product Details (`/product-page`):**
- Shows individual product information
- Quantity selector (typable input, no spinners)
- Add to cart functionality
- Stock validation before adding to cart

**Admin Inventory Management (`/admin/inventory-management`):**
- Full CRUD operations (Create, Read, Update, Delete)
- Add products with image upload or URL
- Edit product details (name, price, stock, category, description, SKU)
- Delete products with confirmation
- Real-time updates when products are modified
- Stock status indicators (in-stock, low-stock, out-of-stock)
- Active/inactive toggle to show/hide products from store

**Stock Management:**
- Stock is decremented when orders are created
- Stock is restored when orders are cancelled
- Stock validation prevents overselling
- Minimum stock threshold for low-stock alerts

### 3. Shopping Cart System

**How it works:**
- Cart state managed by React Context (`CartContext`)
- Cart items stored in localStorage per user
- Cart persists across page refreshes
- User-specific carts (separate for each logged-in user)

**Key Features:**
- Add/remove items
- Update quantities
- Stock validation
- Cart animation when adding items
- Empty cart state with "Browse Products" button

**Key Files:**
- `src/components/CartContext.jsx` - Cart state management
- `src/components/CartItem.jsx` - Individual cart item component
- `src/components/CartAnimation.jsx` - Add-to-cart animation

### 4. Order Management

**Order Creation (`/checkout-page`):**
1. User reviews cart items
2. Enters/selects delivery address (from account info or manual entry)
3. Customer snapshot is created with full address details
4. Order is created in `orders` table with status "processing"
5. Order items are created in `order_items` table
6. Product stock is decremented immediately
7. Cart is cleared
8. User is redirected to PayMongo payment link

**Order Status Flow:**
- `processing` - Initial status when order is created
- `accepted` - Admin accepts the order
- `shipped` - Order has been shipped
- `completed` - Order delivered successfully
- `cancelled` - Order cancelled (stock is restored)

**Admin Order Management (`/admin/order-management`):**
- View all active orders (processing, accepted, shipped)
- Update order status with confirmation dialogs
- View order details (items, customer snapshot, totals)
- Filter orders by status
- Real-time order updates

**Order History (`/admin/order-history`):**
- View completed and cancelled orders
- Delete orders (with stock restoration if not already cancelled)
- Archive view of past orders

**Customer Order History (`/account-page`):**
- Users can view their own order history
- Click orders to see detailed information
- Displays customer snapshot (delivery address) from order creation

### 5. Inquiry System

**Aquascape Inquiry Form:**
- Users submit custom aquascape requests
- Form validates account information completeness
- Redirects to account page if info is incomplete
- Supports up to 5 image uploads
- Creates inquiry in `inquiries` table with customer snapshot
- Status starts as "pending"

**Inquiry Status Flow:**
- `pending` - Initial status
- `accepted` - Admin accepts the inquiry
- `in_progress` - Work has started
- `completed` - Inquiry fulfilled
- `cancelled` - Inquiry cancelled

**Appointment Scheduling:**
- Admin can schedule appointments for inquiries
- Date/time picker in admin inquiry management
- Appointment details sent via realtime notifications
- Stored in `appointment_at` column

**Admin Inquiry Management (`/admin/inquiry-management`):**
- View all inquiries with status filtering
- Update inquiry status
- Schedule appointments
- View inquiry details including:
  - Customer account information (from snapshot)
  - Inquiry message (with images extracted and displayed)
  - Status history
- Real-time updates

**Customer Inquiry History (`/account-page`):**
- Users can view their own inquiries
- Click inquiries to see detailed information
- Images are displayed separately from text
- Status badges with color coding

### 6. Realtime Notification System

**How it works:**
- Uses Supabase Realtime subscriptions
- Two channels: `postgres_changes` and `broadcast`
- Notifications stored in localStorage for persistence
- Maximum 50 notifications per user
- No duplicate notifications

**Notification Types:**
1. **Inquiry Updates** - Status changes, appointment scheduling
2. **Order Updates** - Status changes (processing → accepted → shipped → completed)

**Notification Flow:**
1. Admin updates inquiry/order status via API
2. API broadcasts event to Supabase channel
3. Navigation bar listens to broadcast events
4. Notification added to user's notification bell
5. Notification persists in localStorage
6. User sees notification count badge

**Key Files:**
- `src/components/navigation-bar.jsx` - Notification listener and UI
- `src/app/api/inquiries/route.js` - Broadcasts inquiry updates
- `src/app/api/orders/route.js` - Broadcasts order updates

### 7. Sales Analytics

**Admin Dashboard (`/admin`):**
- Overview cards: Total Users, Total Orders, Total Products, Total Revenue
- Recent orders list
- Pending inquiries count
- Top products (placeholder)

**Sales Analytics Page (`/admin/sales-analytics`):**
- **Time Range Selection**: 7 days, 30 days, 90 days
- **Key Metrics**:
  - Total Revenue (excludes cancelled orders)
  - Total Orders
  - Average Order Value
  - Revenue Growth % (vs previous period)
  - Orders Growth % (vs previous period)
- **Charts**:
  - Revenue chart (last 12 months)
  - Sales chart (orders per month)
- **Status Breakdown**: Orders by status (Processing, Shipped, Delivered, Cancelled)
- **Top Products**: Top 5 products by revenue

**How Analytics Work:**
1. Fetches all orders from database
2. Filters by selected time range
3. Calculates current period metrics
4. Compares with previous period for growth
5. Groups orders by month for charts
6. Aggregates product sales from order items
7. Returns formatted data for display

**Key File:**
- `src/lib/queries.js` - `getSalesAnalytics()` function

### 8. User Account Management

**Account Page (`/account-page`):**
- Two tabs: Account Information and History

**Account Information:**
- Form to update personal details:
  - Full Name
  - Email Address
  - Phone Number
  - Address
  - City
  - Province
  - Postal Code
- Data stored in localStorage as `account-info`
- Used to auto-fill checkout and inquiry forms

**History:**
- **Recent Orders Tab**: Shows user's order history
- **Inquiry History Tab**: Shows user's aquascape inquiries
- Both display in card format with clickable modals for details

**Aquascape Inquiry Modal:**
- Opens when clicking "Aquascape Inquiry" in footer
- Modal overlay (not a separate page)
- Validates account info completeness
- Redirects to account page if incomplete

### 9. Database Schema

**Products Table:**
- `id` (UUID) - Primary key
- `name` (VARCHAR) - Product name
- `price` (DECIMAL) - Product price
- `image` (VARCHAR) - Image URL
- `category` (VARCHAR) - Product category
- `description` (TEXT) - Product description
- `stock` (INTEGER) - Current stock quantity
- `min_stock` (INTEGER) - Minimum stock threshold
- `status` (VARCHAR) - Stock status (calculated)
- `sku` (VARCHAR) - Product code (unique)
- `active` (BOOLEAN) - Show/hide from store
- `created_at` (TIMESTAMP) - Creation date

**Orders Table:**
- `id` (UUID) - Primary key
- `total` (DECIMAL) - Order total
- `status` (VARCHAR) - Order status
- `customer_email` (VARCHAR) - Customer email
- `customer_snapshot` (JSONB) - Full customer details at time of order
- `created_at` (TIMESTAMP) - Order date

**Order Items Table:**
- `id` (UUID) - Primary key
- `order_id` (UUID) - Foreign key to orders
- `product_id` (UUID) - Foreign key to products
- `quantity` (INTEGER) - Item quantity
- `price` (DECIMAL) - Item price at time of order

**Inquiries Table:**
- `id` (UUID) - Primary key
- `first_name` (VARCHAR) - Customer first name
- `last_name` (VARCHAR) - Customer last name
- `email` (VARCHAR) - Customer email
- `phone` (VARCHAR) - Customer phone
- `subject` (VARCHAR) - Inquiry subject
- `message` (TEXT) - Inquiry message (includes image URLs)
- `status` (VARCHAR) - Inquiry status
- `appointment_at` (TIMESTAMP) - Scheduled appointment date/time
- `customer_snapshot` (JSONB) - Full customer details at time of inquiry
- `created_at` (TIMESTAMP) - Inquiry date

### 10. API Routes

**Product Routes (`/api/products`):**
- `POST` - Create new product (with image upload)
- `PATCH` - Update existing product
- `DELETE` - Delete product

**Order Routes (`/api/orders`):**
- `PATCH` - Update order status (with stock restoration on cancel)
- `DELETE` - Delete order (with stock restoration)

**Inquiry Routes (`/api/inquiries`):**
- `POST` - Create new inquiry
- `PATCH` - Update inquiry status/appointment (with broadcast)
- `DELETE` - Delete inquiry

**Upload Route (`/api/upload`):**
- `POST` - Upload images to Supabase Storage
- Returns public URL for uploaded image

**User Count Route (`/api/users/count`):**
- `GET` - Fetch total user count from Clerk API

**PayMongo Route (`/api/paymongo/create-link`):**
- `POST` - Create payment link for checkout

### 11. Data Flow Examples

**Adding Product to Cart:**
1. User clicks "Add to Cart" on product page
2. `CartContext.addItem()` is called
3. Stock is validated
4. Item added to cart state
5. Cart saved to localStorage
6. Animation plays
7. Cart count updates in navigation bar

**Creating Order:**
1. User proceeds to checkout
2. Cart items validated for stock availability
3. Customer snapshot created from account info
4. Order created in database
5. Order items created
6. Stock decremented for each product
7. Cart cleared
8. PayMongo payment link generated
9. User redirected to payment

**Admin Updates Order Status:**
1. Admin selects new status in order management
2. Confirmation dialog appears
3. API call to `/api/orders` (PATCH)
4. Order status updated in database
5. If cancelled, stock restored
6. Broadcast event sent to Supabase
7. User receives notification in real-time
8. UI updates immediately

**Inquiry with Appointment:**
1. Admin schedules appointment in inquiry management
2. Date/time saved to `appointment_at` column
3. Status updated to "completed"
4. Broadcast event sent with appointment details
5. User receives notification: "Appointment Scheduled for [date] at [time]"
6. Notification persists in localStorage

### 12. Realtime Subscriptions

**Product Updates:**
- Admin inventory management subscribes to `products` table changes
- Real-time updates when products are added/edited/deleted
- No page refresh needed

**Inquiry Updates:**
- Navigation bar subscribes to `inquiries` table changes
- Filters by user email (or all for admin)
- Receives status updates and appointment scheduling

**Order Updates:**
- Navigation bar subscribes to `orders` table changes
- Filters by customer email
- Receives status change notifications

**Broadcast Events:**
- Used for cross-tab communication
- Inquiry updates broadcasted when status changes
- Order updates broadcasted when status changes
- Ensures all user tabs receive notifications

### 13. File Upload System

**Image Uploads:**
- Products: Upload via form or paste URL
- Aquascape Inquiries: Up to 5 images
- Images stored in Supabase Storage bucket `products`
- Public URLs returned for display
- Images extracted from inquiry messages and displayed separately

**Upload Process:**
1. File selected in form
2. FormData created with file
3. POST to `/api/upload`
4. File uploaded to Supabase Storage
5. Public URL returned
6. URL stored in database or inquiry message

### 14. Payment Integration

**PayMongo Integration:**
- Payment link created at checkout
- User redirected to PayMongo payment page
- Payment processed externally
- Order status updated after successful payment (via webhook, if configured)

### 15. UI/UX Features

**Responsive Design:**
- Mobile-first approach
- Tailwind CSS for styling
- Consistent spacing and layout utilities
- Dark theme throughout

**Animations:**
- Cart add animation (flying item)
- Toast notifications
- Loading states
- Smooth transitions

**Toast Notifications:**
- Success/error/warning messages
- Context-based toast provider
- Non-intrusive UI

**Modals:**
- Inquiry details modal (React Portal for overlay)
- Order details modal
- Product add/edit modals
- No blackout backgrounds (as per design)

### 16. Security & Protection

**Route Protection:**
- Middleware protects `/admin` routes
- Requires authentication
- Admin role check in components

**Data Validation:**
- Stock validation before orders
- Form validation on all inputs
- Email format validation
- Phone number validation

**Error Handling:**
- Try-catch blocks throughout
- User-friendly error messages
- Console logging for debugging
- Graceful fallbacks

## Environment Variables Required

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
PAYMONGO_SECRET_KEY=your_paymongo_secret_key
```

## Key Design Decisions

1. **Customer Snapshots**: Full customer details stored with orders/inquiries to preserve data at time of creation
2. **Stock Management**: Stock decremented at order creation, restored on cancellation
3. **Realtime Updates**: Supabase subscriptions for live data updates
4. **LocalStorage**: Used for cart persistence and account info (not for critical data)
5. **No Comments**: Codebase is comment-free for cleaner code
6. **Modal Overlays**: Inquiry form opens as modal, not separate page
7. **Image Extraction**: Images extracted from inquiry messages and displayed separately
8. **Notification Persistence**: Notifications saved to localStorage, don't clear on refresh

## Common Workflows

**Customer Shopping Flow:**
1. Browse store → View product → Add to cart → Checkout → Payment → Order confirmation

**Admin Product Management:**
1. View inventory → Add/Edit product → Upload image → Save → Real-time update

**Admin Order Processing:**
1. View orders → Update status → Stock restored if cancelled → Customer notified

**Inquiry Processing:**
1. Customer submits inquiry → Admin views → Updates status → Schedules appointment → Customer notified

## Future Enhancements (Potential)

- Email notifications
- Order tracking
- Product reviews
- Wishlist functionality
- Advanced search/filters
- Bulk operations
- Export reports
- Multi-language support

---

This document provides a comprehensive overview of how the IOS Aquatics project works. All features are fully functional and integrated with the Supabase database and Clerk authentication system.

