import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/roles/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/roles',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/roles',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/roles',
    method: 'delete',
    data,
  });
}

export function doSetDefault(data) {
  return request({
    url: '/v1/roles/is_default',
    method: 'put',
    data,
  });
}
