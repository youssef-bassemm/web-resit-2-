# MedCare Clinic — Full Project Guide

## What this project is

A clinic booking website. Patients sign up, log in, browse doctors, book appointments, and view their bookings. Staff use a doctor portal to add doctors and see appointments.

Everything runs on one server (port 3000):
- **Backend** — Node.js + Express + SQLite (APIs + database)
- **Frontend** — HTML/CSS/JS in the `public` folder

---

## Project structure

```
resit web/
├── backend/
│   ├── server.js          ← Start here (npm start)
│   ├── index.js           ← Express app, routes
│   ├── db.js              ← Database schemas
│   ├── clinic.db          ← SQLite file (auto-created)
│   ├── controllers/       ← Auth, doctors, appointments logic
│   └── routes/
│
├── public/
│   ├── index.html         ← Home
│   ├── login.html
│   ├── signup.html
│   ├── doctors.html
│   ├── book.html
│   ├── appointments.html
│   ├── doctor.html        ← Staff portal
│   ├── app.js             ← Shared API + login state
│   ├── doctor.js
│   └── styles.css
│
├── README.md
└── GUIDE.md               ← This file
```

---

## Database (SQLite)

File: `backend/clinic.db`

| Table | Purpose |
|-------|---------|
| USER | Accounts (email, hashed password, role) |
| DOCTOR | Name, specialization, availability |
| APPOINTMENT | Bookings linked to doctor and user |

4 sample doctors are added on first run.

---

## API endpoints

| Method | URL | Auth? | Description |
|--------|-----|-------|-------------|
| POST | `/api/v1/auth/signup` | No | Create account |
| POST | `/api/v1/auth/login` | No | Login, get JWT |
| GET | `/api/v1/doctors` | No | List doctors |
| POST | `/api/v1/doctors` | No | Add doctor |
| GET | `/api/v1/appointments` | No | List all (`?doctorId=1` optional) |
| GET | `/api/v1/appointments/mine` | Yes | Your appointments |
| POST | `/api/v1/appointments` | Yes | Book appointment |

Protected routes need header: `Authorization: Bearer <token>`

---

## How to run

### Prerequisites
- Node.js installed (`node -v`, `npm -v`)

### First time
```bash
cd backend
npm install
npm start
```

### Every time
```bash
cd backend
npm start
```

Open **http://localhost:3000**

Stop server: `Ctrl + C`

### Dev mode (auto-restart on changes)
```bash
cd backend
npm run dev
```

---

## User flow (website)

1. Sign up at `/signup.html`
2. Browse doctors at `/doctors.html`
3. Book at `/book.html` (login required)
4. View bookings at `/appointments.html`

Token is stored in browser `localStorage` (`clinic_token`, `clinic_user`).

---

## Postman testing

### Sign up
```
POST http://localhost:3000/api/v1/auth/signup
Content-Type: application/json

{ "email": "test@gmail.com", "password": "123456" }
```

### Login
```
POST http://localhost:3000/api/v1/auth/login
Content-Type: application/json

{ "email": "test@gmail.com", "password": "123456" }
```
Copy the `token` from the response.

### List doctors
```
GET http://localhost:3000/api/v1/doctors
```

### Book appointment
```
POST http://localhost:3000/api/v1/appointments
Content-Type: application/json
Authorization: Bearer <token>

{
  "patientName": "John",
  "doctorId": 1,
  "appointmentDate": "2026-06-15",
  "appointmentTime": "10:00"
}
```

### My appointments
```
GET http://localhost:3000/api/v1/appointments/mine
Authorization: Bearer <token>
```

---

## Debugging

### Server won't start
- Run from `backend` folder
- Run `npm install` first
- Port 3000 in use? Check with: `netstat -ano | findstr :3000`

### 404 on API
- Server must be running (`npm start`)
- URL must be `http://localhost:3000/api/v1/...`
- Use correct HTTP method (POST vs GET)

### 403 "Please log in first"
- Add `Authorization: Bearer <token>` header
- Get token from login/signup first

### Frontend issues
- F12 → Console (JS errors)
- F12 → Network (failed API calls in red)
- F12 → Application → Local Storage (check `clinic_token` after login)

### Reset database (fresh start)
Stop server, then:
```bash
cd backend
del clinic.db
npm start
```
This deletes all users and appointments and re-seeds doctors.

### View database
Open `backend/clinic.db` with [DB Browser for SQLite](https://sqlitebrowser.org/).

### Backend logs
Watch the terminal where `npm start` is running. Add `console.log()` in controllers to debug.

---

## What to edit

| Goal | File |
|------|------|
| API logic | `backend/controllers/*.js` |
| Routes | `backend/index.js` |
| Database | `backend/db.js`, `backend/server.js` |
| Page layout | `public/*.html` |
| Styling | `public/styles.css` |
| Login/booking JS | `public/app.js` |
| Port number | `backend/server.js` → `PORT` |

---

## Quick checklist

1. `cd backend`
2. `npm install` (once)
3. `npm start`
4. Open http://localhost:3000
5. Sign up → Book → My Appointments
6. Postman: login → book with token
