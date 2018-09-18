import * as jwt from 'jsonwebtoken';
import * as _ from 'lodash';

export function getCurrentUser(): any {

  const token = localStorage.getItem('token');

  if (!isLoggedIn() || !token) {
    return null;
  }

  return _.pick(jwt.decode(token), ['user_id', 'nickname', 'avatar', 'username']);
}

export function isLoggedIn(): boolean {
  const token = localStorage.getItem('token');
  if (!token) {
    return false;
  }

  const payload = jwt.decode(token) as any;
  return payload.exp < Number(new Date());
}

export function logout(): void {
  if (localStorage.getItem('token')) {
    localStorage.removeItem('token');
  }
}
