const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

const appointmentRouter = require('./routes/appointmentRoutes.js');
const { signUp, login } = require('./controllers/authController.js');
const { createDoctor, listDoctors } = require('./controllers/doctorController.js');
const { listMyAppointments } = require('./controllers/appointmentController.js');
const { verifyToken } = require('./controllers/authController.js');

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

app.get('/api/v1/doctors', listDoctors);
app.post('/api/v1/doctors', createDoctor);
app.post('/api/v1/auth/login', login);
app.post('/api/v1/auth/signup', signUp);
app.get('/api/v1/appointments/mine', verifyToken, listMyAppointments);

app.use('/api/v1/appointments', appointmentRouter);

app.use(express.static(path.join(__dirname, '..', 'public')));

module.exports = { app };
