# Library Book Reservation System

A complete production-ready Library Management System built with Node.js, Express.js, MongoDB, and vanilla JavaScript. This system allows students to search and reserve books, while librarians can manage books, approve reservations, issue books, and generate reports.

## Features

### Authentication
- User registration with role-based access (Student/Librarian)
- JWT-based authentication
- Secure password hashing with bcrypt

### Student Features
- Search books by title, author, or category
- View book availability status
- Reserve books
- View personal reservations
- Cancel pending reservations

### Librarian Features
- Complete book CRUD operations (Create, Read, Update, Delete)
- View and manage all reservations
- Approve/Reject reservations
- Issue books to students
- Mark books as returned
- Automatic fine calculation for overdue returns
- Dashboard with statistics
- Comprehensive reports:
  - Books reserved today
  - Issued books
  - Overdue returns
  - Active issues

### Business Logic
- Automatic copy management (decrease on approval, increase on return)
- Auto due-date calculation (7 days from issue date)
- Fine calculation: $10 per day for late returns
- Status management (Available/Reserved/Issued)

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Validation**: express-validator

## Project Structure

```
library-management/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── bookController.js    # Book management logic
│   ├── reservationController.js  # Reservation management
│   └── reportController.js  # Reports and statistics
├── middleware/
│   ├── auth.js              # JWT authentication middleware
│   └── validation.js        # Input validation middleware
├── models/
│   ├── User.js              # User schema
│   ├── Book.js              # Book schema
│   ├── Reservation.js       # Reservation schema
│   └── Transaction.js       # Transaction schema
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── books.js             # Book routes
│   ├── reservations.js     # Reservation routes
│   └── reports.js           # Report routes
├── utils/
│   └── generateToken.js    # JWT token generation
├── public/
│   ├── css/
│   │   └── style.css        # Frontend styles
│   ├── js/
│   │   ├── api.js           # API client functions
│   │   ├── auth.js          # Authentication UI logic
│   │   └── dashboard.js     # Dashboard UI logic
│   ├── index.html           # Login/Register page
│   └── dashboard.html       # Main dashboard page
├── .env.example             # Environment variables template
├── .gitignore              # Git ignore file
├── package.json            # Node.js dependencies
├── server.js               # Express server entry point
└── README.md               # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Step 1: Clone or Download the Project
```bash
cd library-management
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/library-management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**Important**: Change `JWT_SECRET` to a strong, random string in production!

### Step 4: Start MongoDB
Make sure MongoDB is running on your system:

**Windows:**
```bash
# If MongoDB is installed as a service, it should start automatically
# Or start manually:
mongod
```

**macOS (with Homebrew):**
```bash
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### Step 5: Run the Application

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

### Step 6: Access the Application
Open your browser and navigate to:
```
http://localhost:5000
```

## Usage Guide

### Creating Accounts

1. **Register a Student Account:**
   - Click "Register here" on the login page
   - Fill in name, email, password
   - Select "Student" as role
   - Click "Register"

2. **Register a Librarian Account:**
   - Same as above, but select "Librarian" as role

### Student Workflow

1. **Login** with student credentials
2. **Search Books** using the search bar
3. **Reserve a Book** by clicking "Reserve Book" on available books
4. **View Reservations** in the "My Reservations" tab
5. **Cancel Reservations** if status is Pending or Approved

### Librarian Workflow

1. **Login** with librarian credentials
2. **Dashboard Tab**: View statistics and overview
3. **Manage Books Tab**:
   - Click "Add New Book" to add books
   - Edit or delete existing books
4. **Reservations Tab**:
   - View all reservations
   - Approve/Reject pending reservations
   - Issue approved books
   - Mark issued books as returned
5. **Reports Tab**:
   - View books reserved today
   - View all issued books
   - View overdue returns with fine calculations
   - View active issues

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Books
- `GET /api/books` - Get all books (with optional search query)
- `GET /api/books/:id` - Get book by ID
- `POST /api/books` - Create book (Librarian only)
- `PUT /api/books/:id` - Update book (Librarian only)
- `DELETE /api/books/:id` - Delete book (Librarian only)

### Reservations
- `POST /api/reservations` - Create reservation (Student only)
- `GET /api/reservations/my` - Get user's reservations
- `GET /api/reservations` - Get all reservations (Librarian only)
- `GET /api/reservations/:id` - Get reservation by ID
- `PUT /api/reservations/:id/status` - Update reservation status (Librarian only)
- `PUT /api/reservations/:id/cancel` - Cancel reservation (Student only)

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics (Librarian only)
- `GET /api/reports/reserved-today` - Get books reserved today (Librarian only)
- `GET /api/reports/issued` - Get issued books (Librarian only)
- `GET /api/reports/overdue` - Get overdue returns (Librarian only)
- `GET /api/reports/active` - Get active issues (Librarian only)

## Database Schema

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (Student/Librarian),
  contact: String
}
```

### Book
```javascript
{
  title: String,
  author: String,
  category: String,
  copiesTotal: Number,
  copiesAvailable: Number,
  status: String (Available/Reserved/Issued),
  description: String
}
```

### Reservation
```javascript
{
  userId: ObjectId (ref: User),
  bookId: ObjectId (ref: Book),
  status: String (Pending/Approved/Rejected/Issued/Returned/Cancelled),
  reservationDate: Date,
  approvalDate: Date,
  rejectionReason: String
}
```

### Transaction
```javascript
{
  reservationId: ObjectId (ref: Reservation),
  userId: ObjectId (ref: User),
  bookId: ObjectId (ref: Book),
  issueDate: Date,
  dueDate: Date,
  returnDate: Date,
  fineAmount: Number,
  isReturned: Boolean
}
```

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS enabled
- Error handling middleware

## Testing with Postman

### 1. Register a User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student",
  "contact": "1234567890"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Copy the `token` from the response.

### 3. Create a Book (Librarian only)
```
POST http://localhost:5000/api/books
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "Fiction",
  "copiesTotal": 5,
  "description": "A classic American novel"
}
```

### 4. Get All Books
```
GET http://localhost:5000/api/books
```

### 5. Create Reservation (Student only)
```
POST http://localhost:5000/api/reservations
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "bookId": "BOOK_ID_HERE"
}
```

### 6. Update Reservation Status (Librarian only)
```
PUT http://localhost:5000/api/reservations/RESERVATION_ID/status
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "status": "Approved"
}
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or check service status
- Verify `MONGODB_URI` in `.env` file
- Check MongoDB port (default: 27017)

### Port Already in Use
- Change `PORT` in `.env` file
- Or kill the process using the port

### JWT Token Errors
- Ensure `JWT_SECRET` is set in `.env`
- Clear browser localStorage and login again
- Check token expiration

### CORS Errors
- CORS is enabled for all origins in development
- For production, configure specific origins in `server.js`

## Production Deployment

1. **Environment Variables**: Set production values in `.env`
2. **JWT Secret**: Use a strong, random secret
3. **MongoDB**: Use MongoDB Atlas or secure MongoDB instance
4. **HTTPS**: Enable HTTPS for secure communication
5. **Error Handling**: Configure proper error logging
6. **Rate Limiting**: Add rate limiting for API endpoints
7. **Database Indexing**: Add indexes for frequently queried fields

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository or contact the development team.

---

**Built with ❤️ for efficient library management**

