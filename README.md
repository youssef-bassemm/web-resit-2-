# MedCare Clinic

A simple clinic booking website with user accounts, doctor listings, and online appointment reservations.

## Features

- User signup and login (JWT)
- Browse doctors and their specializations
- Book appointments (requires login)
- View your own appointments
- Doctor portal to add profiles and view bookings

## Tech Stack

- **Backend:** Node.js, Express, SQLite
- **Frontend:** HTML, CSS, JavaScript

## Setup

```bash
cd backend
npm install
npm start
```

Open http://localhost:3000 in your browser.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Create account |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/doctors` | List all doctors |
| POST | `/api/v1/doctors` | Add a doctor |
| GET | `/api/v1/appointments` | List appointments (optional `?doctorId=`) |
| GET | `/api/v1/appointments/mine` | Your appointments (requires token) |
| POST | `/api/v1/appointments` | Book appointment (requires token) |

## Pages

- `/` - Home
- `/login.html` - Login
- `/signup.html` - Sign up
- `/doctors.html` - Browse doctors
- `/book.html` - Book appointment
- `/appointments.html` - My appointments
- `/doctor.html` - Doctor portal

## Postman

Send JSON body with `Content-Type: application/json`.

**Login:**
```
POST http://localhost:3000/api/v1/auth/login
{ "email": "test@gmail.com", "password": "123456" }
```

**Book (add Authorization header with token):**
```
POST http://localhost:3000/api/v1/appointments
Authorization: Bearer <token>
{ "patientName": "John", "doctorId": 1, "appointmentDate": "2026-06-15", "appointmentTime": "10:00" }
```
