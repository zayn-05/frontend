# 📚 Library Management System - Frontend

A modern, responsive web application for managing a library system. This frontend connects to a Node.js/Express backend API with MongoDB.
## Frontend= https://zayn-05.github.io/frontend/

## Backend= https://backend-m123.onrender.com

## 🚀 Features

- **📋 Complete CRUD Operations**: Create, Read, Update, and Delete for Books, Members, and Loans
- **📊 Real-time Dashboard**: Statistics and quick actions overview
- **📱 Responsive Design**: Works on desktop, tablet, and mobile devices
- **🎨 Modern UI**: Clean, professional interface with smooth animations
- **✅ Form Validation**: Client-side validation with error messages
- **🔍 Search & Filter**: Search books and members, filter loans by status
- **📄 Pagination**: Handles large datasets efficiently
- **⚡ Fast Performance**: Optimized for quick loading and interactions

## 🔌 API Endpoints Used

This frontend interacts with the following backend API endpoints:

### 📖 Books
- `GET /api/books` - Get all books with pagination
- `GET /api/books/:id` - Get a specific book
- `POST /api/books` - Create a new book
- `PUT /api/books/:id` - Update a book
- `DELETE /api/books/:id` - Delete a book

### 👥 Members
- `GET /api/members` - Get all members with pagination
- `GET /api/members/:id` - Get a specific member
- `POST /api/members` - Create a new member
- `PUT /api/members/:id` - Update a member
- `DELETE /api/members/:id` - Delete a member

### 🔄 Loans
- `GET /api/loans` - Get all loans with pagination
- `POST /api/loans` - Create a new loan
- `PATCH /api/loans/:id/return` - Return a book (update loan status)

## 🛠️ Setup Instructions

### 1️⃣ **Backend Setup**:
   - Deploy your Node.js/Express backend to Render, Railway, or similar service
   - Ensure MongoDB Atlas is connected
   - Update the `API_BASE_URL` in `script.js` (line 2) with your backend URL

### 2️⃣ **Frontend Deployment**:
   - Upload all three files (index.html, style.css, script.js) to Netlify, Vercel, or GitHub Pages
   - No build process required - it's vanilla JS/HTML/CSS

### 3️⃣ **Configuration**:
   - Open `script.js` and replace `https://your-backend-api.onrender.com/api` with your actual backend API URL
   - Ensure CORS is properly configured on your backend to accept requests from your frontend domain

## 📁 Project Structure
library-frontend


├── 📄 index.html # Main HTML structure

├── 🎨 style.css # All CSS styles

├── ⚙️ script.js # JavaScript functionality

└── 📖 README.md # This documentation


## 💡 Key JavaScript Functions

### 🔗 API Communication
- `apiRequest()`: Generic function for making HTTP requests to the backend
- `showNotification()`: Display toast notifications for user feedback
- `showLoading()`/`hideLoading()`: Manage loading overlay

### 🗃️ Data Management
- `loadBooks()`: Fetch and display books from API
- `loadMembers()`: Fetch and display members from API
- `loadLoans()`: Fetch and display loans from API
- `loadDashboardData()`: Load statistics for dashboard

### 🖥️ UI Management
- `switchSection()`: Navigate between different app sections
- `renderBooksTable()`: Render books data in table format
- `renderPagination()`: Create pagination controls

## 🌐 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers

## 📦 Dependencies

- **Font Awesome 6.4.0 (CDN)** - Icons
- **Google Fonts (Poppins, Roboto Slab)** - Typography
- **No other external libraries** - Pure vanilla JavaScript

## 🚢 Deployment

### GitHub Pages Deployment:
1. **Create** a new GitHub repository
2. **Upload** all files
3. **Enable** GitHub Pages in repository settings
4. Your site will be live at `https://username.github.io/repository-name`

## 🔧 Troubleshooting

| Issue | Solution |
|-------|----------|
| **🔴 CORS Errors** | Ensure backend has CORS enabled and allows your frontend domain |
| **🔴 API Not Responding** | Check if backend is running and accessible |
| **🔴 Data Not Loading** | Verify API endpoints match your backend structure |
| **🔴 Forms Not Submitting** | Check browser console for validation errors |
| **🔴 Icons Not Showing** | Ensure internet connection for Font Awesome CDN |

## 📋 Testing Checklist

- [✅] **Books CRUD** operations work (Create, Read, Update, Delete)
- [✅] **Members CRUD** operations work
- [✅] **Loans can be created** and returned
- [✅] **Search functionality** works for books and members
- [✅] **Pagination** works correctly
- [✅] **Form validation** prevents invalid submissions
- [✅] **Mobile responsive** design works
- [✅] **Notifications** display properly


## 📊 Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript | User interface and interactions |
| **Styling** | CSS Grid, Flexbox, CSS Variables | Responsive layout and design |
| **Icons** | Font Awesome 6.4.0 | Visual elements and indicators |
| **Fonts** | Google Fonts (Poppins, Roboto Slab) | Typography and readability |
| **Backend** | Node.js, Express, MongoDB | API and data storage |
| **Deployment** | GitHub Pages (Frontend), Render (Backend) | Hosting and availability |

## 🎯 Project Goals

- ✅ **User-friendly interface** for library management
- ✅ **Real-time updates** without page refresh
- ✅ **Error handling** and user feedback
- ✅ **Responsive design** for all devices
- ✅ **Clean, maintainable code** structure
- ✅ **Professional appearance** suitable for production use

## 📞 Support

For questions or issues:
1. **Check** the browser console for errors
2. **Verify** API endpoints are correct
3. **Ensure** CORS is configured on backend
4. **Test** with different browsers

## 📄 License

This project is for educational purposes as part of a full-stack development demonstration.

## 👤 Author
   **Morly D. Granado**

**Library Management System** - Full Stack Project

## ⭐ Acknowledgments

- Icons by [Font Awesome](https://fontawesome.com)
- Fonts by [Google Fonts](https://fonts.google.com)
- Color palette inspired by modern admin dashboards

---

### Quick Start Summary

1. **Clone/Download** the three files
2. **Update** `API_BASE_URL` in `script.js`
3. **Upload** to Netlify/Vercel
4. **Test** all features
5. **Share** your deployed link

**🎉 Your library management system is ready!**

