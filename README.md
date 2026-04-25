# Event Management System 🚀

A robust, role-based Event Management System built with Node.js, Express, and MongoDB. This project has undergone a comprehensive security audit and hardening process to ensure it is production-ready.

**Live Demo:** [https://event-management-system-production-2034.up.railway.app](https://event-management-system-production-2034.up.railway.app)

---

## 🛠 Features

- **Role-Based Access Control**: Separate dashboards for Admins and regular Users.
- **Event Management**: Admins can create, view, and delete events.
- **Event Booking**: Users can browse and register for available events.
- **Persistent Sessions**: Logins stay active even after server restarts using MongoDB session storage.
- **Responsive Design**: Styled with Tailwind CSS for a modern, clean UI.

---

## 🛡 Security Hardening (Audit Results)

This project has been specifically hardened against common web vulnerabilities:

- **Authentication**: Uses `bcrypt` for secure password hashing (replacing legacy `sha256`).
- **CSRF Protection**: Integrated `csurf` to prevent Cross-Site Request Forgery.
- **Rate Limiting**: Protects against brute-force and DoS attacks using `express-rate-limit`.
- **NoSQL Injection**: Sanitizes all user inputs using `express-mongo-sanitize`.
- **Security Headers**: Implemented `helmet` to set secure HTTP headers (XSS, Clickjacking protection).
- **Express 5 Optimized**: Custom shims for compatibility with the latest Express 5 features.
- **Error Handling**: Production-grade global error handler that prevents information leakage.

---

## 💻 Tech Stack

- **Backend**: Node.js, Express 5
- **Database**: MongoDB (Mongoose ODM)
- **Templating**: EJS
- **Styling**: Tailwind CSS
- **Session Management**: `express-session` + `connect-mongo`

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Node.js installed
- MongoDB (Local or Atlas)

### 2. Environment Variables
Create a `.env` file in the root directory:
```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_random_secret_string
NODE_ENV=development
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Build CSS (Tailwind)
```bash
npm run build:css
```

### 5. Run the App
```bash
# Development mode
npm run dev

# Production mode
npm start
```

---

## 📜 Scripts
- `npm run dev`: Starts the server with `nodemon`.
- `npm start`: Starts the server in production mode using `cross-env`.
- `npm run build:css`: Compiles Tailwind CSS for production.
- `npm run watch:css`: Watches for CSS changes during development.

---

## 📄 License
This project is licensed under the ISC License.