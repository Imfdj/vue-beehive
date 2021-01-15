import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/departments/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/departments',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/departments',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/departments',
    method: 'delete',
    data,
  });
}

export function updateUserDepartment(data) {
  return request({
    url: '/v1/users/department',
    method: 'put',
    data,
  });
}
