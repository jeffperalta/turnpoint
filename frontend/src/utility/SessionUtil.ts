export function getSessionToken() {
  return localStorage.getItem('sessionToken');
}

export function setSessionToken(token: string) {
  if (token) localStorage.setItem('sessionToken', token);
  else localStorage.removeItem('sessionToken');
}

export function clearSessionToken() {
  setSessionToken('');
}