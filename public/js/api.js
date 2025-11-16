// API Configuration
const API_BASE_URL = '/api';

// Get token from localStorage
const getToken = () => {
    return localStorage.getItem('token');
};

// Get user from localStorage
const getUser = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
};

// Set token and user in localStorage
const setAuth = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
};

// Clear auth data
const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        // Check if response is JSON
        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            const text = await response.text();
            throw new Error(text || `Server error: ${response.status}`);
        }

        if (!response.ok) {
            // Handle validation errors
            if (data.errors && Array.isArray(data.errors)) {
                const errorMessages = data.errors.map(err => err.msg || err.message).join(', ');
                throw new Error(errorMessages || data.message || 'Validation failed');
            }
            throw new Error(data.message || 'Request failed');
        }

        return data;
    } catch (error) {
        // Handle network errors
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error('Network error: Cannot connect to server. Make sure the server is running.');
        }
        // If it's already an Error object, throw it as is
        if (error instanceof Error) {
            throw error;
        }
        // Otherwise, wrap it in an Error
        throw new Error(error.message || 'Request failed');
    }
};

// Auth API
const authAPI = {
    register: async (userData) => {
        return apiRequest('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },
    login: async (credentials) => {
        return apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    },
    getMe: async () => {
        return apiRequest('/auth/me');
    }
};

// Books API
const booksAPI = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        return apiRequest(`/books${queryString ? `?${queryString}` : ''}`);
    },
    getById: async (id) => {
        return apiRequest(`/books/${id}`);
    },
    create: async (bookData) => {
        return apiRequest('/books', {
            method: 'POST',
            body: JSON.stringify(bookData)
        });
    },
    update: async (id, bookData) => {
        return apiRequest(`/books/${id}`, {
            method: 'PUT',
            body: JSON.stringify(bookData)
        });
    },
    delete: async (id) => {
        return apiRequest(`/books/${id}`, {
            method: 'DELETE'
        });
    }
};

// Reservations API
const reservationsAPI = {
    create: async (reservationData) => {
        return apiRequest('/reservations', {
            method: 'POST',
            body: JSON.stringify(reservationData)
        });
    },
    getMy: async (status) => {
        const query = status ? `?status=${status}` : '';
        return apiRequest(`/reservations/my${query}`);
    },
    getAll: async (status) => {
        const query = status ? `?status=${status}` : '';
        return apiRequest(`/reservations${query}`);
    },
    getById: async (id) => {
        return apiRequest(`/reservations/${id}`);
    },
    updateStatus: async (id, status, rejectionReason) => {
        return apiRequest(`/reservations/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, rejectionReason })
        });
    },
    cancel: async (id) => {
        return apiRequest(`/reservations/${id}/cancel`, {
            method: 'PUT'
        });
    }
};

// Reports API
const reportsAPI = {
    getDashboard: async () => {
        return apiRequest('/reports/dashboard');
    },
    getReservedToday: async () => {
        return apiRequest('/reports/reserved-today');
    },
    getIssued: async () => {
        return apiRequest('/reports/issued');
    },
    getOverdue: async () => {
        return apiRequest('/reports/overdue');
    },
    getActive: async () => {
        return apiRequest('/reports/active');
    }
};

