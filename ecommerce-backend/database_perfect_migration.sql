-- ============================================================
-- COMPLETE DATABASE MIGRATION FOR E-COMMERCE SYSTEM
-- This script ensures all tables are properly configured
-- with seller support, proper constraints, and indexes
-- ============================================================

-- Use the correct database
USE ecommerce_db;

-- ============================================================
-- 1. USERS TABLE - Complete structure with seller support
-- ============================================================

-- Add missing columns to users table if they don't exist
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(255),
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'USER',
ADD COLUMN IF NOT EXISTS is_seller BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS shop_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS shop_description TEXT,
ADD COLUMN IF NOT EXISTS seller_since VARCHAR(255);

-- Ensure role column has proper values (migrate any null values)
UPDATE users SET role = 'USER' WHERE role IS NULL OR role = '';

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_is_seller ON users(is_seller);

-- ============================================================
-- 2. PRODUCTS TABLE - Complete structure with seller tracking
-- ============================================================

-- Add seller tracking fields to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS seller_id BIGINT,
ADD COLUMN IF NOT EXISTS seller_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS shop_name VARCHAR(255);

-- Add indexes for faster seller product queries
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);

-- Add foreign key constraint for seller_id (optional - enables referential integrity)
-- Uncomment the next line if you want strict foreign key enforcement
-- ALTER TABLE products ADD CONSTRAINT fk_products_seller FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE SET NULL;

-- ============================================================
-- 3. ORDERS TABLE - Complete structure with timestamps
-- ============================================================

-- Add timestamp columns if they don't exist
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- Ensure status has default value
ALTER TABLE orders MODIFY COLUMN status VARCHAR(255) DEFAULT 'Order Placed';

-- Add indexes for order queries
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- ============================================================
-- 4. ADDRESSES TABLE - Ensure proper structure
-- ============================================================

-- Add user_id index for faster address lookups
CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);

-- ============================================================
-- 5. DATA INTEGRITY & CLEANUP
-- ============================================================

-- Ensure all existing products without seller info are marked properly
UPDATE products SET seller_id = NULL WHERE seller_id = 0;
UPDATE products SET seller_name = NULL WHERE seller_name = '';
UPDATE products SET shop_name = NULL WHERE shop_name = '';

-- Ensure all orders have proper timestamps (backfill if needed)
UPDATE orders 
SET created_at = CURRENT_TIMESTAMP 
WHERE created_at IS NULL;

UPDATE orders 
SET updated_at = CURRENT_TIMESTAMP 
WHERE updated_at IS NULL;

-- ============================================================
-- 6. VERIFICATION QUERIES
-- ============================================================

-- Show users table structure
DESCRIBE users;

-- Show products table structure
DESCRIBE products;

-- Show orders table structure
DESCRIBE orders;

-- Show all indexes
SHOW INDEX FROM users;
SHOW INDEX FROM products;
SHOW INDEX FROM orders;

-- Count sellers
SELECT COUNT(*) as total_sellers FROM users WHERE is_seller = TRUE;

-- Count products by seller
SELECT 
    seller_id,
    seller_name,
    COUNT(*) as product_count 
FROM products 
WHERE seller_id IS NOT NULL 
GROUP BY seller_id, seller_name;

-- Show recent orders with counts
SELECT 
    status,
    COUNT(*) as order_count,
    SUM(amount) as total_amount
FROM orders 
GROUP BY status;

-- ============================================================
-- SCRIPT COMPLETED
-- ============================================================
SELECT '✅ Database migration completed successfully!' as status;
