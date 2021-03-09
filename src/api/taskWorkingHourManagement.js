import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/task_working_hours/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/task_working_hours',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/task_working_hours',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/task_working_hours',
    method: 'delete',
    data,
  });
}
