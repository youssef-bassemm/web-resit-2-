const express = require('express');
const {
  createAppointment,
  listAppointments,
} = require('../controllers/appointmentController.js');
const { verifyToken } = require('../controllers/authController.js');

const appointmentRouter = express.Router();

appointmentRouter.get('/', listAppointments);
appointmentRouter.post('/', verifyToken, createAppointment);

module.exports = appointmentRouter;
