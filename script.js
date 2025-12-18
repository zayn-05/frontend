// Configuration
const DEFAULT_API_URL = 'https://backend-m123.onrender.com/api';
let API_BASE_URL = localStorage.getItem('apiBaseUrl') || DEFAULT_API_URL;
let currentPage = 1;
const itemsPerPage = 10;

// DOM Elements
const elements = {
    apiBaseUrl: document.getElementById('api-base-url'),
    apiStatus: document.getElementById('api-status'),
    apiStatusDetailed: document.getElementById('api-status-detailed'),
    currentApi: document.getElementById('current-api'),
    navLinks: document.querySelectorAll('.nav-link'),
    contentSections: document.querySelectorAll('.content-section'),
    formTabs: document.querySelectorAll('.form-tab'),
    creationForms: document.querySelectorAll('.creation-form'),
    
    // Books
    booksTableBody: document.getElementById('books-table-body'),
    refreshBooksBtn: document.getElementById('refresh-books'),
    bookSearch: document.getElementById('book-search'),
    prevPageBtn: document.getElementById('prev-page'),
    nextPageBtn: document.getElementById('next-page'),
    pageInfo: document.getElementById('page-info'),
    booksCount: document.getElementById('books-count'),
    
    // Members
    membersTableBody: document.getElementById('members-table-body'),
    refreshMembersBtn: document.getElementById('refresh-members'),
    
    // Loans
    loansTableBody: document.getElementById('loans-table-body'),
    refreshLoansBtn: document.getElementById('refresh-loans'),
    
    // Forms
    bookForm: document.getElementById('book-form'),
    memberForm: document.getElementById('member-form'),
    loanForm: document.getElementById('loan-form'),
    
    // Modal
    editModal: document.getElementById('edit-modal'),
    modalTitle: document.getElementById('modal-title'),
    editForm: document.getElementById('edit-form'),
    updateRecordBtn: document.getElementById('update-record'),
    deleteRecordBtn: document.getElementById('delete-record'),
    modalCloseBtn: document.querySelector('.modal-close'),
    
    // Notification
    notification: document.getElementById('notification'),
    notificationText: document.getElementById('notification-text'),
    
    // Config
    saveConfigBtn: document.getElementById('save-config')
};

// Initialize application
function init() {
    updateAPIConfigDisplay();
    checkAPIStatus();
    
    setupEventListeners();
    loadBooks();
    loadMembers();
    loadLoans();
    
    // Initialize date picker for loan form
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 7);
    document.getElementById('due-date').valueAsDate = tomorrow;
}

// Event Listeners Setup
function setupEventListeners() {
    // Navigation
    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            switchSection(section);
            
            // Update active nav link
            elements.navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Form Tabs
    elements.formTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const formId = tab.dataset.form;
            
            // Update active tab
            elements.formTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            elements.creationForms.forEach(form => {
                form.classList.remove('active-form');
                if (form.id === formId) {
                    form.classList.add('active-form');
                }
            });
        });
    });

    // Refresh Buttons
    elements.refreshBooksBtn?.addEventListener('click', () => {
        loadBooks();
        showNotification('Books refreshed successfully');
    });
    
    elements.refreshMembersBtn?.addEventListener('click', () => {
        loadMembers();
        showNotification('Members refreshed successfully');
    });
    
    elements.refreshLoansBtn?.addEventListener('click', () => {
        loadLoans();
        showNotification('Loans refreshed successfully');
    });

    // Book Search
    elements.bookSearch?.addEventListener('input', debounce((e) => {
        const searchTerm = e.target.value.toLowerCase();
        filterBooks(searchTerm);
    }, 300));

    // Pagination
    elements.prevPageBtn?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadBooks();
        }
    });
    
    elements.nextPageBtn?.addEventListener('click', () => {
        currentPage++;
        loadBooks();
    });

    // Forms Submission
    elements.bookForm?.addEventListener('submit', handleBookCreate);
    elements.memberForm?.addEventListener('submit', handleMemberCreate);
    elements.loanForm?.addEventListener('submit', handleLoanCreate);

    // Modal
    elements.modalCloseBtn?.addEventListener('click', () => {
        elements.editModal.style.display = 'none';
    });
    
    elements.updateRecordBtn?.addEventListener('click', handleUpdateRecord);
    elements.deleteRecordBtn?.addEventListener('click', handleDeleteRecord);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === elements.editModal) {
            elements.editModal.style.display = 'none';
        }
    });

    // Configuration
    elements.saveConfigBtn?.addEventListener('click', saveAPIConfig);

    // Populate selects for loan form
    populateMemberSelect();
    populateBookSelect();
}

