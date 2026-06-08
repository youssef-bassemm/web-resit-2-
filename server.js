const { app } = require('./index.js');
const db_access = require('./db.js');
const db = db_access.db;

const PORT = 3000;

const seedDoctors = [
  ['Dr. Sarah Ahmed', 'General Practice', 'Mon-Fri 9am-5pm'],
  ['Dr. James Wilson', 'Cardiology', 'Tue-Thu 10am-4pm'],
  ['Dr. Maria Lopez', 'Dermatology', 'Mon-Wed-Fri 9am-3pm'],
  ['Dr. Omar Hassan', 'Pediatrics', 'Mon-Sat 8am-2pm'],
];

db.serialize(() => {
  db.run(db_access.createUserTable);
  db.run(db_access.createDoctorTable);
  db.run(db_access.createAppointmentTable);

  db.get('SELECT COUNT(*) as count FROM DOCTOR', (err, row) => {
    if (err || row.count > 0) return;

    const stmt = db.prepare(
      'INSERT INTO DOCTOR (NAME, SPECIALIZATION, AVAILABILITY) VALUES (?, ?, ?)'
    );
    seedDoctors.forEach((d) => stmt.run(d));
    stmt.finalize();
    console.log('Sample doctors added.');
  });
});

app.listen(PORT, () => {
  console.log(`MedCare Clinic running at http://localhost:${PORT}`);
});
