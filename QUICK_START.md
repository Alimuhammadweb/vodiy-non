# Quick Start Checklist

## ✅ Pre-Flight Check
- [ ] You have Node.js 18+ installed
- [ ] You have npm or pnpm installed
- [ ] You cloned/downloaded the project
- [ ] You have a MongoDB account (create free: https://www.mongodb.com/cloud/atlas)

---

## ⚙️ Setup (5 minutes)

### 1. Create `.env.local` File
```bash
# In project root, create file: .env.local
# Add this line with your MongoDB URL:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

### 2. Get Your MongoDB URL
**If you don't have one yet:**

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create a free cluster (M0)
4. Create database user (username & password)
5. Allow network access: "Allow from Anywhere"
6. Click "Connect" → "Connect Your Application"
7. Copy the connection string
8. Replace `<username>`, `<password>`, and database name if needed
9. Paste into `.env.local`

**Example:**
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Verify MongoDB Connection
- Open terminal where `npm run dev` is running
- Look for: **`[v0] Connected to MongoDB`** ✅
- If you see this, everything is working!

---

## 🧪 Test All Fixes

### Test 1: Reports Persist (Bug Fix #1)
```
1. Open http://localhost:3000
2. Click "Hisobot" (Reports)
3. Click "Hisobotni oʻrnatish"
4. Select a product → Click "Hisobotni oʻrnatish"
5. Add 2 Tandir (click button twice)
6. Press F5 to refresh
7. ✅ Should see "Yopilgan tandir soni: 2" (data persisted)
```

### Test 2: Bajarildi Green (Bug Fix #2)
```
1. Click "Yangi buyurtma" (New Order)
2. Fill in form:
   - Nomi: Test Customer
   - Telefon: 998901234567
   - Select any product
   - Click "Buyurtmani saqlash"
3. Click "Buyurtmalar" (Orders)
4. Find the order you just created
5. Click "Bajarildi" button
6. Confirm "Ha, bajarildi"
7. ✅ Card turns GREEN with check icon
8. Press F5 to refresh
9. ✅ Card is STILL GREEN (status persisted)
```

### Test 3: Delete Persists (Bug Fix #3)
```
1. Click "Mahsulotlar" (Products)
2. Find any product with red delete button
3. Click delete button
4. Confirm deletion
5. ✅ Product disappears
6. Press F5 to refresh
7. ✅ Product is STILL deleted (deletion persisted)
```

### Test 4: MongoDB Connection (Bug Fix #4)
```
1. Terminal shows: [v0] Connected to MongoDB ✅
2. Run all tests 1-3 above
3. ✅ All data persists across page refreshes
4. ✅ All data persists if you restart `npm run dev`
```

---

## 📋 Verification Steps

After setup, verify each component:

| Component | Command | Expected Result |
|-----------|---------|-----------------|
| MongoDB | Check logs | `[v0] Connected to MongoDB` |
| Products Page | http://localhost:3000/products | Can add/delete products |
| Orders Page | http://localhost:3000/orders | Can create/complete orders |
| Reports Page | http://localhost:3000/reports | Can create/update reports |
| Data Persistence | F5 refresh | Data remains after refresh |

---

## 🚀 Deployment to Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "Fixed MongoDB integration and all bugs"
git push origin main
```

### 2. Connect to Vercel
- Go to https://vercel.com
- Click "New Project"
- Select your GitHub repo
- Click "Import"

### 3. Add Environment Variable
- In Vercel dashboard: Project Settings → Environment Variables
- Add:
  - **Key:** `MONGODB_URI`
  - **Value:** Your MongoDB connection string
  - Click "Save"

### 4. Deploy
- Click "Deploy"
- Wait for build to complete
- ✅ App is live!

---

## ❌ Troubleshooting

### Issue: "[v0] MongoDB not available"
**Solution:**
- Check `.env.local` has `MONGODB_URI`
- Check connection string is correct
- Check username/password are URL encoded (no special chars)
- Verify MongoDB cluster is running

### Issue: "MONGODB_URI environment variable is not set"
**Solution:**
- Create `.env.local` file (if it doesn't exist)
- Add: `MONGODB_URI=your_connection_string`
- Restart: `npm run dev`

### Issue: "Authentication failed"
**Solution:**
- Verify database user credentials in MongoDB Atlas
- Check user was created (Users → Database Users)
- Try: "Allow from Anywhere" in Network Access

### Issue: "Data disappears after refresh"
**Solution:**
- Verify MongoDB connection in logs: `[v0] Connected to MongoDB`
- Check MongoDB has data (use MongoDB Compass)
- Verify collections exist: products, orders, daily_reports

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `.env.local` | **You create this** - Contains your MongoDB URL |
| `.env.example` | Template showing what to add |
| `lib/mongodb.ts` | MongoDB connection manager (NEW) |
| `app/actions.ts` | Server actions with MongoDB (MODIFIED) |
| `BUG_FIXES.md` | Detailed technical explanation |
| `MONGODB_SETUP.md` | Detailed MongoDB setup guide |

---

## ✨ Next Steps

1. ✅ **Complete:** Choose Setup option (Atlas or Local)
2. ✅ **Test:** Run all 4 tests above
3. ✅ **Deploy:** Push to GitHub and deploy to Vercel
4. ✅ **Done:** Your app is now production-ready!

---

## 📞 Need Help?

- **MongoDB Questions:** Read `MONGODB_SETUP.md`
- **Technical Details:** Read `BUG_FIXES.md`
- **Full Implementation:** Read `IMPLEMENTATION_SUMMARY.md`
- **Logs:** Look for `[v0]` prefix in console

---

## ⏱️ Expected Time

- Setup: 5 minutes
- Testing: 5 minutes
- Deployment: 5 minutes
- **Total: ~15 minutes**

You're ready! Start with Step 1 under "Setup" above. 🚀
