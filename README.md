# 🚀 Dynamic Role & Permission Management System (MERN Stack)

A full-featured **Dynamic Role-Based Access Control (RBAC)** system built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js).  
This project allows **admins** to dynamically create, assign, and manage **roles and permissions** directly from an admin dashboard — without hardcoding anything.

---

## 🧩 Overview

Modern web applications need flexible authorization systems. This project provides a **fully dynamic, scalable, and secure** way to handle:

- Users (with login/logout)  
- Roles (like Admin, Manager, Editor, etc.)  
- Permissions (like `user.create`, `post.view`, `role.delete`, etc.)  
- Dynamic access control at both frontend and backend levels  

You can integrate this into any MERN project to make it **enterprise-grade**, ensuring a secure and maintainable structure for large-scale applications.

---

## ⚙️ Tech Stack

**Frontend:**
- React.js (with Hooks)  
- Tailwind CSS (modern UI styling)  
- Axios (for API communication)  
- React Router DOM (for navigation)  
- Context API for Auth & Permissions  

**Backend:**
- Node.js  
- Express.js  
- MongoDB + Mongoose  
- bcrypt (for password hashing)  
- JWT Authentication (token-based)  
- Cookie-based session handling  

---

## 🧠 Core Concepts

### 1. Dynamic Roles
Roles are fully dynamic. Admins can create new roles directly from the dashboard (e.g., "Teacher", "Accountant", "Student").  
Each role can have multiple permissions attached dynamically, making it flexible to handle any organization structure.

### 2. Granular Permissions
Permissions define what users can perform (e.g., `user.create`, `post.view`, `role.edit`).  
This allows admins to **control access at a fine-grained level**, avoiding hardcoding and making the system maintainable.

### 3. User Management
- Admins can create, update, delete, or assign roles to users.  
- Each user can have multiple roles.  
- Role permissions merge dynamically, allowing **real-time access updates**.

### 4. Frontend Control
Menus, buttons, and routes are conditionally rendered based on the logged-in user's permissions.  

## 🧰 Features

### ✅ Authentication
- Register, Login, Logout  
- JWT-based authentication with token versioning  
- `/users/me` endpoint for retrieving logged-in user data  

### ✅ Authorization
- Middleware ensures backend routes are protected based on permissions  
- Frontend UI is dynamically rendered according to permissions  

### ✅ Role & Permission Management
- Create, edit, delete roles and permissions  
- Assign or revoke permissions in real-time  
- Users’ access updates automatically when roles change  

### ✅ User Dashboard
- Create, edit, delete users  
- Assign multiple roles dynamically  
- Secure password handling with bcrypt  

### ✅ Posts CRUD Example
- Shows permission enforcement in practice  
- Only users with proper permissions can create or edit posts  

### ✅ Logout System
- Cookie-based secure logout  
- Clears tokens and resets auth context  
- Redirects users to login page  

---

## 🔐 Authentication Flow

1. **Login:** Backend validates credentials and issues JWT cookies.  
2. **User Info:** `/users/me` endpoint returns current user info, roles, and permissions.  
3. **Frontend Context:** Stores user data and dynamically renders menus.  
4. **Logout:** Clears cookies and resets the auth state.  
## 🎨 UI Overview

- **Sidebar:** Responsive Tailwind menu showing only allowed routes.  
- **Dashboard:** Clean layout with dynamic content based on permissions.  
- **Role Manager:** Visual interface to assign and revoke permissions.  
- **User Manager:** Assign multiple roles using checkboxes.  
- **Posts CRUD Page:** Demonstrates practical permission enforcement.  

---

## 🌟 Benefits & Advantages

- **Highly Scalable:** Supports multiple roles per user and dynamic permission assignment.  
- **Secure:** JWT-based authentication with password hashing and token versioning.  
- **Flexible:** Admins can add new roles or permissions anytime without changing backend code.  
- **Maintainable:** Centralized permission system reduces redundancy and complexity.  
- **Frontend-Integrated Control:** Menus, buttons, and pages adjust dynamically according to user permissions.  
- **Enterprise-Ready:** Can handle complex organizational structures with multiple layers of roles and permissions.  
- **Real-Time Updates:** Role changes immediately reflect across the system for all users.  
- **Easy to Extend:** New features like audit logs, two-factor authentication, or hierarchy can be added without breaking existing logic.  
- **Professional UI:** Tailwind-based, responsive, and clean interface for admin dashboards.  
- **Educational:** Demonstrates modern MERN stack best practices and RBAC implementation.  

