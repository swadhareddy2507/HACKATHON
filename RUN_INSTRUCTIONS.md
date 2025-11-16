# How to Run Your Library Management Website

## Step-by-Step Instructions

### Step 1: Install Dependencies
Open your terminal/command prompt in the project folder and run:
```bash
npm install
```
This will install all required packages (Express, MongoDB, JWT, etc.)

### Step 2: Create Environment File
Create a `.env` file in the root directory with these contents:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### Step 3: Start MongoDB
**IMPORTANT:** MongoDB must be running before starting the server!

**Windows:**
- If MongoDB is installed as a service, it should start automatically
- Or open a new terminal and run: `mongod`
- Or check Services: Press `Win+R`, type `services.msc`, find "MongoDB" and start it

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

**Check if MongoDB is running:**
- Open a new terminal and run: `mongosh` or `mongo`
- If it connects, MongoDB is running ✅

### Step 4: Start the Server

**Option A: Development Mode (with auto-reload):**
```bash
npm run dev
```

**Option B: Production Mode:**
```bash
npm start
```

You should see:
```
MongoDB Connected Successfully
Server running on port 5000
```

### Step 5: Open in Browser
Open your web browser and go to:
```
http://localhost:5000
```

You should see the login page! 🎉

---

## Quick Start (All Commands)

```bash
# 1. Install dependencies
npm install

# 2. Make sure MongoDB is running (check with: mongosh)

# 3. Start the server
npm run dev

# 4. Open browser: http://localhost:5000
```

---

## Troubleshooting

### Error: "Cannot find module"
**Solution:** Run `npm install` again

### Error: "MongoDB Connection Error"
**Solution:** 
1. Make sure MongoDB is installed
2. Start MongoDB service
3. Check if MongoDB is running: `mongosh`
4. Verify MONGODB_URI in `.env` file

### Error: "Port 5000 already in use"
**Solution:**
1. Change PORT in `.env` file to another number (e.g., 3000, 8000)
2. Or stop the process using port 5000

### Error: "EADDRINUSE"
**Solution:** Another application is using the port. Change PORT in `.env`

### MongoDB Not Found
**Solution:** 
- Install MongoDB: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): Update MONGODB_URI in `.env` with Atlas connection string

---

## First Time Setup Checklist

- [ ] Node.js installed (check with: `node --version`)
- [ ] MongoDB installed and running
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file created with correct values
- [ ] MongoDB service started
- [ ] Server started (`npm run dev`)
- [ ] Browser opened to `http://localhost:5000`

---

## Testing the Website

1. **Register a Librarian:**
   - Click "Register here"
   - Fill in details
   - Select "Librarian" role
   - Register

2. **Register a Student:**
   - Logout
   - Register with "Student" role

3. **Add Books (as Librarian):**
   - Login as Librarian
   - Go to "Manage Books"
   - Click "Add New Book"
   - Add some books

4. **Reserve Books (as Student):**
   - Login as Student
   - Search for books
   - Click "Reserve Book"

5. **Manage Reservations (as Librarian):**
   - Login as Librarian
   - Go to "Reservations"
   - Approve, Issue, or Return books

---

## Stopping the Server

Press `Ctrl + C` in the terminal where the server is running.

---

## Need Help?

- Check `README.md` for detailed documentation
- Check `SETUP.md` for setup guide
- Verify all prerequisites are installed
- Check MongoDB is running
- Verify `.env` file exists and has correct values

