# Admin Panel

This admin panel provides comprehensive management tools for the Web iOS Aquatics store.

## Features

### 🏠 Dashboard
- Overview of key business metrics
- Recent orders and top products
- Quick action buttons
- Real-time statistics

### 📧 Inquiry Management
- View and manage customer inquiries
- Filter by status (pending, replied, resolved)
- Search functionality
- Priority management
- Response tracking

### 👥 Account Management
- Manage user accounts and roles
- Add/edit/delete users
- Role-based permissions (Admin, Manager, Staff)
- User status management
- Activity tracking

### 📦 Inventory Management
- Product catalog management
- Stock level monitoring
- Low stock alerts
- Category organization
- CRUD operations for products
- Price and description management

### 🛒 Order Management
- Order tracking and status updates
- Customer information management
- Order details and item tracking
- Status workflow (Processing → Shipped → Delivered)
- Revenue tracking

### 📊 Sales & Analytics
- Revenue and sales trends
- Performance metrics
- Top performing products
- Growth indicators
- Exportable reports
- Time-based filtering (7d, 30d, 90d)

## Access Control

- Protected by Clerk authentication
- Only authenticated users can access
- Role-based access can be implemented by modifying `AdminProtection.jsx`

## Navigation

The admin panel is accessible via:
- Direct URL: `/admin`
- Navigation bar "Admin" link (for authenticated users)

## File Structure

```
src/app/admin/
├── layout.jsx                 # Admin layout with sidebar and header
├── page.jsx                   # Dashboard page
├── inquiry-management/        # Inquiry management pages
├── account-management/        # Account management pages
├── inventory-management/      # Inventory management pages
├── order-management/          # Order management pages
└── sales-analytics/          # Sales analytics pages

src/components/admin/
├── AdminProtection.jsx       # Authentication protection
├── AdminSidebar.jsx          # Navigation sidebar
├── AdminHeader.jsx           # Top header bar
├── AdminDashboard.jsx        # Main dashboard component
├── InquiryManagement.jsx     # Inquiry management component
├── AccountManagement.jsx     # Account management component
├── InventoryManagement.jsx   # Inventory management component
├── OrderManagement.jsx       # Order management component
└── SalesAnalytics.jsx       # Sales analytics component
```

## Usage

1. Navigate to `/admin` while logged in
2. Use the sidebar to navigate between different management sections
3. Each section provides specific tools for managing that aspect of the business
4. All data is currently simulated - integrate with your backend API as needed

## Customization

- Modify components in `src/components/admin/` to customize functionality
- Update styling using Tailwind CSS classes
- Add new features by creating additional components and pages
- Integrate with your preferred backend API for data persistence
