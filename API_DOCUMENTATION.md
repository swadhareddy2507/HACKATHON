# API Documentation - Library Management System

Base URL: `http://localhost:5000/api`

All protected routes require JWT token in the Authorization header:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## Authentication Endpoints

### 1. Register User
**POST** `/auth/register`

**Description**: Register a new user (Student or Librarian)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "Student",
  "contact": "1234567890"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Student",
      "contact": "1234567890"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Description**: Login and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Student",
      "contact": "1234567890"
    },
    "token": "jwt_token_here"
  }
}
```

---

### 3. Get Current User
**GET** `/auth/me`

**Description**: Get current authenticated user information

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "Student",
      "contact": "1234567890"
    }
  }
}
```

---

## Book Endpoints

### 4. Get All Books
**GET** `/books`

**Description**: Get all books with optional search/filter

**Query Parameters:**
- `search` (optional): Search by title, author, or category
- `category` (optional): Filter by category
- `author` (optional): Filter by author

**Example:**
```
GET /books?search=gatsby
GET /books?category=Fiction
```

**Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "book_id",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "Fiction",
      "copiesTotal": 5,
      "copiesAvailable": 3,
      "status": "Available",
      "description": "A classic novel",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 5. Get Book by ID
**GET** `/books/:id`

**Description**: Get a specific book by ID

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "book_id",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "category": "Fiction",
    "copiesTotal": 5,
    "copiesAvailable": 3,
    "status": "Available",
    "description": "A classic novel"
  }
}
```

---

### 6. Create Book
**POST** `/books`

**Description**: Create a new book (Librarian only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "Fiction",
  "copiesTotal": 5,
  "description": "A classic American novel"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Book created successfully",
  "data": {
    "_id": "book_id",
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "category": "Fiction",
    "copiesTotal": 5,
    "copiesAvailable": 5,
    "status": "Available"
  }
}
```

---

### 7. Update Book
**PUT** `/books/:id`

**Description**: Update a book (Librarian only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "author": "Updated Author",
  "category": "Updated Category",
  "copiesTotal": 10,
  "description": "Updated description"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": {
    "_id": "book_id",
    "title": "Updated Title",
    "author": "Updated Author",
    "category": "Updated Category",
    "copiesTotal": 10,
    "copiesAvailable": 8,
    "status": "Available"
  }
}
```

---

### 8. Delete Book
**DELETE** `/books/:id`

**Description**: Delete a book (Librarian only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Book deleted successfully"
}
```

---

## Reservation Endpoints

### 9. Create Reservation
**POST** `/reservations`

