# MongoDB Setup Guide

## Quick Start

### Option 1: MongoDB Atlas (Cloud - Recommended)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account
   - Create a new project

2. **Create a Cluster**
   - Click "Create" to create a new cluster
   - Choose the free tier (M0)
   - Select your region
   - Wait for cluster to be created (5-10 minutes)

3. **Create Database User**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password (save these!)
   - Click "Add User"

4. **Configure Network Access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add your IP)
   - Confirm

5. **Get Connection String**
   - Go to "Clusters" section
   - Click "Connect" button on your cluster
   - Select "Connect Your Application"
   - Copy the connection string
   - Replace `<username>` and `<password>` with your database user credentials
   - Example: `mongodb+srv://user:password@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority`

6. **Set Environment Variable**
   - Create or edit `.env.local` file in project root
   - Add: `MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/?retryWrites=true&w=majority`
   - Save file

### Option 2: Local MongoDB

1. **Install MongoDB**
   - Download from https://www.mongodb.com/try/download/community
   - Follow installation guide for your OS
   - Start MongoDB service

2. **Set Environment Variable**
   - Create or edit `.env.local` file in project root
   - Add: `MONGODB_URI=mongodb://localhost:27017/order_management`
   - Save file

3. **Verify Connection**
   - Optional: Use MongoDB Compass to verify
   - Download from https://www.mongodb.com/products/compass
   - Connect to `mongodb://localhost:27017`

---

## Environment Variable Configuration

### File Location
- **Development:** `.env.local` (local machine only, not committed to git)
- **Production:** Set via Vercel Dashboard > Settings > Environment Variables

### Example `.env.local`
```
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### Format
- **MongoDB Atlas:** `mongodb+srv://username:password@hostname/?retryWrites=true&w=majority`
- **Local MongoDB:** `mongodb://localhost:27017/order_management`
- **Custom Host:** `mongodb://username:password@hostname:port/database`

---

## Testing Connection

### Method 1: Check Application Logs
1. Start dev server: `npm run dev`
2. Look for log message:
   - ✅ `[v0] Connected to MongoDB` - Connection successful
   - ⚠️ `[v0] MongoDB not available, using in-memory storage` - Connection failed

### Method 2: Use MongoDB Compass
1. Download MongoDB Compass: https://www.mongodb.com/products/compass
2. Enter connection string
3. Click "Connect"
4. Should see `order_management` database

### Method 3: Create Test Data
1. Start application
2. Create a product in "Mahsulotlar" page
3. Create an order in "Yangi buyurtma" page
4. Use MongoDB Compass to verify collections have data

---

## Database Collections

The application automatically creates these collections:

### 1. `products`
- Stores product catalog
- Contains name, price, category, tandir capacity

### 2. `orders`
- Stores all orders
- Tracks status (jarayonda/bajarildi)
- Contains customer info, items, payments

### 3. `daily_reports`
- Stores daily bread production reports
- One report per day per product
- Tracks bread counts, waste, remaining quantities

---

## Troubleshooting

### Issue: "MONGODB_URI environment variable is not set"
**Solution:**
- Create `.env.local` file in project root
- Add `MONGODB_URI=your_connection_string`
- Restart dev server

### Issue: "Failed to connect to MongoDB"
**Solution:**
- Check connection string is correct
- Verify username/password are correct (no special characters need escaping in env var)
- Check network access (MongoDB Atlas) - add your IP or "Allow from Anywhere"
- Check MongoDB service is running (local MongoDB)

### Issue: "Authentication failed"
**Solution:**
- Verify database user credentials
- Check that user was created in correct database (usually "admin")
- Try with "Allow Access from Anywhere" in MongoDB Atlas network access

### Issue: "Data not persisting after page refresh"
**Solution:**
- Verify MongoDB connection is established (check logs for `[v0] Connected to MongoDB`)
- Check browser console for errors
- Verify collections exist in MongoDB

### Issue: "Connection timeout"
**Solution:**
- For MongoDB Atlas: Add your IP to Network Access
- For local MongoDB: Ensure service is running
- Check network connectivity
- Try increasing timeout in connection string: `serverSelectionTimeoutMS=5000`

---

## Production Deployment

### Vercel Deployment
1. Push code to GitHub
2. Connect GitHub repo to Vercel
3. Add environment variable:
   - Go to Project Settings > Environment Variables
   - Add: `MONGODB_URI` = your connection string
   - Redeploy
4. Verify in Vercel logs that MongoDB connects

### Important: Security
- Never commit `.env.local` to Git (it's in `.gitignore`)
- Use strong passwords for database users
- For MongoDB Atlas: Restrict network access to your IP in production
- Consider using VPN/SSL for local MongoDB

---

## Monitoring

### Check Active Collections
```bash
# Using MongoDB Compass:
# Connect > Select "order_management" database > View collections
```

### View Document Counts
- Products: `db.products.countDocuments()`
- Orders: `db.orders.countDocuments()`
- Daily Reports: `db.daily_reports.countDocuments()`

### Performance Metrics
- Check MongoDB Atlas dashboard for:
  - Connections count
  - Queries per second
  - Storage usage
  - Network traffic

---

## Backup Strategy

### Automatic Backups (MongoDB Atlas)
- Free tier: 2-hour snapshot backups
- Paid tier: Configurable backup frequency

### Manual Backup
1. Go to MongoDB Atlas > Snapshots
2. Click "Backup Now"
3. Click "Restore" to restore to new cluster

---

## Support

- MongoDB Docs: https://docs.mongodb.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Connection String Help: https://docs.mongodb.com/manual/reference/connection-string/
