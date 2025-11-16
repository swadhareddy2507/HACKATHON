# Test Examples for Library Management System

## Example User Credentials

### Librarian Account
```
Email: librarian@library.com
Password: librarian123
Role: Librarian
Name: Admin Librarian
Contact: 123-456-7890
```

### Student Account
```
Email: student@library.com
Password: student123
Role: Student
Name: John Student
Contact: 987-654-3210
```

---

## Step-by-Step Test Example

### Step 1: Register Librarian
1. Open http://localhost:5000
2. Click "Register here"
3. Fill in:
   - Name: `Admin Librarian`
   - Email: `librarian@library.com`
   - Password: `librarian123`
   - Role: Select `Librarian`
   - Contact: `123-456-7890`
4. Click "Register"
5. You should be automatically logged in and see the Librarian Dashboard

### Step 2: Add Example Books
Once logged in as Librarian, go to "Manage Books" tab and add these books:

**Book 1:**
- Title: `The Great Gatsby`
- Author: `F. Scott Fitzgerald`
- Category: `Fiction`
- Total Copies: `5`
- Description: `A classic American novel about the Jazz Age`

**Book 2:**
- Title: `To Kill a Mockingbird`
- Author: `Harper Lee`
- Category: `Fiction`
- Total Copies: `3`
- Description: `A gripping tale of racial injustice and childhood innocence`

**Book 3:**
- Title: `Introduction to Computer Science`
- Author: `John Smith`
- Category: `Education`
- Total Copies: `10`
- Description: `Comprehensive guide to computer science fundamentals`

**Book 4:**
- Title: `The Art of War`
- Author: `Sun Tzu`
- Category: `Philosophy`
- Total Copies: `2`
- Description: `Ancient Chinese military treatise`

### Step 3: Logout and Register Student
1. Click "Logout" button
2. Click "Register here"
3. Fill in:
   - Name: `John Student`
   - Email: `student@library.com`
   - Password: `student123`
   - Role: Select `Student`
   - Contact: `987-654-3210`
4. Click "Register"
5. You should see the Student Dashboard

### Step 4: Search and Reserve Books (as Student)
1. In the "Search Books" tab, you should see all the books you added
2. Try searching for "Gatsby" - it should show "The Great Gatsby"
3. Click "Reserve Book" on "The Great Gatsby"
4. You should see a success message
5. Go to "My Reservations" tab
6. You should see your reservation with status "Pending"

### Step 5: Approve Reservation (as Librarian)
1. Logout as Student
2. Login as Librarian (`librarian@library.com` / `librarian123`)
3. Go to "Reservations" tab
4. You should see John Student's reservation for "The Great Gatsby"
5. Click "Approve" button
6. Status should change to "Approved"
7. Available copies should decrease (from 5 to 4)

### Step 6: Issue Book (as Librarian)
1. Still in Reservations tab
2. Find the approved reservation
3. Click "Issue Book" button
4. Status should change to "Issued"
5. A transaction is created with due date 7 days from now

### Step 7: View Reports (as Librarian)
1. Go to "Reports" tab
2. Click on different report types:
   - **Reserved Today**: Shows books reserved today
   - **Issued Books**: Shows all currently issued books
   - **Overdue Returns**: Shows books past due date (with fines)
   - **Active Issues**: Shows all active (not returned) issues

### Step 8: Return Book (as Librarian)
1. Go to "Reservations" tab
2. Find the issued book
3. Click "Mark Returned" button
4. Status should change to "Returned"
5. Available copies should increase back
6. Fine will be calculated if overdue

---

## Expected Screenshots/Views

### Login Page
- Should show "Library Management System" title
- Login form with Email and Password fields
- "Register here" link at bottom
- Purple gradient background

### Student Dashboard
- Welcome message with student name
- Two tabs: "Search Books" and "My Reservations"
- Search bar to find books
- Book cards showing: Title, Author, Category, Available copies, Status badge
- "Reserve Book" button on available books

### Librarian Dashboard
- Welcome message with librarian name
- Four tabs: "Dashboard", "Manage Books", "Reservations", "Reports"
- Dashboard shows statistics cards
- Manage Books: Add/Edit/Delete books
- Reservations: Approve/Reject/Issue/Return books
- Reports: Various reports and statistics

---

## Quick Test Checklist

- [ ] Can register Librarian account
- [ ] Can register Student account
- [ ] Can login with both accounts
- [ ] Can add books (as Librarian)
- [ ] Can search books (as Student)
- [ ] Can reserve book (as Student)
- [ ] Can see reservation in "My Reservations" (as Student)
- [ ] Can see pending reservation (as Librarian)
- [ ] Can approve reservation (as Librarian)
- [ ] Can issue book (as Librarian)
- [ ] Can view reports (as Librarian)
- [ ] Can return book (as Librarian)
- [ ] Available copies decrease on approval
- [ ] Available copies increase on return

---

## API Test Examples (Using Browser Console)

Open browser console (F12) and try these:

### Get All Books
```javascript
fetch('/api/books')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Get My Reservations (after login)
```javascript
fetch('/api/reservations/my', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  }
})
  .then(res => res.json())
  .then(data => console.log(data));
```

---

## Common Issues and Solutions

### Issue: "Cannot reserve book"
**Solution:** Make sure book has available copies > 0

### Issue: "Not authorized"
**Solution:** Make sure you're logged in and token is valid

### Issue: "Book not found"
**Solution:** Make sure book ID is correct

### Issue: "Already reserved"
**Solution:** You can only have one pending/approved reservation per book

---

## Expected Database State After Testing

After following all steps, you should have:

- **2 Users**: 1 Librarian, 1 Student
- **4 Books**: Various categories
- **1 Reservation**: Status can be Pending/Approved/Issued/Returned
- **1 Transaction**: If book was issued (with issue date, due date)

---

**Happy Testing! 🚀**

