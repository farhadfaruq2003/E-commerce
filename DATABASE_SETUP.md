## 🗄️ DATABASE SETUP & CONNECTION VERIFICATION

### **Current Configuration**
- **Database**: MySQL 8.0+
- **Database Name**: `ecommerce_db`
- **Port**: 3306
- **Backend Port**: 8086
- **JPA Strategy**: `hibernate.ddl-auto=update` (auto-creates tables)

---

## ✅ STEP-BY-STEP SETUP

### **1. Create Database**
```sql
CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;
```

### **2. Configure Application Properties**
File: `ecommerce-backend/src/main/resources/application.properties`

**Update these values:**
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD  # Change this!

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect

server.port=8086
```

### **3. Run Database Migration (IMPORTANT!)**
Run this SQL file to ensure all columns and indexes exist:
```bash
mysql -u root -p ecommerce_db < ecommerce-backend/database_perfect_migration.sql
```

Or manually in MySQL Workbench:
- Open `ecommerce-backend/database_perfect_migration.sql`
- Execute the entire script

### **4. Create Admin User (Optional)**
```sql
-- Password is: admin123
INSERT INTO users (name, email, password, role, cart_items, is_seller) 
VALUES (
    'Admin User', 
    'admin@ecommerce.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'ADMIN',
    '{}',
    FALSE
);
```

---

## 📊 DATABASE SCHEMA

### **Tables Structure**

#### **1. users** (Complete with seller support)
```sql
- id: BIGINT (Primary Key, Auto Increment)
- name: VARCHAR(255)
- email: VARCHAR(255) UNIQUE
- password: VARCHAR(255) (BCrypt encrypted)
- phone: VARCHAR(255)
- image: TEXT
- cart_items: TEXT (JSON string)
- role: VARCHAR(50) DEFAULT 'USER' (USER/SELLER/ADMIN)
- is_seller: BOOLEAN DEFAULT FALSE
- shop_name: VARCHAR(255)
- shop_description: TEXT
- seller_since: VARCHAR(255)
```

#### **2. products** (With seller tracking)
```sql
- id: BIGINT (Primary Key, Auto Increment)
- name: VARCHAR(255)
- description: TEXT (JSON array of strings)
- price: FLOAT
- offer_price: FLOAT
- image: TEXT (JSON array of image URLs)
- category: VARCHAR(255)
- in_stock: BOOLEAN DEFAULT TRUE
- seller_id: BIGINT (Foreign Key to users.id)
- seller_name: VARCHAR(255)
- shop_name: VARCHAR(255)
```

#### **3. orders**
```sql
- id: BIGINT (Primary Key, Auto Increment)
- user_id: VARCHAR(255)
- items: TEXT (JSON array of order items)
- amount: FLOAT
- address: VARCHAR(255)
- status: VARCHAR(255) DEFAULT 'Order Placed'
- payment_type: VARCHAR(255) (COD/ONLINE)
- is_paid: BOOLEAN DEFAULT FALSE
- created_at: DATETIME DEFAULT CURRENT_TIMESTAMP
- updated_at: DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
```

#### **4. addresses**
```sql
- id: BIGINT (Primary Key, Auto Increment)
- user_id: VARCHAR(255)
- first_name: VARCHAR(255)
- last_name: VARCHAR(255)
- email: VARCHAR(255)
- phone: VARCHAR(255)
- street: VARCHAR(255)
- city: VARCHAR(255)
- state: VARCHAR(255)
- zip_code: INTEGER
- country: VARCHAR(255)
```

---

## 🔗 ENTITY RELATIONSHIPS

```
User (1) ──────< (N) Product [seller_id]
  │
  │
  └──────< (N) Order [user_id]
  │
  │
  └──────< (N) Address [user_id]
```

---

## 🔍 DATABASE INDEXES (For Performance)

```sql
-- Users
- idx_users_email ON users(email)
- idx_users_role ON users(role)
- idx_users_is_seller ON users(is_seller)

-- Products
- idx_products_seller_id ON products(seller_id)
- idx_products_category ON products(category)
- idx_products_in_stock ON products(in_stock)

