# All In One Tour — Setup Guide

## Prerequisites
- Node.js v18+
- MySQL 8.0+ (XAMPP, WAMP, or standalone)

---

## 1. Database Setup

Open MySQL (phpMyAdmin or CLI) and run:

```sql
source server/db/schema.sql
```

Or paste the contents of `server/db/schema.sql` into phpMyAdmin's SQL tab.

This creates the `all_in_one_tour` database with all tables and a default admin user.

---

## 2. Configure Environment

Edit `server/.env` if needed:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=        ← your MySQL password (blank for XAMPP default)
DB_NAME=all_in_one_tour
JWT_SECRET=allinonetour_super_secret_jwt_key_2024_rwanda
```

---

## 3. Start the Backend (Express API)

```bash
cd server
npm run dev
# Runs on http://localhost:5000
```

---

## 4. Start the Frontend (React)

```bash
# In the root all-in-one-tour folder
npm run dev
# Runs on http://localhost:5173
```

---

## 5. Access the App

| URL | Description |
|-----|-------------|
| http://localhost:5173 | Public website |
| http://localhost:5173/login | User login |
| http://localhost:5173/register | User registration |
| http://localhost:5173/admin | Admin dashboard |

---

## Default Admin Credentials

| Field | Value |
|-------|-------|
| Email | admin@allinonetour.rw |
| Password | Admin@2024 |

**Change the password after first login!**

---

## Database Tables

| Table | Description |
|-------|-------------|
| `users` | Registered users + admins |
| `bookings` | Tour booking requests |
| `contact_messages` | Contact form submissions |
| `testimonials` | User reviews (require approval) |
| `activity_logs` | Login/register/action history |
