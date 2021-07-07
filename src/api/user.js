import request from '@/utils/request';
import { encryptedData } from '@/utils/encrypt';
import { loginRSA } from '@/config/settings';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getList: {
    url: '/v1/users/list',
    method: 'get',
  },
  doEdit: {
    url: '/v1/users',
    method: 'put',
  },
  doDelete: {
    url: '/v1/users',
    method: 'delete',
  },
  login: {
    url: '/v1/users/login',
    method: 'post',
  },
  getInfo: {
    url: '/v1/users/user_info',
    method: 'get',
  },
  logout: {
    url: '/v1/users/logout',
    method: 'post',
  },
  register: {
    url: '/v1/users',
    method: 'post',
  },
  usersPassword: {
    url: '/v1/users/password',
    method: 'put',
  },
  doRefreshToken: {
    url: '/v1/users/refreshToken',
    method: 'post',
  },
  githubLogin: {
    url: '/v1/users/github/login',
    method: 'post',
  },
  getOne: {
    url: '/v1/users',
    method: 'get',
  },
  updateUserDepartment: {
    url: '/v1/users/department',
    method: 'put',
  },
};

export const permissions = Object.assign({}, methodUrl, { ...getPermissionStr(methodUrl) });

export function getList(params) {
  return request({
    ...methodUrl.getList,
    params,
  });
}

export function doEdit(data) {
  return request({
    ...methodUrl.doEdit,
    data,
  });
}

export function doDelete(data) {
  return request({
    ...methodUrl.doDelete,
    data,
  });
}

export async function login(data) {
  let password = data.password;
  if (loginRSA) {
    password = await encryptedData(data.password);
  }
  return request({
    ...methodUrl.login,
    data: {
      ...data,
      password,
    },
  });
}

export function getInfo() {
  return request({
    ...methodUrl.getInfo,
  });
}

export function logout() {
  return request({
    ...methodUrl.logout,
  });
}

export function register(data) {
  return request({
    ...methodUrl.register,
    data,
  });
}

export function usersPassword(data) {
  return request({
    ...methodUrl.usersPassword,
    data,
  });
}

export function doRefreshToken(data) {
  return request({
    ...methodUrl.doRefreshToken,
    data,
  });
}

export function githubLogin(data) {
  return request({
    ...methodUrl.githubLogin,
    data,
  });
}

export function getOne(params) {
  return request({
    ...methodUrl.getOne,
    params,
  });
}

export function updateUserDepartment(data) {
  return request({
    ...methodUrl.updateUserDepartment,
    data,
  });
}
