import Cookies from 'js-cookie'

const TokenKey = 'fuse_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getUsername() {
  return Cookies.get('username')
}

export function setUsername(str) {
  return Cookies.set('username', str)
}

export function removeUsername() {
  return Cookies.remove('username')
}

export function getRoles() {
  const arr = Cookies.get('roles') || '';
  return arr.length ? arr.split(',') : [];
}

export function setRoles(arr = []) {
  return Cookies.set('roles', arr.join(','))
}

export function clearCookies() {
  return Object.keys(Cookies.get()).forEach(key => Cookies.remove(key));
}
