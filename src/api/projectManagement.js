import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/projects/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/projects',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/projects',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/projects',
    method: 'delete',
    data,
  });
}
