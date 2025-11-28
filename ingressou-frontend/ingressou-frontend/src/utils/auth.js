// utils/auth.js
export function login(email, password) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) return { ok: false, message: 'Credenciais inválidas' };
  localStorage.setItem('loggedUser', JSON.stringify(found));
  return { ok: true };
}

export function register({ name, email, password, extra }) {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  if (users.some(u => u.email === email)) {
    return { ok: false, message: 'E-mail já cadastrado' };
  }
  const newUser = { id: Date.now(), name, email, password, ...extra };
  localStorage.setItem('users', JSON.stringify([...users, newUser]));
  localStorage.setItem('loggedUser', JSON.stringify(newUser));
  return { ok: true };
}
