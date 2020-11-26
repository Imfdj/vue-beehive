import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/role_menus/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/role_menus',
    method: 'post',
    data,
  });
}

export function doBulkMenuCreate(data) {
  return request({
    url: '/v1/role_menus/bulk_menu',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/role_menus',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/role_menus',
    method: 'delete',
    data,
  });
}
