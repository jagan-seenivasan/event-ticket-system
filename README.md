# Event Ticket System

A full-stack Event Ticket Booking System with:
- Backend: Node.js + Express
- MySQL: Users + Bookings (Sequelize)
- MongoDB: Events + Logs (Mongoose)
- Frontend: Angular 14

## Features
- Register/Login (JWT auth)
- View events (paginated)
- Book tickets
- My tickets (grouped by event, quantity aggregated)
- Admin: create events
- Admin: bookings list (grouped by user + event, shows lastBookedAt)

---

## Tech Stack
- Node.js, Express
- MySQL + Sequelize
- MongoDB + Mongoose
- Angular 14
- JWT Authentication

---

## Setup / Installation

### Prerequisites
- Node.js (v16+ recommended)
- MySQL Server running
- MongoDB running
- Angular CLI 14

---

## 1) Backend Setup

### Navigate
```bash
cd backend
npm install

### Environment File

Create .env in backend/:

PORT=4000

# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DB=event_ticket

# MongoDB
MONGO_URI=mongodb://localhost:27017/event_ticket

# JWT
JWT_SECRET=your_super_secret_key

MySQL Tables

Run schema script (provided in /sql/schema.sql)

Start Backend
npm run dev


Backend runs at:
http://localhost:4000

2) Frontend Setup
cd frontend
npm install
ng serve


Frontend runs at:
http://localhost:4200

Admin Access

To make a user ADMIN:

UPDATE users SET role='ADMIN' WHERE email='your-email@example.com';


Logout and login again to refresh JWT.

Admin Pages:

Create Event: /admin/events/new

Bookings: /admin/bookings

API Endpoints (Quick)
Auth

POST /api/auth/register

POST /api/auth/login

Events

GET /api/events?page=1&limit=10

POST /api/events (Admin)

Bookings

POST /api/bookings (User)

GET /api/bookings/me (User grouped by event)

Admin

GET /api/admin/bookings?page=1&limit=20 (Admin grouped by user+event)

##Design Decision

This project uses MySQL for transactional data (users/bookings) because it requires strong consistency and structured relations. MongoDB is used for flexible event metadata and logs where schema may evolve. The backend is structured into routes/controllers/models/middlewares for clear separation of concerns. Angular is organized into feature modules (Auth, Events, MyTickets, Admin) with a shared module for reusable UI and a core module for singleton services/interceptors, making the app scalable and maintainable.

### ✅ schema.sql (SQL Dump)

sql/schema.sql

```sql
CREATE DATABASE IF NOT EXISTS event_ticket;
USE event_ticket;

-- USERS
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('USER','ADMIN') DEFAULT 'USER',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  eventId VARCHAR(50) NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- Helpful index
CREATE INDEX idx_bookings_user_event ON bookings(userId, eventId);