// Section Switching
function switchSection(section) {
    elements.contentSections.forEach(sec => {
        sec.classList.remove('active');
        if (sec.id === `${section}-section`) {
            sec.classList.add('active');
        }
    });
}

// API Configuration
function updateAPIConfigDisplay() {
    elements.apiBaseUrl.value = API_BASE_URL;
    elements.currentApi.textContent = API_BASE_URL;
}

async function checkAPIStatus() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        const status = response.ok ? 'online' : 'error';
        updateAPIStatus(status);
    } catch (error) {
        updateAPIStatus('offline');
    }
}

function updateAPIStatus(status) {
    const statusIndicator = document.querySelector('.status-indicator');
    
    switch (status) {
        case 'online':
            statusIndicator.className = 'status-indicator online';
            elements.apiStatus.textContent = 'API Online';
            elements.apiStatusDetailed.textContent = 'Connected successfully';
            break;
        case 'offline':
            statusIndicator.className = 'status-indicator offline';
            elements.apiStatus.textContent = 'API Offline';
            elements.apiStatusDetailed.textContent = 'Cannot connect to backend';
            break;
        default:
            statusIndicator.className = 'status-indicator offline';
            elements.apiStatus.textContent = 'API Error';
            elements.apiStatusDetailed.textContent = 'Server error occurred';
    }
}

function saveAPIConfig() {
    const newUrl = elements.apiBaseUrl.value.trim();
    if (newUrl && newUrl !== API_BASE_URL) {
        API_BASE_URL = newUrl;
        localStorage.setItem('apiBaseUrl', newUrl);
        updateAPIConfigDisplay();
        checkAPIStatus();
        
        // Reload data with new API
        loadBooks();
        loadMembers();
        loadLoans();
        
        showNotification('API configuration saved successfully');
    }
}

// Books Management
async function loadBooks() {
    try {
        elements.booksTableBody.innerHTML = '<tr><td colspan="5" class="loading">Loading books...</td></tr>';
        
        const response = await fetch(`${API_BASE_URL}/books?page=${currentPage}&limit=${itemsPerPage}`);
        const books = await response.json();
        
        renderBooksTable(books);
        updatePaginationInfo();
    } catch (error) {
        elements.booksTableBody.innerHTML = '<tr><td colspan="5" style="color: #ff3366;">Error loading books. Check API configuration.</td></tr>';
        console.error('Error loading books:', error);
    }
}

