# Admin Feature Setup Guide

## Overview
Successfully added Admin Dashboard to your E-commerce system **without breaking existing functionality**. All your existing USER and SELLER features continue to work as before.

## What Was Added

### Backend Changes (Spring Boot)
1. **User Entity** - Added `role` field (USER, SELLER, ADMIN)
2. **AdminController** - New controller with admin-specific endpoints:
   - `/api/admin/products` - Get all products
   - `/api/admin/product/add` - Add new product
   - `/api/admin/product/edit/{id}` - Edit product
   - `/api/admin/product/delete/{id}` - Delete product
   - `/api/admin/orders` - Get all orders
   - `/api/admin/order/status/{id}` - Update order status
   - `/api/admin/stats` - Dashboard statistics
3. **SecurityConfig** - Added ADMIN role protection for `/api/admin/**` endpoints
4. **UserController** - Updated login to use user's role from database

### Frontend Changes (React)
1. **AdminLayout** - Admin dashboard layout with sidebar navigation
2. **AdminDashboard** - Overview page with stats (products, orders, users, revenue)
3. **ProductManagement** - Full CRUD for products (Add, Edit, Delete)
4. **OrderManagement** - View all orders and update status
5. **Protected Routes** - Admin routes only accessible if `user.role === 'ADMIN'`

## Setup Instructions

### Step 1: Create an Admin User

**Option A: Update an existing user**
```sql
-- Run in MySQL
UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

**Option B: Create a new admin user**
```sql
-- Run in MySQL
-- Password will be: admin123
INSERT INTO users (name, email, password, role, cart_items) 
VALUES (
    'Admin User', 
    'admin@ecommerce.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    '{}'
);
```

The SQL file is already created at: `ecommerce-backend/create_admin.sql`

### Step 2: Login and Access Admin Dashboard

1. Go to http://localhost:5173
2. Login with your admin credentials
3. Navigate to http://localhost:5173/admin

## Admin Features

### Dashboard
- Total products count
- Total orders count
- Total users count
- Total revenue
- Pending orders count

### Product Management
- ✅ View all products in a table
- ✅ Add new products with form
- ✅ Edit existing products
- ✅ Delete products
- ✅ Manage stock status

### Order Management
- ✅ View all orders from all users
- ✅ See customer details (name, email)
- ✅ Update order status (Order Placed → Processing → Shipped → Out for Delivery → Delivered → Cancelled)
- ✅ Orders automatically marked as paid when delivered
- ✅ Filter by status with color coding

## API Endpoints

All admin endpoints require:
- Valid JWT token
- User role must be "ADMIN"

```
GET    /api/admin/products       - Get all products
POST   /api/admin/product/add    - Add product
PUT    /api/admin/product/edit/:id - Edit product
DELETE /api/admin/product/delete/:id - Delete product
GET    /api/admin/orders         - Get all orders
PUT    /api/admin/order/status/:id - Update order status
GET    /api/admin/stats          - Dashboard stats
```

## Security

- ✅ Role-based access control (Spring Security)
- ✅ JWT authentication required
- ✅ Only users with `role = 'ADMIN'` can access admin routes
- ✅ Frontend route protection (redirects non-admins to home)
- ✅ Backend endpoint protection (returns 403 for non-admins)

## Bug Fixes Applied

- ✅ All numeric IDs use `.toString()` before `.slice()` operations
- ✅ Axios configured with credentials support
- ✅ CORS properly configured for admin endpoints
- ✅ Order status updates properly reflected in database

## Testing the Admin Panel

1. **Create admin user** using SQL above
2. **Login** with admin credentials
3. **Navigate** to /admin
4. **Test Product CRUD**:
   - Add a new product
   - Edit an existing product
   - Delete a product
5. **Test Order Management**:
   - View all orders
   - Update order status
   - Verify status changes persist

## Existing Features - Still Working ✅

- ✅ User registration and login
- ✅ Product browsing and filtering
- ✅ Shopping cart
- ✅ Order placement
- ✅ User profile management
- ✅ Seller dashboard
- ✅ All existing routes and components

## No Breaking Changes

- All existing USER and SELLER functionality preserved
- Database automatically adds `role` column without data loss
- Existing users get default role = 'USER'
- No changes to existing API contracts
- Frontend routing unaffected for existing pages

## Server Status

✅ Backend running on: http://localhost:8086
✅ Frontend running on: http://localhost:5173
✅ MySQL connected successfully
✅ Role column added to users table
✅ Admin endpoints registered
✅ JWT filter properly configured

## Next Steps

1. Create your admin user using the SQL script
2. Login with admin credentials
3. Access admin dashboard at /admin
4. Start managing products and orders!

## Support

If you encounter any issues:
1. Verify MySQL is running
2. Check that role column was added to users table
3. Confirm user has role = 'ADMIN'
4. Check browser console for any errors
5. Verify JWT token includes correct role claim
