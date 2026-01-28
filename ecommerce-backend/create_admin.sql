-- SQL Script to create an Admin user
-- Run this in your MySQL database after the backend has started and created the tables

-- Option 1: Update an existing user to be an admin
-- Replace 'user@example.com' with the email of the user you want to make admin
UPDATE users SET role = 'ADMIN' WHERE email = 'user@example.com';

-- Option 2: Create a new admin user (password: admin123)
-- Password is BCrypt encrypted version of 'admin123'
INSERT INTO users (name, email, password, role, cart_items) 
VALUES (
    'Admin User', 
    'admin@ecommerce.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    '{}'
);

-- Verify the admin user was created/updated
SELECT id, name, email, role FROM users WHERE role = 'ADMIN';
