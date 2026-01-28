# E-Commerce Application - Setup Guide

A full-stack e-commerce application built with **React** (frontend) and **Spring Boot** (backend) with **MySQL** database.

## 📋 Prerequisites

Before running this project, ensure you have the following installed:

1. **Java JDK 21** or higher
   - Download from: https://www.oracle.com/java/technologies/downloads/
   - Verify: `java -version`

2. **Node.js 18+** and npm
   - Download from: https://nodejs.org/
   - Verify: `node -v` and `npm -v`

3. **MySQL 8.0+**
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Verify: `mysql --version`

4. **Maven 3.9+** (Included in project at `ecommerce-backend/apache-maven-3.9.6/`)

---

## 🗄️ Database Setup

### Step 1: Create MySQL Database

1. Open MySQL Command Line or MySQL Workbench
2. Login with your credentials
3. Create the database:

```sql
CREATE DATABASE ecommerce_db;
```

### Step 2: Configure Database Connection

Navigate to `ecommerce-backend/src/main/resources/application.properties` and update:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/ecommerce_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password

server.port=8086
```

**Important:** Replace `your_mysql_password` with your actual MySQL password.

---

## 🚀 Backend Setup (Spring Boot)

### Step 1: Navigate to Backend Directory

```bash
cd ecommerce-backend
```

### Step 2: Clean and Build

```bash
./apache-maven-3.9.6/bin/mvn clean compile
```

**For Windows Command Prompt:**
```cmd
.\apache-maven-3.9.6\bin\mvn.cmd clean compile
```

### Step 3: Run Backend Server

```bash
./apache-maven-3.9.6/bin/mvn spring-boot:run
```

**For Windows:**
```cmd
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

✅ Backend will start on: **http://localhost:8086**

**Auto-Created Admin User:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

---

## 🎨 Frontend Setup (React + Vite)

### Step 1: Navigate to Client Directory

```bash
cd client
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `client` directory:

```env
VITE_BACKEND_URL=http://localhost:8086
```

### Step 4: Run Frontend Server

```bash
npm run dev
```

✅ Frontend will start on: **http://localhost:5173**

---

## 👥 User Roles & Access

### 1. **Admin Panel**
- **URL:** http://localhost:5173/admin
- **Credentials:**
  - Email: `admin@ecommerce.com`
  - Password: `admin123`
- **Features:**
  - Dashboard with analytics
  - Manage all products (Add/Edit/Delete)
  - Manage all orders (View/Update status)
  - View user list with order counts

### 2. **Seller Panel**
- **URL:** http://localhost:5173/seller
- **Login:** Use seller login page
- **Default Seller:**
  - Email: `seller@gmail.com`
  - Password: `password`
- **Features:**
  - Add products
  - View product list
  - Manage seller orders

### 3. **Regular User/Buyer**
- **URL:** http://localhost:5173
- **Registration:** Click "Login" → "Create an account"
- **Features:**
  - Browse products
  - Add to cart
  - Place orders (Cash on Delivery)
  - Track orders
  - Cancel order items
  - Manage profile & addresses

---

## 📁 Project Structure

```
Project/
├── ecommerce-backend/          # Spring Boot Backend
│   ├── src/main/java/
│   │   └── com/ecommerce/
│   │       ├── config/         # Security, CORS config
│   │       ├── controller/     # REST API endpoints
│   │       ├── entity/         # JPA entities
│   │       ├── repository/     # Data repositories
│   │       ├── security/       # JWT filter
│   │       └── service/        # Business logic
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml                 # Maven dependencies
│
└── client/                     # React Frontend
    ├── src/
    │   ├── components/         # Reusable components
    │   ├── pages/              # Page components
    │   │   ├── admin/          # Admin panel pages
    │   │   └── seller/         # Seller panel pages
    │   ├── context/            # React Context (State)
    │   ├── modals/             # Modal components
    │   └── assets/             # Images, icons
    ├── package.json
    └── vite.config.js
