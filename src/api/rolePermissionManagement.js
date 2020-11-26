import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/role_permissions/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/role_permissions',
    method: 'post',
    data,
  });
}

export function doBulkMenuCreate(data) {
  return request({
    url: '/v1/role_permissions/bulk_permission',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/role_permissions',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/role_permissions',
    method: 'delete',
    data,
  });
}
