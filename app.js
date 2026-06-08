const TOKEN_KEY = 'clinic_token';
const USER_KEY = 'clinic_user';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

function saveSession(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

function isLoggedIn() {
  return !!getToken();
}

async function api(path, options = {}) {
  const token = getToken();
  const res = await fetch(path, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  try {
    return { status: res.status, data: JSON.parse(text) };
  } catch {
    return { status: res.status, data: text };
  }
}

function showMessage(el, msg, isError) {
  el.textContent = msg;
  el.className = 'message ' + (isError ? 'error' : 'success');
}

function setupNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const user = getUser();
  const loggedIn = isLoggedIn();

  if (loggedIn && user) {
    nav.innerHTML = `
      <a href="/">Home</a>
      <a href="/doctors.html">Doctors</a>
      <a href="/book.html">Book</a>
      <a href="/appointments.html">My Appointments</a>
      <a href="#" id="logout-link">Logout (${user.email})</a>
    `;
    document.getElementById('logout-link').addEventListener('click', (e) => {
      e.preventDefault();
      clearSession();
      window.location.href = '/';
    });
  } else {
    nav.innerHTML = `
      <a href="/">Home</a>
      <a href="/doctors.html">Doctors</a>
      <a href="/login.html">Login</a>
      <a href="/signup.html" class="btn-nav">Sign Up</a>
    `;
  }
}

function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = '/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    return false;
  }
  return true;
}

document.addEventListener('DOMContentLoaded', setupNav);
