import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/task_states/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/task_states',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/task_states',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/task_states',
    method: 'delete',
    data,
  });
}
