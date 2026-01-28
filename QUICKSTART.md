# 🚀 Quick Start Guide - Running the E-Commerce Application

Follow these simple steps to get the application running on your computer.

---

## ⚡ Prerequisites Check

Make sure you have these installed:

- ✅ **Java 21** - Run: `java -version`
- ✅ **Node.js** - Run: `node -v`
- ✅ **MySQL** - Run: `mysql --version`

If any are missing, install them first (see main README.md).

---

## 📝 Step-by-Step Instructions

### Step 1: Setup MySQL Database (One-time setup)

1. **Start MySQL service** (if not running)
   - Windows: Services → MySQL80 → Start
   - Mac: `mysql.server start`
   - Linux: `sudo service mysql start`

2. **Open MySQL Command Line** and login:
   ```bash
   mysql -u root -p
   ```
   (Enter your MySQL password)

3. **Create the database:**
   ```sql
   CREATE DATABASE ecommerce_db;
   EXIT;
   ```

4. **Configure backend** - Edit this file:
   ```
   ecommerce-backend/src/main/resources/application.properties
   ```
   
   Update line 3 with YOUR MySQL password:
   ```properties
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

---

### Step 2: Start Backend Server

**Open Terminal 1:**

```bash
# Navigate to backend folder
cd ecommerce-backend

# Run the server (Windows)
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run

# Run the server (Mac/Linux)
./apache-maven-3.9.6/bin/mvn spring-boot:run
```

⏳ **Wait for this message:**
```
Started EcommerceApplication in X.XXX seconds
```

✅ **Backend running on:** http://localhost:8086

---

### Step 3: Start Frontend Server

**Open Terminal 2** (keep Terminal 1 running!):

```bash
# Navigate to frontend folder
cd client

# Install dependencies (first time only)
npm install

# Start the frontend
npm run dev
```

✅ **Frontend running on:** http://localhost:5173

---

## 🎉 Access the Application

Open your browser and go to:

### 🛍️ Customer Website
**URL:** http://localhost:5173

- Click "Login" to create an account
- Browse products, add to cart, place orders

---

### 👑 Admin Dashboard
**URL:** http://localhost:5173/admin

**Login with:**
- Email: `admin@ecommerce.com`
- Password: `admin123`

**Admin can:**
- View dashboard analytics
- Add/Edit/Delete products
- Manage all orders
- View all users

---

### 🏪 Seller Panel
**URL:** http://localhost:5173/seller

**Login with:**
- Email: `seller@gmail.com`
- Password: `password`

**Seller can:**
- Add products
- View product list
- Manage orders

---

## 🛑 How to Stop the Servers

**Stop Backend:**
- Go to Terminal 1
- Press `Ctrl + C`

**Stop Frontend:**
- Go to Terminal 2
- Press `Ctrl + C`

---

## 🔄 Restarting the Application

### If Backend Server Crashes

```bash
# Windows - Kill existing Java processes
taskkill /F /IM java.exe

# Then restart
cd ecommerce-backend
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

### If Frontend Server Crashes

```bash
cd client
npm run dev
```

---

## ⚠️ Common Problems

### Problem 1: "Port 8086 already in use"

**Solution:**
```bash
# Windows
taskkill /F /IM java.exe

# Mac/Linux
killall java

# Then restart backend
```

---

### Problem 2: "Cannot connect to MySQL"

**Check:**
1. ✅ MySQL service is running
2. ✅ Database `ecommerce_db` exists
3. ✅ Password in `application.properties` is correct

**Verify database exists:**
```bash
mysql -u root -p
SHOW DATABASES;
# You should see 'ecommerce_db' in the list
```

---

### Problem 3: Frontend shows "Failed to fetch"

**Check:**
1. ✅ Backend is running (Terminal 1 should show "Started EcommerceApplication")
2. ✅ Visit http://localhost:8086 - should show error page (this is normal)
3. ✅ Restart frontend if needed

---

### Problem 4: "npm command not found"

**Solution:**
- Install Node.js from https://nodejs.org/
- Restart your terminal
- Try again

---

## 📋 Quick Commands Reference

### Backend Commands
```bash
# Navigate to backend
cd ecommerce-backend

# Clean build (if errors occur)
.\apache-maven-3.9.6\bin\mvn.cmd clean compile

# Run server
.\apache-maven-3.9.6\bin\mvn.cmd spring-boot:run
```

### Frontend Commands
```bash
# Navigate to frontend
cd client

# Install dependencies (first time)
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

### Database Commands
```bash
# Login to MySQL
mysql -u root -p

# Show databases
SHOW DATABASES;

# Use the database
USE ecommerce_db;

# Show tables
SHOW TABLES;

# Check users table
SELECT * FROM users;
```

---

## 🎯 What to Do First

1. **Login as Admin**
   - Go to: http://localhost:5173/admin
   - Email: `admin@ecommerce.com`
   - Password: `admin123`
   - Explore the dashboard!

2. **Add Some Products** (Admin Panel)
   - Click "Products" in sidebar
   - Click "Add Product" button
   - Fill in product details

3. **Test as Customer**
   - Go to: http://localhost:5173
   - Register a new account
   - Browse products
   - Add to cart
   - Place an order

4. **View Order in Admin**
   - Go back to admin panel
   - Click "Orders"
   - See the order you just placed
   - Update order status

---

## 💡 Tips

- **Keep both terminals open** while using the app
- **Backend Terminal** shows API requests and database queries
- **Frontend Terminal** shows build warnings (can ignore most)
- **Refresh browser** if something doesn't load
- **Check terminals** for error messages if something breaks

---

## ✅ Success Checklist

- [ ] MySQL is running
- [ ] Database `ecommerce_db` exists
- [ ] Backend shows "Started EcommerceApplication"
- [ ] Frontend shows "Local: http://localhost:5173"
- [ ] Can open http://localhost:5173 in browser
- [ ] Can login to admin panel
- [ ] Can browse products

---

## 🆘 Still Need Help?

1. **Check both terminal outputs** for error messages
2. **Read the error message carefully** - it usually tells you what's wrong
3. **Restart everything:**
   ```bash
   # Stop both servers (Ctrl+C in both terminals)
   # Kill any remaining processes
   taskkill /F /IM java.exe
   # Start backend again
   # Start frontend again
   ```

---

## 🎊 You're All Set!

Your e-commerce application is now running. Start exploring and testing all the features!

**Need more details?** Check the full [README.md](README.md) file.
