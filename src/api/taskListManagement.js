import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/task_lists/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/task_lists',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/task_lists',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/task_lists',
    method: 'delete',
    data,
  });
}

export function doEditSort(data) {
  return request({
    url: '/v1/task_lists/sort',
    method: 'put',
    data,
  });
}
