// Dashboard functionality
let currentUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Check authentication
    const token = getToken();
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    currentUser = getUser();
    if (!currentUser) {
        try {
            const response = await authAPI.getMe();
            currentUser = response.data.user;
            setAuth(token, currentUser);
        } catch (error) {
            clearAuth();
            window.location.href = 'index.html';
            return;
        }
    }

    // Initialize dashboard based on role
    if (currentUser.role === 'Librarian') {
        initLibrarianDashboard();
    } else {
        initStudentDashboard();
    }

    // Logout functionality
    document.getElementById('logoutBtn')?.addEventListener('click', () => {
        clearAuth();
        window.location.href = 'index.html';
    });
});

function initStudentDashboard() {
    const dashboardHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h1>Student Dashboard</h1>
                <div class="user-info">
                    <span>Welcome, ${currentUser.name}</span>
                    <button id="logoutBtn" class="logout-btn">Logout</button>
                </div>
            </div>
            <div class="nav-tabs">
                <button class="nav-tab active" data-tab="search">Search Books</button>
                <button class="nav-tab" data-tab="reservations">My Reservations</button>
            </div>
            <div id="searchSection" class="content-section active">
                <div class="search-bar">
                    <input type="text" id="bookSearch" placeholder="Search by title, author, or category...">
                    <button class="btn btn-primary" onclick="searchBooks()">Search</button>
                </div>
                <div id="booksContainer" class="card-grid"></div>
            </div>
            <div id="reservationsSection" class="content-section">
                <div id="reservationsContainer"></div>
            </div>
        </div>
    `;
    document.body.innerHTML = dashboardHTML;
    setupStudentTabs();
    loadBooks();
    loadMyReservations();
}

function initLibrarianDashboard() {
    const dashboardHTML = `
        <div class="dashboard">
            <div class="dashboard-header">
                <h1>Librarian Dashboard</h1>
                <div class="user-info">
                    <span>Welcome, ${currentUser.name}</span>
                    <button id="logoutBtn" class="logout-btn">Logout</button>
                </div>
            </div>
            <div class="nav-tabs">
                <button class="nav-tab active" data-tab="stats">Dashboard</button>
                <button class="nav-tab" data-tab="books">Manage Books</button>
                <button class="nav-tab" data-tab="reservations">Reservations</button>
                <button class="nav-tab" data-tab="reports">Reports</button>
            </div>
            <div id="statsSection" class="content-section active">
                <div id="statsContainer"></div>
            </div>
            <div id="booksSection" class="content-section">
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-primary" onclick="showAddBookModal()">Add New Book</button>
                </div>
                <div id="booksContainer" class="card-grid"></div>
            </div>
            <div id="reservationsSection" class="content-section">
                <div id="reservationsContainer"></div>
            </div>
            <div id="reportsSection" class="content-section">
                <div id="reportsContainer"></div>
            </div>
        </div>
    `;
    document.body.innerHTML = dashboardHTML;
    setupLibrarianTabs();
    loadDashboardStats();
    loadAllBooks();
    loadAllReservations();
}

function setupStudentTabs() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tabName}Section`).classList.add('active');
        });
    });
}

function setupLibrarianTabs() {
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            const tabName = tab.dataset.tab;
            document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(`${tabName}Section`).classList.add('active');
            
            // Load data when switching tabs
            if (tabName === 'stats') loadDashboardStats();
            if (tabName === 'books') loadAllBooks();
            if (tabName === 'reservations') loadAllReservations();
            if (tabName === 'reports') loadReports();
        });
    });
}

async function loadBooks() {
    try {
        const response = await booksAPI.getAll();
        displayBooks(response.data);
    } catch (error) {
        showAlert('Error loading books: ' + error.message, 'error');
    }
}

async function searchBooks() {
    const searchTerm = document.getElementById('bookSearch').value;
    try {
        const response = await booksAPI.getAll({ search: searchTerm });
        displayBooks(response.data);
    } catch (error) {
        showAlert('Error searching books: ' + error.message, 'error');
    }
}

