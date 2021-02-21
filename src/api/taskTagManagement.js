import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/task_tags/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/task_tags',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/task_tags',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/task_tags',
    method: 'delete',
    data,
  });
}