function renderBooksTable(books) {
    if (!books || books.length === 0) {
        elements.booksTableBody.innerHTML = '<tr><td colspan="5">No books found</td></tr>';
        return;
    }
    
    elements.booksTableBody.innerHTML = books.map(book => `
        <tr>
            <td><code>${book.isbn}</code></td>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>
                <span class="status-badge ${book.copies > 0 ? 'status-active' : 'status-overdue'}">
                    ${book.copies} ${book.copies === 1 ? 'copy' : 'copies'}
                </span>
            </td>
            <td>
                <button class="btn btn-action" onclick="editBook('${book._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-action" onclick="deleteBook('${book._id}', '${book.title}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

async function handleBookCreate(e) {
    e.preventDefault();
    
    const bookData = {
        isbn: document.getElementById('isbn').value.trim(),
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        copies: parseInt(document.getElementById('copies').value)
    };
    
    // Validation
    if (!validateBookData(bookData)) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        
        if (response.ok) {
            const book = await response.json();
            showNotification(`Book "${book.title}" created successfully`);
            resetForm(elements.bookForm);
            loadBooks();
        } else {
            const error = await response.json();
            showNotification(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        showNotification('Error creating book', 'error');
        console.error(error);
    }
}

async function editBook(bookId) {
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const book = await response.json();
        
        elements.modalTitle.textContent = `Edit Book: ${book.title}`;
        elements.editForm.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label for="edit-isbn">ISBN</label>
                    <input type="text" id="edit-isbn" value="${book.isbn}" required>
                </div>
                <div class="form-group">
                    <label for="edit-title">Title</label>
                    <input type="text" id="edit-title" value="${book.title}" required>
                </div>
                <div class="form-group">
                    <label for="edit-author">Author</label>
                    <input type="text" id="edit-author" value="${book.author}" required>
                </div>
                <div class="form-group">
                    <label for="edit-copies">Copies</label>
                    <input type="number" id="edit-copies" value="${book.copies}" required min="0">
                </div>
            </div>
            <input type="hidden" id="edit-id" value="${book._id}">
            <input type="hidden" id="edit-type" value="book">
        `;
        
        elements.editModal.style.display = 'flex';
    } catch (error) {
        console.error('Error loading book:', error);
    }
}

// Members Management
async function loadMembers() {
    try {
        elements.membersTableBody.innerHTML = '<tr><td colspan="5" class="loading">Loading members...</td></tr>';
        
        const response = await fetch(`${API_BASE_URL}/members`);
        const members = await response.json();
        
        renderMembersTable(members);
    } catch (error) {
        elements.membersTableBody.innerHTML = '<tr><td colspan="5" style="color: #ff3366;">Error loading members</td></tr>';
    }
}

function renderMembersTable(members) {
    elements.membersTableBody.innerHTML = members.map(member => `
        <tr>
            <td><code>${member._id.substring(0, 8)}...</code></td>
            <td><strong>${member.name}</strong></td>
            <td>${member.email}</td>
            <td>${new Date(member.joinedAt).toLocaleDateString()}</td>
            <td>
                <button class="btn btn-action" onclick="editMember('${member._id}')">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn btn-action" onclick="deleteMember('${member._id}', '${member.name}')">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        </tr>
    `).join('');
}

async function handleMemberCreate(e) {
    e.preventDefault();
    
    const memberData = {
        name: document.getElementById('member-name').value.trim(),
        email: document.getElementById('member-email').value.trim()
    };
    
    if (!validateMemberData(memberData)) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(memberData)
        });
        
        if (response.ok) {
            const member = await response.json();
            showNotification(`Member "${member.name}" created successfully`);
            resetForm(elements.memberForm);
            loadMembers();
            populateMemberSelect();
        } else {
            const error = await response.json();
            showNotification(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        showNotification('Error creating member', 'error');
    }
}

async function editMember(memberId) {
    try {
        const response = await fetch(`${API_BASE_URL}/members/${memberId}`);
        const member = await response.json();
        
        elements.modalTitle.textContent = `Edit Member: ${member.name}`;
        elements.editForm.innerHTML = `
            <div class="form-grid">
                <div class="form-group">
                    <label for="edit-name">Name</label>
                    <input type="text" id="edit-name" value="${member.name}" required>
                </div>
                <div class="form-group">
                    <label for="edit-email">Email</label>
                    <input type="email" id="edit-email" value="${member.email}" required>
                </div>
            </div>
            <input type="hidden" id="edit-id" value="${member._id}">
            <input type="hidden" id="edit-type" value="member">
        `;
        
        elements.editModal.style.display = 'flex';
    } catch (error) {
        console.error('Error loading member:', error);
    }
}

