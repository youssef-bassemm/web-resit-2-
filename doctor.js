const doctorForm = document.getElementById('doctor-form');
const doctorSelect = document.getElementById('doctor-select');
const loadApptsBtn = document.getElementById('load-appts-btn');
const apptList = document.getElementById('appt-list');

doctorForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const msg = document.getElementById('doctor-msg');

  const res = await api('/api/v1/doctors', {
    method: 'POST',
    body: JSON.stringify({
      name: document.getElementById('doctor-name').value.trim(),
      specialization: document.getElementById('doctor-specialization').value.trim(),
      availability: document.getElementById('doctor-availability').value.trim() || 'Mon-Fri 9am-5pm',
    }),
  });

  if (res.status === 201) {
    showMessage(msg, 'Doctor profile saved.', false);
    doctorForm.reset();
    loadDoctorList();
  } else {
    showMessage(msg, res.data.message || 'Could not save doctor.', true);
  }
});

async function loadDoctorList() {
  const res = await api('/api/v1/doctors');
  if (res.status !== 200 || !Array.isArray(res.data)) return;

  doctorSelect.innerHTML = '<option value="">-- Select a doctor --</option>';
  res.data.forEach((doc) => {
    const opt = document.createElement('option');
    opt.value = doc.ID;
    opt.textContent = `${doc.NAME} (${doc.SPECIALIZATION})`;
    doctorSelect.appendChild(opt);
  });
}

loadApptsBtn.addEventListener('click', async () => {
  const msg = document.getElementById('appt-msg');
  const doctorId = doctorSelect.value;

  if (!doctorId) {
    return showMessage(msg, 'Please select a doctor.', true);
  }

  const res = await api(`/api/v1/appointments?doctorId=${doctorId}`);
  apptList.innerHTML = '';

  if (res.status !== 200 || !Array.isArray(res.data)) {
    return showMessage(msg, 'Could not load appointments.', true);
  }

  if (!res.data.length) {
    apptList.innerHTML = '<p class="empty-state">No appointments for this doctor.</p>';
    return;
  }

  apptList.innerHTML = res.data.map((a) => `
    <li>
      <div>
        <span class="date">${a.APPOINTMENT_DATE} at ${a.APPOINTMENT_TIME}</span>
        <p class="doctor">Patient: ${a.PATIENT_NAME}</p>
      </div>
    </li>
  `).join('');

  showMessage(msg, `${res.data.length} appointment(s) found.`, false);
});

loadDoctorList();