-- Orders
- idx_orders_user_id ON orders(user_id)
- idx_orders_status ON orders(status)
- idx_orders_created_at ON orders(created_at)

-- Addresses
- idx_addresses_user_id ON addresses(user_id)
```

---

## ✅ VERIFICATION COMMANDS

### **Check if database exists:**
```sql
SHOW DATABASES LIKE 'ecommerce_db';
```

### **Check all tables:**
```sql
USE ecommerce_db;
SHOW TABLES;
```

### **Check table structures:**
```sql
DESCRIBE users;
DESCRIBE products;
DESCRIBE orders;
DESCRIBE addresses;
```

### **Check indexes:**
```sql
SHOW INDEX FROM users;
SHOW INDEX FROM products;
SHOW INDEX FROM orders;
```

### **Count data:**
```sql
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Products', COUNT(*) FROM products
UNION ALL
SELECT 'Orders', COUNT(*) FROM orders
UNION ALL
SELECT 'Sellers', COUNT(*) FROM users WHERE is_seller = TRUE;
```

---

## 🔧 COMMON ISSUES & SOLUTIONS

### **Issue 1: Connection Refused**
```
Error: Communications link failure
```
**Solution:**
1. Check MySQL is running: `sudo systemctl status mysql` (Linux) or check Services (Windows)
2. Verify port 3306 is open
3. Check username/password in application.properties

### **Issue 2: Access Denied**
```
Error: Access denied for user 'root'@'localhost'
```
**Solution:**
```sql
-- Grant all privileges
GRANT ALL PRIVILEGES ON ecommerce_db.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### **Issue 3: Table doesn't exist**
```
Error: Table 'ecommerce_db.users' doesn't exist
```
**Solution:**
1. Run the migration script: `database_perfect_migration.sql`
2. Or restart the backend (it will auto-create tables)

### **Issue 4: Column missing (seller_id, etc.)**
```
Error: Unknown column 'seller_id' in field list
```
**Solution:**
Run the migration script:
```bash
mysql -u root -p ecommerce_db < ecommerce-backend/database_perfect_migration.sql
```

---

## 🚀 STARTUP CHECKLIST

- [ ] MySQL server is running
- [ ] Database `ecommerce_db` exists
- [ ] Application.properties has correct credentials
- [ ] Migration script executed successfully
- [ ] Backend starts without errors (`mvn spring-boot:run`)
- [ ] Tables auto-created/updated
- [ ] Frontend connects successfully

---

## 📝 TESTING DATABASE CONNECTION

### **From Backend:**
1. Start backend: `.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run`
2. Look for: `HikariPool-1 - Start completed`
3. Check logs: Should show SQL queries if `show-sql=true`

### **From MySQL:**
```sql
-- Test connection
SELECT 1;

-- Check user permissions
SHOW GRANTS FOR CURRENT_USER;

-- Verify tables exist
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_SCHEMA = 'ecommerce_db';
```

---

## 🎯 REPOSITORY METHODS AVAILABLE

### **ProductRepository**
- `findAll()` - Get all products
- `findById(Long id)` - Get product by ID
- `findBySellerId(Long sellerId)` - Get products by seller
- `save(Product)` - Save/update product
- `deleteById(Long id)` - Delete product

### **OrderRepository**
- `findAll()` - Get all orders
- `findById(Long id)` - Get order by ID
- `findByUserId(String userId)` - Get user's orders
- `save(Order)` - Save/update order
- `deleteById(Long id)` - Delete order

### **UserRepository**
- `findAll()` - Get all users
- `findById(Long id)` - Get user by ID
- `findByEmail(String email)` - Get user by email
- `findByIsSeller(Boolean)` - Get all sellers
- `save(User)` - Save/update user

---

## ✅ ALL SYSTEMS READY!

Your database is now perfectly configured with:
- ✅ All required tables
- ✅ Seller support columns
- ✅ Proper indexes for performance
- ✅ Foreign key ready structure
- ✅ Timestamp tracking
- ✅ Role-based access fields

**Ready to run!** 🚀