// Loans Management
async function loadLoans() {
    try {
        elements.loansTableBody.innerHTML = '<tr><td colspan="7" class="loading">Loading loans...</td></tr>';
        
        const response = await fetch(`${API_BASE_URL}/loans`);
        const loans = await response.json();
        
        renderLoansTable(loans);
    } catch (error) {
        elements.loansTableBody.innerHTML = '<tr><td colspan="7" style="color: #ff3366;">Error loading loans</td></tr>';
    }
}

function renderLoansTable(loans) {
    elements.loansTableBody.innerHTML = loans.map(loan => {
        const dueDate = new Date(loan.dueAt);
        const returned = loan.returnedAt;
        const isOverdue = !returned && dueDate < new Date();
        
        let statusClass = 'status-active';
        let statusText = 'Active';
        
        if (returned) {
            statusClass = 'status-returned';
            statusText = 'Returned';
        } else if (isOverdue) {
            statusClass = 'status-overdue';
            statusText = 'Overdue';
        }
        
        return `
            <tr>
                <td><code>${loan._id.substring(0, 8)}...</code></td>
                <td>${loan.memberId?.name || 'Unknown'}</td>
                <td>${loan.bookId?.title || 'Unknown'}</td>
                <td>${new Date(loan.loanedAt).toLocaleDateString()}</td>
                <td>${dueDate.toLocaleDateString()}</td>
                <td>
                    <span class="status-badge ${statusClass}">
                        <i class="fas ${returned ? 'fa-check-circle' : isOverdue ? 'fa-exclamation-circle' : 'fa-clock'}"></i>
                        ${statusText}
                    </span>
                </td>
                <td>
                    ${!returned ? `
                        <button class="btn btn-action" onclick="returnBook('${loan._id}')">
                            <i class="fas fa-undo"></i> Return
                        </button>
                    ` : ''}
                    <button class="btn btn-action" onclick="deleteLoan('${loan._id}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

async function handleLoanCreate(e) {
    e.preventDefault();
    
    const loanData = {
        memberId: document.getElementById('loan-member').value,
        bookId: document.getElementById('loan-book').value,
        dueAt: document.getElementById('due-date').value
    };
    
    if (!validateLoanData(loanData)) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/loans`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loanData)
        });
        
        if (response.ok) {
            const loan = await response.json();
            showNotification('Loan created successfully');
            resetForm(elements.loanForm);
            loadLoans();
        } else {
            const error = await response.json();
            showNotification(`Error: ${error.message}`, 'error');
        }
    } catch (error) {
        showNotification('Error creating loan', 'error');
    }
}

// Form Handlers
async function handleUpdateRecord() {
    const id = document.getElementById('edit-id').value;
    const type = document.getElementById('edit-type').value;
    
    let updateData = {};
    
    if (type === 'book') {
        updateData = {
            isbn: document.getElementById('edit-isbn').value,
            title: document.getElementById('edit-title').value,
            author: document.getElementById('edit-author').value,
            copies: parseInt(document.getElementById('edit-copies').value)
        };
    } else if (type === 'member') {
        updateData = {
            name: document.getElementById('edit-name').value,
            email: document.getElementById('edit-email').value
        };
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/${type}s/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
        });
        
        if (response.ok) {
            showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
            elements.editModal.style.display = 'none';
            
            // Refresh data
            if (type === 'book') loadBooks();
            if (type === 'member') loadMembers();
            if (type === 'loan') loadLoans();
        }
    } catch (error) {
        showNotification('Error updating record', 'error');
    }
}

async function handleDeleteRecord() {
    const id = document.getElementById('edit-id').value;
    const type = document.getElementById('edit-type').value;
    
    if (confirm(`Are you sure you want to delete this ${type}?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/${type}s/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`);
                elements.editModal.style.display = 'none';
                
                // Refresh data
                if (type === 'book') loadBooks();
                if (type === 'member') loadMembers();
                if (type === 'loan') loadLoans();
            }
        } catch (error) {
            showNotification('Error deleting record', 'error');
        }
    }
}