```

---

## 🔌 API Endpoints

### Public Endpoints
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `POST /api/seller/login` - Seller login
- `GET /api/product/list` - Get all products
- `GET /api/product/id/{id}` - Get product by ID

### User Endpoints (Requires Login)
- `GET /api/user/is-auth` - Check authentication
- `POST /api/user/update-profile` - Update profile
- `POST /api/cart/update` - Update cart
- `POST /api/order/cod` - Place COD order
- `GET /api/order/user` - Get user orders
- `DELETE /api/order/delete/{orderId}/item/{itemIndex}` - Cancel order item
- `POST /api/address/add` - Add address
- `GET /api/address/get` - Get addresses

### Admin Endpoints (Admin Only)
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/products` - Get all products
- `POST /api/admin/product/add` - Add product
- `PUT /api/admin/product/edit/{id}` - Update product
- `DELETE /api/admin/product/delete/{id}` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/order/status/{id}` - Update order status
- `GET /api/admin/users` - Get all users

### Seller Endpoints
- `POST /api/product/add-product` - Add product
- `GET /api/order/seller` - Get seller orders

---

## 🛠️ Common Issues & Solutions

### Issue 1: Port Already in Use

**Backend (8086):**
```bash
# Windows
taskkill /F /IM java.exe

# Linux/Mac
killall java
```

**Frontend (5173):**
```bash
# The dev server will automatically try port 5174 if 5173 is busy
```

### Issue 2: MySQL Connection Failed

- Check if MySQL service is running
- Verify database name: `ecommerce_db` exists
- Check username and password in `application.properties`
- Ensure MySQL is running on port `3306`

### Issue 3: CORS Errors

- Ensure backend is running on `http://localhost:8086`
- Check `VITE_BACKEND_URL` in frontend `.env` file
- Verify CORS configuration in `SecurityConfig.java`

### Issue 4: "Found 0 JPA repository interfaces"

**Solution:**
```bash
cd ecommerce-backend
rm -rf target
./apache-maven-3.9.6/bin/mvn.cmd clean compile spring-boot:run
```

---

## 💡 Features

### Customer Features
- ✅ Product browsing with categories
- ✅ Search functionality
- ✅ Shopping cart
- ✅ Cash on Delivery (COD) payment
- ✅ Order tracking
- ✅ Cancel individual order items
- ✅ Profile & address management
- ✅ Order history

### Admin Features
- ✅ Dashboard with analytics (total products, orders, revenue, users)
- ✅ Product management (CRUD operations)
- ✅ Order management (view all orders, update status)
- ✅ User list with order counts
- ✅ Automatic admin user creation

### Seller Features
- ✅ Product listing
- ✅ Add new products
- ✅ View seller orders

### Technical Features
- ✅ JWT authentication
- ✅ Role-based access control (USER, SELLER, ADMIN)
- ✅ Responsive design (mobile-friendly)
- ✅ Real-time cart updates
- ✅ MySQL database with JPA/Hibernate
- ✅ RESTful API architecture
- ✅ Password encryption (BCrypt)

---

## 🎯 Quick Start Commands

### Terminal 1 - Backend
```bash
cd ecommerce-backend
./apache-maven-3.9.6/bin/mvn.cmd spring-boot:run
```

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```

### Access the Application
- **Customer Site:** http://localhost:5173
- **Admin Panel:** http://localhost:5173/admin
- **Seller Panel:** http://localhost:5173/seller
- **Backend API:** http://localhost:8086

---

## 📞 Support

For issues or questions:
1. Check the console logs (backend and frontend)
2. Verify all services are running
3. Ensure database is accessible
4. Check the Common Issues section above

---

## 🔐 Default Credentials

### Admin
- Email: `admin@ecommerce.com`
- Password: `admin123`

### Seller
- Email: `seller@gmail.com`
- Password: `password`

### Regular User
- Register through the application

---

## 💰 Currency

All prices are displayed in **Bangladeshi Taka (৳)**.

---

## 📝 Notes

1. **Auto-initialization:** 
   - Admin user is created automatically on first startup
   - Sample products are seeded if database is empty

2. **Database Schema:** 
   - Tables are auto-created by Hibernate
   - Schema updates happen automatically on restart

3. **Security:**
   - All passwords are encrypted using BCrypt
   - JWT tokens expire after 24 hours
   - Protected routes require authentication

4. **Order Cancellation:**
   - Users can cancel individual items from orders
   - Cannot cancel delivered or already cancelled orders
   - Order is auto-deleted if all items are cancelled

---

