# Quick Setup Guide

## Prerequisites Checklist

- [ ] Node.js installed (v14+)
- [ ] MongoDB installed and running
- [ ] npm or yarn package manager

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create `.env` file in root directory:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start MongoDB
**Windows:**
- MongoDB should start automatically if installed as service
- Or run: `mongod`

**macOS:**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 4. Start the Server
```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

### 5. Access Application
Open browser: `http://localhost:5000`

## First Steps

1. **Register a Librarian Account:**
   - Click "Register here"
   - Fill in details
   - Select "Librarian" role
   - Register

2. **Register a Student Account:**
   - Logout (if logged in)
   - Register with "Student" role

3. **Add Books (as Librarian):**
   - Login as Librarian
   - Go to "Manage Books" tab
   - Click "Add New Book"
   - Fill in book details
   - Save

4. **Reserve Books (as Student):**
   - Login as Student
   - Search for books
   - Click "Reserve Book"
   - View in "My Reservations"

5. **Manage Reservations (as Librarian):**
   - Login as Librarian
   - Go to "Reservations" tab
   - Approve pending reservations
   - Issue approved books
   - Mark books as returned

## Troubleshooting

### MongoDB Not Running
**Error:** `MongoDB Connection Error`
**Solution:** Start MongoDB service

### Port Already in Use
**Error:** `Port 5000 already in use`
**Solution:** Change PORT in `.env` file

### JWT Token Issues
**Error:** `Not authorized`
**Solution:** 
- Clear browser localStorage
- Login again
- Check JWT_SECRET in `.env`

### Module Not Found
**Error:** `Cannot find module`
**Solution:** Run `npm install` again

## Testing with Postman

1. Import API endpoints from `API_DOCUMENTATION.md`
2. Register a user → Save token
3. Use token in Authorization header: `Bearer YOUR_TOKEN`
4. Test all endpoints

## Project Structure

```
library-management/
├── config/          # Database configuration
├── controllers/     # Business logic
├── middleware/      # Auth & validation
├── models/          # MongoDB schemas
├── routes/          # API routes
├── utils/           # Helper functions
├── public/          # Frontend files
│   ├── css/
│   ├── js/
│   └── *.html
├── server.js        # Entry point
└── package.json     # Dependencies
```

## Next Steps

- Review `README.md` for detailed documentation
- Check `API_DOCUMENTATION.md` for API reference
- Customize JWT_SECRET for production
- Configure MongoDB connection string
- Add more books and test workflows

## Support

For issues, check:
1. MongoDB is running
2. Environment variables are set
3. Dependencies are installed
4. Port is available

Happy coding! 🚀