// Helper Functions
function validateBookData(data) {
    let isValid = true;
    
    if (!data.isbn) {
        showError('isbn-error', 'ISBN is required');
        isValid = false;
    }
    
    if (!data.title) {
        showError('title-error', 'Title is required');
        isValid = false;
    }
    
    if (!data.author) {
        showError('author-error', 'Author is required');
        isValid = false;
    }
    
    if (data.copies < 0) {
        showError('copies-error', 'Copies cannot be negative');
        isValid = false;
    }
    
    return isValid;
}

function validateMemberData(data) {
    let isValid = true;
    
    if (!data.name) {
        showError('member-name-error', 'Name is required');
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        showError('member-email-error', 'Valid email is required');
        isValid = false;
    }
    
    return isValid;
}

function validateLoanData(data) {
    let isValid = true;
    
    if (!data.memberId) {
        showError('loan-member-error', 'Member is required');
        isValid = false;
    }
    
    if (!data.bookId) {
        showError('loan-book-error', 'Book is required');
        isValid = false;
    }
    
    if (!data.dueAt) {
        showError('due-date-error', 'Due date is required');
        isValid = false;
    }
    
    return isValid;
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        setTimeout(() => {
            element.textContent = '';
        }, 3000);
    }
}

function resetForm(form) {
    form.reset();
    // Reset specific fields
    if (form.id === 'loan-form') {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 7);
        document.getElementById('due-date').valueAsDate = tomorrow;
    }
}

function showNotification(message, type = 'success') {
    elements.notificationText.textContent = message;
    elements.notification.className = 'notification';
    elements.notification.classList.add('show');
    
    if (type === 'error') {
        elements.notification.style.background = 'linear-gradient(135deg, #ff3366, #cc0044)';
    }
    
    setTimeout(() => {
        elements.notification.classList.remove('show');
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function updatePaginationInfo() {
    elements.pageInfo.textContent = `Page ${currentPage}`;
}

function filterBooks(searchTerm) {
    const rows = elements.booksTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
}

// Select Population
async function populateMemberSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/members`);
        const members = await response.json();
        const select = document.getElementById('loan-member');
        
        select.innerHTML = '<option value="">Select a member</option>';
        members.forEach(member => {
            select.innerHTML += `<option value="${member._id}">${member.name} (${member.email})</option>`;
        });
    } catch (error) {
        console.error('Error loading members for select:', error);
    }
}

async function populateBookSelect() {
    try {
        const response = await fetch(`${API_BASE_URL}/books`);
        const books = await response.json();
        const select = document.getElementById('loan-book');
        
        select.innerHTML = '<option value="">Select a book</option>';
        books.forEach(book => {
            if (book.copies > 0) {
                select.innerHTML += `<option value="${book._id}">${book.title} by ${book.author}</option>`;
            }
        });
    } catch (error) {
        console.error('Error loading books for select:', error);
    }
}

// Delete Functions (for inline onclick)
async function deleteBook(id, title) {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/books/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showNotification('Book deleted successfully');
                loadBooks();
            }
        } catch (error) {
            showNotification('Error deleting book', 'error');
        }
    }
}

async function deleteMember(id, name) {
    if (confirm(`Are you sure you want to delete member "${name}"?`)) {
        try {
            const response = await fetch(`${API_BASE_URL}/members/${id}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                showNotification('Member deleted successfully');
                loadMembers();
                populateMemberSelect();
            }
        } catch (error) {
            showNotification('Error deleting member', 'error');
        }
    }
}

async function returnBook(loanId) {
    try {
        const response = await fetch(`${API_BASE_URL}/loans/${loanId}/return`, {
            method: 'PUT'
        });
        
        if (response.ok) {
            showNotification('Book returned successfully');
            loadLoans();
        }
    } catch (error) {
        showNotification('Error returning book', 'error');
    }
}

async function deleteLoan(loanId) {
    if (confirm('Are you sure you want to delete this loan record?')) {
        try {
            // Note: You'll need to add a DELETE endpoint for loans in your backend
            showNotification('Loan deletion not implemented in this demo', 'error');
        } catch (error) {
            showNotification('Error deleting loan', 'error');
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', init);