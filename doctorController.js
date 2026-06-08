const { db } = require('../db.js');

const createDoctor = (req, res) => {
  const name = req.body.name;
  const specialization = req.body.specialization;
  const availability = req.body.availability || 'Mon-Fri 9am-5pm';

  if (!name || !specialization) {
    return res.status(400).json({ message: 'Name and specialization are required' });
  }

  const query =
    'INSERT INTO DOCTOR (NAME, SPECIALIZATION, AVAILABILITY) VALUES (?, ?, ?)';

  db.run(query, [name, specialization, availability], function (err) {
    if (err) {
      return res.status(500).json({ message: 'Database error creating doctor' });
    }

    return res.status(201).json({
      id: this.lastID,
      name,
      specialization,
      availability,
    });
  });
};

const listDoctors = (req, res) => {
  db.all(
    'SELECT ID, NAME, SPECIALIZATION, AVAILABILITY FROM DOCTOR',
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: 'Error retrieving doctors' });
      }
      return res.status(200).json(rows);
    }
  );
};

module.exports = { createDoctor, listDoctors };