function displayBooks(books) {
    const container = document.getElementById('booksContainer');
    if (!books || books.length === 0) {
        container.innerHTML = '<p>No books found</p>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="card">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <p><strong>Available:</strong> ${book.copiesAvailable} / ${book.copiesTotal}</p>
            <span class="badge badge-${book.status.toLowerCase()}">${book.status}</span>
            ${currentUser.role === 'Student' && book.copiesAvailable > 0 ? `
                <button class="btn btn-primary btn-sm" style="margin-top: 10px; width: 100%;" onclick="reserveBook('${book._id}')">
                    Reserve Book
                </button>
            ` : ''}
        </div>
    `).join('');
}

async function reserveBook(bookId) {
    if (!confirm('Are you sure you want to reserve this book?')) return;
    
    try {
        const response = await reservationsAPI.create({ bookId });
        if (response.success) {
            showAlert('Book reserved successfully!', 'success');
            loadBooks();
            loadMyReservations();
        }
    } catch (error) {
        showAlert('Error reserving book: ' + error.message, 'error');
    }
}

async function loadMyReservations() {
    try {
        const response = await reservationsAPI.getMy();
        displayMyReservations(response.data);
    } catch (error) {
        showAlert('Error loading reservations: ' + error.message, 'error');
    }
}

function displayMyReservations(reservations) {
    const container = document.getElementById('reservationsContainer');
    if (!reservations || reservations.length === 0) {
        container.innerHTML = '<p>No reservations found</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Book</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Reservation Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservations.map(res => `
                        <tr>
                            <td>${res.bookId?.title || 'N/A'}</td>
                            <td>${res.bookId?.author || 'N/A'}</td>
                            <td><span class="badge badge-${res.status.toLowerCase()}">${res.status}</span></td>
                            <td>${new Date(res.reservationDate).toLocaleDateString()}</td>
                            <td>
                                ${res.status === 'Pending' || res.status === 'Approved' ? `
                                    <button class="btn btn-danger btn-sm" onclick="cancelReservation('${res._id}')">Cancel</button>
                                ` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function cancelReservation(reservationId) {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    
    try {
        const response = await reservationsAPI.cancel(reservationId);
        if (response.success) {
            showAlert('Reservation cancelled successfully!', 'success');
            loadMyReservations();
            loadBooks();
        }
    } catch (error) {
        showAlert('Error cancelling reservation: ' + error.message, 'error');
    }
}

// Librarian functions
async function loadDashboardStats() {
    try {
        const response = await reportsAPI.getDashboard();
        const stats = response.data;
        
        const container = document.getElementById('statsContainer');
        container.innerHTML = `
            <div class="stats-grid">
                <div class="stat-card">
                    <h3>${stats.totalBooks}</h3>
                    <p>Total Books</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.availableBooks}</h3>
                    <p>Available Books</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.activeIssues}</h3>
                    <p>Active Issues</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.pendingReservations}</h3>
                    <p>Pending Reservations</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.overdueReturns}</h3>
                    <p>Overdue Returns</p>
                </div>
                <div class="stat-card">
                    <h3>${stats.reservedToday}</h3>
                    <p>Reserved Today</p>
                </div>
            </div>
        `;
    } catch (error) {
        showAlert('Error loading dashboard stats: ' + error.message, 'error');
    }
}

async function loadAllBooks() {
    try {
        const response = await booksAPI.getAll();
        displayAllBooks(response.data);
    } catch (error) {
        showAlert('Error loading books: ' + error.message, 'error');
    }
}

function displayAllBooks(books) {
    const container = document.getElementById('booksContainer');
    if (!books || books.length === 0) {
        container.innerHTML = '<p>No books found</p>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="card">
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Category:</strong> ${book.category}</p>
            <p><strong>Available:</strong> ${book.copiesAvailable} / ${book.copiesTotal}</p>
            <span class="badge badge-${book.status.toLowerCase()}">${book.status}</span>
            <div class="action-buttons">
                <button class="btn btn-warning btn-sm" onclick="showEditBookModal('${book._id}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBook('${book._id}')">Delete</button>
            </div>
        </div>
    `).join('');
}

function showAddBookModal() {
    const modalHTML = `
        <div class="modal active" id="bookModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Add New Book</h2>
                    <button class="close-btn" onclick="closeModal()">&times;</button>
                </div>
                <form id="addBookForm">
                    <div class="form-group">
                        <label>Title</label>
                        <input type="text" id="bookTitle" required>
                    </div>
                    <div class="form-group">
                        <label>Author</label>
                        <input type="text" id="bookAuthor" required>
                    </div>
                    <div class="form-group">
                        <label>Category</label>
                        <input type="text" id="bookCategory" required>
                    </div>
                    <div class="form-group">
                        <label>Total Copies</label>
                        <input type="number" id="bookCopies" min="1" required>
                    </div>
                    <div class="form-group">
                        <label>Description (Optional)</label>
                        <textarea id="bookDescription" rows="3"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">Add Book</button>
                </form>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    document.getElementById('addBookForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const bookData = {
            title: document.getElementById('bookTitle').value,
            author: document.getElementById('bookAuthor').value,
            category: document.getElementById('bookCategory').value,
            copiesTotal: parseInt(document.getElementById('bookCopies').value),
            description: document.getElementById('bookDescription').value
        };
        
        try {
            const response = await booksAPI.create(bookData);
            if (response.success) {
                showAlert('Book added successfully!', 'success');
                closeModal();
                loadAllBooks();
            }
        } catch (error) {
            showAlert('Error adding book: ' + error.message, 'error');
        }
    });
}

function showEditBookModal(bookId) {
    // Similar to add modal but with existing data
    booksAPI.getById(bookId).then(response => {
        const book = response.data;
        const modalHTML = `
            <div class="modal active" id="bookModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Edit Book</h2>
                        <button class="close-btn" onclick="closeModal()">&times;</button>
                    </div>
                    <form id="editBookForm">
                        <div class="form-group">
                            <label>Title</label>
                            <input type="text" id="bookTitle" value="${book.title}" required>
                        </div>
                        <div class="form-group">
                            <label>Author</label>
                            <input type="text" id="bookAuthor" value="${book.author}" required>
                        </div>
                        <div class="form-group">
                            <label>Category</label>
                            <input type="text" id="bookCategory" value="${book.category}" required>
                        </div>
                        <div class="form-group">
                            <label>Total Copies</label>
                            <input type="number" id="bookCopies" value="${book.copiesTotal}" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Description (Optional)</label>
                            <textarea id="bookDescription" rows="3">${book.description || ''}</textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Update Book</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        document.getElementById('editBookForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const bookData = {
                title: document.getElementById('bookTitle').value,
                author: document.getElementById('bookAuthor').value,
                category: document.getElementById('bookCategory').value,
                copiesTotal: parseInt(document.getElementById('bookCopies').value),
                description: document.getElementById('bookDescription').value
            };
            
            try {
                const response = await booksAPI.update(bookId, bookData);
                if (response.success) {
                    showAlert('Book updated successfully!', 'success');
                    closeModal();
                    loadAllBooks();
                }
            } catch (error) {
                showAlert('Error updating book: ' + error.message, 'error');
            }
        });
    }).catch(error => {
        showAlert('Error loading book: ' + error.message, 'error');
    });
}

async function deleteBook(bookId) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    
    try {
        const response = await booksAPI.delete(bookId);
        if (response.success) {
            showAlert('Book deleted successfully!', 'success');
            loadAllBooks();
        }
    } catch (error) {
        showAlert('Error deleting book: ' + error.message, 'error');
    }
}

async function loadAllReservations() {
    try {
        const response = await reservationsAPI.getAll();
        displayAllReservations(response.data);
    } catch (error) {
        showAlert('Error loading reservations: ' + error.message, 'error');
    }
}

function displayAllReservations(reservations) {
    const container = document.getElementById('reservationsContainer');
    if (!reservations || reservations.length === 0) {
        container.innerHTML = '<p>No reservations found</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Student</th>
                        <th>Book</th>
                        <th>Author</th>
                        <th>Status</th>
                        <th>Reservation Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    ${reservations.map(res => `
                        <tr>
                            <td>${res.userId?.name || 'N/A'}</td>
                            <td>${res.bookId?.title || 'N/A'}</td>
                            <td>${res.bookId?.author || 'N/A'}</td>
                            <td><span class="badge badge-${res.status.toLowerCase()}">${res.status}</span></td>
                            <td>${new Date(res.reservationDate).toLocaleDateString()}</td>
                            <td>
                                ${res.status === 'Pending' ? `
                                    <button class="btn btn-success btn-sm" onclick="updateReservationStatus('${res._id}', 'Approved')">Approve</button>
                                    <button class="btn btn-danger btn-sm" onclick="updateReservationStatus('${res._id}', 'Rejected')">Reject</button>
                                ` : ''}
                                ${res.status === 'Approved' ? `
                                    <button class="btn btn-primary btn-sm" onclick="updateReservationStatus('${res._id}', 'Issued')">Issue Book</button>
                                ` : ''}
                                ${res.status === 'Issued' ? `
                                    <button class="btn btn-warning btn-sm" onclick="updateReservationStatus('${res._id}', 'Returned')">Mark Returned</button>
                                ` : ''}
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

async function updateReservationStatus(reservationId, status) {
    if (!confirm(`Are you sure you want to ${status.toLowerCase()} this reservation?`)) return;
    
    try {
        const response = await reservationsAPI.updateStatus(reservationId, status);
        if (response.success) {
            showAlert(`Reservation ${status.toLowerCase()} successfully!`, 'success');
            loadAllReservations();
            loadDashboardStats();
        }
    } catch (error) {
        showAlert('Error updating reservation: ' + error.message, 'error');
    }
}

async function loadReports() {
    const container = document.getElementById('reportsContainer');
    container.innerHTML = '<div class="loading"><div class="spinner"></div>Loading reports...</div>';
    
    try {
        const [reservedToday, issued, overdue, active] = await Promise.all([
            reportsAPI.getReservedToday(),
            reportsAPI.getIssued(),
            reportsAPI.getOverdue(),
            reportsAPI.getActive()
        ]);
        
        container.innerHTML = `
            <h2 style="margin-bottom: 20px;">Reports</h2>
            <div class="nav-tabs" style="margin-bottom: 20px;" id="reportTabs">
                <button class="nav-tab active" data-report="reservedToday">Reserved Today</button>
                <button class="nav-tab" data-report="issued">Issued Books</button>
                <button class="nav-tab" data-report="overdue">Overdue Returns</button>
                <button class="nav-tab" data-report="active">Active Issues</button>
            </div>
            <div id="reportContent"></div>
        `;
        
        window.reportData = {
            reservedToday: reservedToday.data,
            issued: issued.data,
            overdue: overdue.data,
            active: active.data
        };
        
        // Setup report tab click handlers
        document.querySelectorAll('#reportTabs .nav-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const reportType = tab.dataset.report;
                showReport(reportType);
            });
        });
        
        showReport('reservedToday');
    } catch (error) {
        showAlert('Error loading reports: ' + error.message, 'error');
    }
}

function showReport(type) {
    // Update active tab
    document.querySelectorAll('#reportTabs .nav-tab').forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.report === type) {
            tab.classList.add('active');
        }
    });
    
    const container = document.getElementById('reportContent');
    const data = window.reportData[type];
    
    if (!data || data.length === 0) {
        container.innerHTML = '<p>No data found</p>';
        return;
    }
    
    if (type === 'reservedToday') {
        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Book</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Reservation Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                <td>${item.userId?.name || 'N/A'}</td>
                                <td>${item.bookId?.title || 'N/A'}</td>
                                <td>${item.bookId?.author || 'N/A'}</td>
                                <td><span class="badge badge-${item.status.toLowerCase()}">${item.status}</span></td>
                                <td>${new Date(item.reservationDate).toLocaleDateString()}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (type === 'issued' || type === 'active') {
        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Book</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                <td>${item.userId?.name || 'N/A'}</td>
                                <td>${item.bookId?.title || 'N/A'}</td>
                                <td>${new Date(item.issueDate).toLocaleDateString()}</td>
                                <td>${new Date(item.dueDate).toLocaleDateString()}</td>
                                <td>${item.isReturned ? 'Returned' : 'Active'}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    } else if (type === 'overdue') {
        container.innerHTML = `
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Book</th>
                            <th>Issue Date</th>
                            <th>Due Date</th>
                            <th>Late Days</th>
                            <th>Fine Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(item => `
                            <tr>
                                <td>${item.userId?.name || 'N/A'}</td>
                                <td>${item.bookId?.title || 'N/A'}</td>
                                <td>${new Date(item.issueDate).toLocaleDateString()}</td>
                                <td>${new Date(item.dueDate).toLocaleDateString()}</td>
                                <td>${item.lateDays || 0}</td>
                                <td>$${item.calculatedFine || 0}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }
}

function closeModal() {
    document.getElementById('bookModal')?.remove();
}

function showAlert(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type === 'error' ? 'error' : type === 'success' ? 'success' : 'info'}`;
    alertDiv.textContent = message;
    
    const container = document.querySelector('.dashboard') || document.body;
    container.insertBefore(alertDiv, container.firstChild);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}

