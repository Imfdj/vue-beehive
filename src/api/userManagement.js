import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/users/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/users',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/users',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/users',
    method: 'delete',
    data,
  });
}
