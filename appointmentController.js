const { db } = require('../db.js');

const createAppointment = (req, res) => {
  const doctorId = req.body.doctorId;
  const patientName = req.body.patientName;
  const appointmentDate = req.body.appointmentDate;
  const appointmentTime = req.body.appointmentTime;
  const userId = req.user ? req.user.id : null;

  if (!doctorId || !patientName || !appointmentDate || !appointmentTime) {
    return res.status(400).json({
      message: 'Doctor, name, date and time are required',
    });
  }

  const query = `
    INSERT INTO APPOINTMENT (DOCTOR_ID, USER_ID, PATIENT_NAME, APPOINTMENT_DATE, APPOINTMENT_TIME)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [doctorId, userId, patientName, appointmentDate, appointmentTime],
    function (err) {
      if (err) {
        return res.status(500).json({ message: 'Database error creating appointment' });
      }

      return res.status(201).json({
        id: this.lastID,
        doctorId,
        patientName,
        appointmentDate,
        appointmentTime,
      });
    }
  );
};

const listAppointments = (req, res) => {
  const doctorId = req.query.doctorId;

  let query = `
    SELECT
      APPOINTMENT.ID,
      APPOINTMENT.DOCTOR_ID,
      APPOINTMENT.PATIENT_NAME,
      APPOINTMENT.APPOINTMENT_DATE,
      APPOINTMENT.APPOINTMENT_TIME,
      DOCTOR.NAME as DOCTOR_NAME,
      DOCTOR.SPECIALIZATION
    FROM APPOINTMENT
    JOIN DOCTOR ON DOCTOR.ID = APPOINTMENT.DOCTOR_ID
  `;

  const params = [];
  if (doctorId) {
    query += ' WHERE APPOINTMENT.DOCTOR_ID = ?';
    params.push(doctorId);
  }

  query += ' ORDER BY APPOINTMENT.APPOINTMENT_DATE, APPOINTMENT.APPOINTMENT_TIME';

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving appointments' });
    }
    return res.status(200).json(rows);
  });
};

const listMyAppointments = (req, res) => {
  const query = `
    SELECT
      APPOINTMENT.ID,
      APPOINTMENT.PATIENT_NAME,
      APPOINTMENT.APPOINTMENT_DATE,
      APPOINTMENT.APPOINTMENT_TIME,
      DOCTOR.NAME as DOCTOR_NAME,
      DOCTOR.SPECIALIZATION
    FROM APPOINTMENT
    JOIN DOCTOR ON DOCTOR.ID = APPOINTMENT.DOCTOR_ID
    WHERE APPOINTMENT.USER_ID = ?
    ORDER BY APPOINTMENT.APPOINTMENT_DATE, APPOINTMENT.APPOINTMENT_TIME
  `;

  db.all(query, [req.user.id], (err, rows) => {
    if (err) {
      return res.status(500).json({ message: 'Error retrieving your appointments' });
    }
    return res.status(200).json(rows);
  });
};

module.exports = { createAppointment, listAppointments, listMyAppointments };
