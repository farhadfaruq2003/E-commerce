-- Add seller fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_seller BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS shop_name VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS shop_description TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS seller_since VARCHAR(255);

-- Add seller tracking fields to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_id BIGINT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS seller_name VARCHAR(255);
ALTER TABLE products ADD COLUMN IF NOT EXISTS shop_name VARCHAR(255);

-- Create index on seller_id for faster queries
CREATE INDEX IF NOT EXISTS idx_products_seller_id ON products(seller_id);
CREATE INDEX IF NOT EXISTS idx_users_is_seller ON users(is_seller);
