import request from '@/utils/request';
import { encryptedData } from '@/utils/encrypt';
import { loginRSA } from '@/config/settings';

export async function login(data) {
  let password = data.password;
  if (loginRSA) {
    password = await encryptedData(data.password);
  }
  return request({
    url: '/v1/users/login',
    method: 'post',
    data: {
      ...data,
      password,
    },
  });
}

export function getInfo() {
  return request({
    url: '/v1/users/user_info',
    method: 'get',
  });
}

export function logout() {
  return request({
    url: '/v1/users/logout',
    method: 'post',
  });
}

export function register(data) {
  return request({
    url: '/v1/users',
    method: 'post',
    data,
  });
}

export function update(data) {
  return request({
    url: '/v1/users',
    method: 'put',
    data,
  });
}

export function usersPassword(data) {
  return request({
    url: '/v1/users/password',
    method: 'put',
    data,
  });
}
