import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/tasks/list',
    method: 'get',
    params,
  });
}

export function getInfo(params) {
  return request({
    url: '/v1/tasks',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/tasks',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/tasks',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/tasks',
    method: 'delete',
    data,
  });
}

export function doEditSort(data) {
  return request({
    url: '/v1/tasks/sort',
    method: 'put',
    data,
  });
}

export function doRecycleAllTaskOfTaskList(data) {
  return request({
    url: '/v1/tasks/recycle_all_task_of_taskList',
    method: 'put',
    data,
  });
}
