# Quick Debug Guide - Product Add Feature

## To Debug Product Add Issues, Follow This Checklist

### Step 1: Check Browser Console for [v0] Logs
Open DevTools (F12) → Console tab and look for messages starting with `[v0]`:

**Expected Log Sequence:**
```
[v0] handleAddProduct called with: {name: "Test", price: 5000, category: "Bread"}
[v0] addProduct called with: {name: "Test", price: 5000, category: "Bread", ...}
[v0] addProduct using MongoDB (or "in-memory fallback")
[v0] addProduct inserted with id: 507f1f77bcf86cd799439011
[v0] addProduct returned: {_id: "...", name: "Test", price: 5000, ...}
[v0] reloading products list
[v0] getProducts fetched from MongoDB: 1 products
```

### Step 2: If You See Errors
Look for `[v0] Failed to create product:` or `Error in handleAddProduct:`

**Common Errors:**
- `MONGODB_URI environment variable is not set` → Add to `.env.local`
- `Connection refused` → MongoDB server not running or wrong URI
- `Validation Error` → Check field types/values

### Step 3: Check .env.local
```bash
# This file must exist in project root with:
MONGODB_URI=your_connection_string_here
```

### Step 4: Verify MongoDB Connection
In browser console, look for:
```
[v0] Connected to MongoDB  ✓ (MongoDB is working)
OR
[v0] MongoDB not available, using in-memory storage  (Fallback mode)
```

### Step 5: Check Server Console
The dev server terminal should also show the same `[v0]` logs from the server actions.

---

## The Actual Product Add Flow

```
ProductForm (component)
  ↓ user submits
handleAddProduct (products/page.tsx)
  ↓ calls
addProduct() (app/actions.ts server action)
  ↓
checkMongoConnection()
  ├─ if MongoDB: insert to MongoDB collection 'products'
  └─ if fallback: insert to in-memory products array
  ↓ returns product with _id or null
handleAddProduct (continued)
  ├─ if null: show alert
  └─ if success: loadProducts() then close dialog
    ↓
getProducts() (fetches all products)
  ├─ if MongoDB: query collection 'products'
  └─ if fallback: return in-memory array
    ↓ returns Product[] with _id field
ProductsPage updates state and re-renders
  ↓
New product appears in list
```

---

## Fixes Applied

| Issue | Location | Fix |
|-------|----------|-----|
| Module throws on missing MONGODB_URI | lib/mongodb.ts | Moved check inside function |
| getProducts strips _id | app/actions.ts line 71 | Return full product with _id |
| No error handling on add | app/products/page.tsx | Added try/catch and result check |
| No debug logging | app/actions.ts | Added [v0] console logs throughout |

---

## Manual Testing

### Test Product Add Works:
1. Fill form with: name="Test", price="5000", category="Bread"
2. Click "Qo'shish"
3. Check browser console for `[v0]` logs
4. Product should appear in list immediately
5. ✓ If yes, everything is working

### Test Error Handling Works:
1. Try adding with missing name field
2. ✓ Form should prevent submission (UI validation)
3. Try adding with name="" and price=0
4. ✓ ProductForm handleSubmit should show "Barcha maydonlarni to'ldiring"

### Test Persistence (MongoDB only):
1. Add a product
2. Refresh page (F5)
3. ✓ Product still exists = MongoDB is working
4. × Product gone = in-memory fallback mode (add MONGODB_URI)

---

## If Still Not Working

1. Check browser console for errors (F12)
2. Check server console for errors (terminal)
3. Verify `.env.local` has MONGODB_URI set
4. Verify MongoDB connection string is correct
5. Check that ProductForm.tsx still has `type="submit"` on button
6. Check that handleAddProduct is still being called from ProductForm.onSubmit

The `[v0]` logs will show exactly where the failure occurs.
