# Bug Fix Summary - Seller Authentication Issues

## Date: January 27, 2026

## Problems Identified

### 1. 403 Forbidden Errors on Seller Endpoints
- **Endpoints affected:**
  - `/api/product/seller-products`
  - `/api/product/add-product`
  - `/api/product/stock`

### 2. Token Expiration Messages
- Frontend was receiving "Token expired or invalid" messages
- Tokens were being cleared from localStorage

### 3. Image Loading Issues
- External image URLs returning 403 errors (unrelated to backend)

## Root Cause

The main issue was **incorrect role assignment** for sellers:

1. When users became sellers through `/api/user/become-seller`, only the `isSeller` flag was set to `true`
2. The `role` field remained as `"USER"` instead of being updated to `"SELLER"`
3. SecurityConfig requires `hasRole("SELLER")` for seller endpoints
4. JWT tokens were generated with `"USER"` role even for sellers
5. This caused 403 Forbidden errors on all seller-protected endpoints

## Changes Made

### 1. UserController.java
**File:** `ecommerce-backend/src/main/java/com/ecommerce/controller/UserController.java`

**Change:** Added `user.setRole("SELLER")` in the `becomeSeller()` method

```java
// Before:
user.setIsSeller(true);
user.setShopName(body.get("shopName"));

// After:
user.setIsSeller(true);
user.setRole("SELLER"); // Set role to SELLER for proper authorization
user.setShopName(body.get("shopName"));
```

### 2. SellerController.java
**File:** `ecommerce-backend/src/main/java/com/ecommerce/controller/SellerController.java`

**Change:** Added auto-fix logic and proper role verification

```java
// Added verification and auto-fix
if (!user.getIsSeller()) {
    return error response;
}

// Verify and auto-fix role
if (!"SELLER".equals(user.getRole()) && !"ADMIN".equals(user.getRole())) {
    user.setRole("SELLER");
    userRepository.save(user);
}

// Generate token with correct role
String token = jwtService.generateToken(email, user.getRole());
```

### 3. Database Migration
**File:** `ecommerce-backend/fix_seller_roles.sql`

Updated existing seller users in the database to have the correct role:
```sql
UPDATE users 
SET role = 'SELLER' 
WHERE is_seller = 1 AND (role IS NULL OR role = 'USER');
```

**Users Fixed:**
- ID 1: heyha@gmail.com (NULL → SELLER)
- ID 11: fa@mail.com (USER → SELLER)

## How the Fix Works

### Flow Before Fix:
1. User becomes seller → `isSeller=true`, `role=USER`
2. Seller logs in → JWT token with `role=USER`
3. Seller accesses `/api/product/seller-products` → 403 Forbidden (requires SELLER role)

### Flow After Fix:
1. User becomes seller → `isSeller=true`, `role=SELLER`
2. Seller logs in → JWT token with `role=SELLER`
3. Seller accesses `/api/product/seller-products` → 200 OK ✓

### Auto-Fix on Login:
If a seller somehow still has the wrong role:
1. Login checks if user is seller but role is not SELLER
2. Automatically updates role to SELLER
3. Generates token with correct role
4. User can access seller endpoints

## Testing Required

Please test the following:

1. **Existing Sellers:**
   - [ ] Login with existing seller accounts
   - [ ] Access seller dashboard
   - [ ] View seller products
   - [ ] Add new products

2. **New Sellers:**
   - [ ] Register as new user
   - [ ] Become a seller
   - [ ] Login to seller portal
   - [ ] Verify all seller features work

3. **Verify No Token Expiration:**
   - [ ] No more "Token expired or invalid" messages
   - [ ] No more 403 errors on seller endpoints

## Next Steps

1. Restart the backend server:
   ```bash
   cd ecommerce-backend
   ./apache-maven-3.9.6/bin/mvn spring-boot:run
   ```

2. Clear browser localStorage and login again

3. Test all seller functionalities

## Files Modified

1. `ecommerce-backend/src/main/java/com/ecommerce/controller/UserController.java`
2. `ecommerce-backend/src/main/java/com/ecommerce/controller/SellerController.java`
3. `ecommerce-backend/fix_seller_roles.sql` (new)

## Database Status

✅ MySQL is running properly on localhost:3306
✅ Database `ecommerce_db` exists and is accessible
✅ All existing sellers have been updated with correct roles

## External Image Issue (Not Fixed)

The 403 errors for Wikipedia images:
```
:8086/images/https://upload.wikimedia.org/wikipedia/commons/...
```

This is a separate issue related to how external image URLs are being proxied. These images should be:
- Either downloaded and stored locally
- Or accessed directly from the frontend without proxying through backend
- Or use a proper image proxy service

This is not related to the authentication issues and should be addressed separately.
