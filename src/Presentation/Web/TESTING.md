# Manual Testing Guide

## 🚀 Prerequisites

1. **Backend API Running**
   ```bash
   cd src/Presentation/API
   dotnet run
   ```
   API should be running on `http://localhost:5000`

2. **Frontend Dev Server Running**
   ```bash
   cd src/Presentation/Web
   npm run dev
   ```
   App should be running on `http://localhost:5173`

---

## ✅ Test Scenarios

### 1. **Product Browsing** 🛍️

#### Home Page
- [ ] Navigate to `http://localhost:5173`
- [ ] Verify products load and display
- [ ] Check product images render correctly
- [ ] Verify product titles and prices show

#### Category Filtering
- [ ] Click "Categories" in navigation
- [ ] Click on a category (e.g., "Electronics")
- [ ] Verify products filter correctly
- [ ] Click "All Products" - verify all products show again

#### Product Details
- [ ] Click on any product card
- [ ] Verify product detail page loads
- [ ] Check all product information displays:
  - Title
  - Price
  - Description
  - Category  
  - Rating
  - Image

---

### 2. **Shopping Cart** 🛒

#### Add to Cart
- [ ] From home page, click "Add to Cart" on a product
- [ ] Verify toast notification appears
- [ ] Check cart icon badge updates with item count

#### View Cart
- [ ] Click cart icon or "Cart" in navigation
- [ ] Verify cart page shows added items
- [ ] Check item details display correctly:
  - Image
  - Title
  - Price
  - Quantity

#### Update Quantity
- [ ] Click `+` button to increase quantity
- [ ] Verify quantity updates
- [ ] Verify total price recalculates
- [ ] Click `-` button to decrease quantity
- [ ] Verify it works correctly

#### Remove from Cart
- [ ] Decrease quantity to 1
- [ ] Click `-` button again
- [ ] Verify item removed from cart
- [ ] Alternatively, test "Remove" button if available

#### Empty Cart
- [ ] Remove all items from cart
- [ ] Verify empty cart message displays
- [ ] Check "Start Shopping" button works

---

### 3. **Authentication** 🔐

#### Register New User
- [ ] Click "Sign Up" in header
- [ ] Fill in registration form:
  - Email: `test@example.com`
  - Password: `Test123!`
  - Confirm Password: `Test123!`
- [ ] Click "Create Account"
- [ ] Verify redirect to home page
- [ ] Check user email appears in header

#### Logout
- [ ] Click user dropdown in header
- [ ] Click "Logout"
- [ ] Verify redirect to home
- [ ] Check "Sign In" button reappears

#### Login
- [ ] Click "Sign In"  
- [ ] Enter credentials:
  - Email: `test@example.com`
  - Password: `Test123!`
- [ ] Click "Sign In"
- [ ] Verify successful login
- [ ] Check user email in header

---

### 4. **Internationalization** 🌍

#### Language Switching
- [ ] Click language dropdown (globe icon)
- [ ] Select "Türkçe" (Turkish)
- [ ] Verify UI text changes to Turkish
- [ ] Navigate between pages - verify translations persist
- [ ] Switch back to "English"
- [ ] Verify UI text changes back

---

### 5. **Theme Toggle** 🌓

#### Dark Mode
- [ ] Click theme toggle button (moon/sun icon)
- [ ] Verify theme changes to dark mode
- [ ] Navigate between pages - verify dark mode persists
- [ ] Toggle back to light mode
- [ ] Verify theme reverts

---

### 6. **Admin Features** 👨‍💼 (If Admin User)

> **Note**: Requires admin user account

#### Access Admin Dashboard
- [ ] Login as admin user
- [ ] Click "Admin" in navigation
- [ ] Verify admin dashboard loads
- [ ] Check product list displays

#### Add Product
- [ ] Click "Add Product" button
- [ ] Fill in product form
- [ ] Submit form
- [ ] Verify success message
- [ ] Check new product appears in list

#### Delete Product
- [ ] Click delete icon on a product
- [ ] Confirm deletion
- [ ] Verify product removed from list

---

## 🐛 Common Issues & Solutions

### Products Not Loading
- Check API is running on port 5000
- Check browser console for CORS errors
- Verify network tab shows successful API calls

### Login Fails
- Check credentials are correct
- Verify API `/identity/login` endpoint works
- Check browser localStorage for tokens

### Cart Not Updating
- Check Redux DevTools for state changes
- Verify React Query cache updates
- Check console for errors

---

## 📊 Expected Behavior

### Performance
- ⚡ Page loads in < 2 seconds
- ⚡ Navigation feels instant (React Router)
- ⚡ Images load progressively

### Responsiveness
- 📱 Works on mobile viewport
- 💻 Works on desktop viewport
- 📐 Components resize smoothly

### Error Handling
- ❌ Shows error messages on failed API calls
- ⚠️ Toast notifications for user actions
- 🔄 Retry logic for network errors

---

## ✅ Testing Checklist Summary

- [ ] Products display on home page
- [ ] Category filtering works
- [ ] Product detail page loads
- [ ] Add to cart functions
- [ ] Cart operations work (add, remove, update)
- [ ] User registration succeeds
- [ ] User login succeeds
- [ ] Logout works correctly
- [ ] Language switching works
- [ ] Theme toggle works
- [ ] Admin features accessible (if admin)

---

## 🎯 Success Criteria

✅ **All features functional**  
✅ **No console errors**  
✅ **Smooth user experience**  
✅ **Data persists across page refreshes**  
✅ **Responsive on different screen sizes**

**If all checkboxes pass, the Clean Architecture migration is successful!** 🎉
