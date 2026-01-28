-- Fix existing seller roles
-- This script updates all users who are marked as sellers (is_seller = 1)
-- but don't have the SELLER role set properly

USE ecommerce_db;

-- Update existing sellers to have SELLER role
UPDATE users 
SET role = 'SELLER' 
WHERE is_seller = 1 AND (role IS NULL OR role = 'USER');

-- Verify the update
SELECT id, name, email, role, is_seller, shop_name 
FROM users 
WHERE is_seller = 1;