**Description**: Create a new reservation (Student only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "bookId": "book_id_here"
}
```

**Response (201):**
```json
{
  "success": true,
  "message": "Reservation created successfully",
  "data": {
    "_id": "reservation_id",
    "userId": "user_id",
    "bookId": {
      "_id": "book_id",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "Fiction"
    },
    "status": "Pending",
    "reservationDate": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 10. Get My Reservations
**GET** `/reservations/my`

**Description**: Get current user's reservations

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `status` (optional): Filter by status (Pending/Approved/Issued/Returned/Cancelled)

**Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "reservation_id",
      "userId": "user_id",
      "bookId": {
        "_id": "book_id",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "category": "Fiction",
        "copiesAvailable": 3
      },
      "status": "Pending",
      "reservationDate": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 11. Get All Reservations
**GET** `/reservations`

**Description**: Get all reservations (Librarian only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Query Parameters:**
- `status` (optional): Filter by status

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "reservation_id",
      "userId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "bookId": {
        "_id": "book_id",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "category": "Fiction"
      },
      "status": "Pending",
      "reservationDate": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 12. Get Reservation by ID
**GET** `/reservations/:id`

**Description**: Get a specific reservation by ID

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "reservation_id",
    "userId": {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "bookId": {
      "_id": "book_id",
      "title": "The Great Gatsby",
      "author": "F. Scott Fitzgerald",
      "category": "Fiction"
    },
    "status": "Pending",
    "reservationDate": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 13. Update Reservation Status
**PUT** `/reservations/:id/status`

**Description**: Update reservation status (Librarian only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Request Body:**
```json
{
  "status": "Approved",
  "rejectionReason": "Optional reason for rejection"
}
```

**Status Values:**
- `Approved` - Approve a pending reservation
- `Rejected` - Reject a pending reservation
- `Issued` - Issue an approved book (creates transaction)
- `Returned` - Mark an issued book as returned (calculates fine)

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation approved successfully",
  "data": {
    "_id": "reservation_id",
    "status": "Approved",
    "approvalDate": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 14. Cancel Reservation
**PUT** `/reservations/:id/cancel`

**Description**: Cancel a reservation (Student only)

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "message": "Reservation cancelled successfully",
  "data": {
    "_id": "reservation_id",
    "status": "Cancelled"
  }
}
```

---

## Report Endpoints (Librarian Only)

### 15. Get Dashboard Statistics
**GET** `/reports/dashboard`

**Description**: Get dashboard statistics

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "reservedToday": 5,
    "totalBooks": 100,
    "availableBooks": 75,
    "activeIssues": 20,
    "overdueReturns": 3,
    "pendingReservations": 8,
    "totalTransactions": 150
  }
}
```

---

### 16. Get Books Reserved Today
**GET** `/reports/reserved-today`

**Description**: Get all books reserved today

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "reservation_id",
      "userId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "bookId": {
        "_id": "book_id",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "category": "Fiction"
      },
      "status": "Pending",
      "reservationDate": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 17. Get Issued Books
**GET** `/reports/issued`

**Description**: Get all currently issued books

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "transaction_id",
      "userId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "bookId": {
        "_id": "book_id",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "category": "Fiction"
      },
      "issueDate": "2024-01-01T00:00:00.000Z",
      "dueDate": "2024-01-08T00:00:00.000Z",
      "isReturned": false
    }
  ]
}
```

---

### 18. Get Overdue Returns
**GET** `/reports/overdue`

**Description**: Get all overdue returns with fine calculations

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "transaction_id",
      "userId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "bookId": {
        "_id": "book_id",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "category": "Fiction"
      },
      "issueDate": "2023-12-20T00:00:00.000Z",
      "dueDate": "2023-12-27T00:00:00.000Z",
      "lateDays": 5,
      "calculatedFine": 50
    }
  ]
}
```

---

### 19. Get Active Issues
**GET** `/reports/active`

**Description**: Get all active (not returned) issues

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
```

**Response (200):**
```json
{
  "success": true,
  "count": 20,
  "data": [
    {
      "_id": "transaction_id",
      "userId": {
        "_id": "user_id",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "bookId": {
        "_id": "book_id",
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "category": "Fiction"
      },
      "issueDate": "2024-01-01T00:00:00.000Z",
      "dueDate": "2024-01-08T00:00:00.000Z",
      "isReturned": false
    }
  ]
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation errors",
  "errors": [
    {
      "msg": "Title is required",
      "param": "title"
    }
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Not authorized to access this route"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "User role 'Student' is not authorized to access this route"
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Book not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "message": "Error message here"
}
```

---

## Postman Collection Setup

1. Create a new Postman Collection
2. Set collection variable: `base_url` = `http://localhost:5000/api`
3. Set collection variable: `token` = (will be set after login)
4. For protected routes, add header:
   - Key: `Authorization`
   - Value: `Bearer {{token}}`

### Quick Test Flow:

1. **Register** → Save token from response
2. **Login** → Update token variable
3. **Create Book** (as Librarian) → Save book_id
4. **Get All Books** → Verify book appears
5. **Create Reservation** (as Student) → Save reservation_id
6. **Update Reservation Status** (as Librarian) → Approve/Issue
7. **Get Reports** → View statistics

---

## Notes

- All dates are in ISO 8601 format
- JWT tokens expire in 7 days (configurable via `JWT_EXPIRE`)
- Fine calculation: $10 per day for late returns
- Due date is automatically set to 7 days from issue date
- Book copies are automatically managed (decreased on approval, increased on return/cancel)

