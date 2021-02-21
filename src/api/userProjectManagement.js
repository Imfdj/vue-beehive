import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/user_projects/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/user_projects',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/user_projects',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/user_projects',
    method: 'delete',
    data,
  });
}
