import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/user_roles/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/user_roles',
    method: 'post',
    data,
  });
}

export function doBulkRoleCreate(data) {
  return request({
    url: '/v1/user_roles/bulk_role',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/user_roles',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/user_roles',
    method: 'delete',
    data,
  });
}
