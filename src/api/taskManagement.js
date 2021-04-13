import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getList: {
    url: '/v1/tasks/list',
    method: 'get',
  },
  getInfo: {
    url: '/v1/tasks',
    method: 'get',
  },
  doCreate: {
    url: '/v1/tasks',
    method: 'post',
  },
  doEdit: {
    url: '/v1/tasks',
    method: 'put',
  },
  doDelete: {
    url: '/v1/tasks',
    method: 'delete',
  },
  doEditSort: {
    url: '/v1/tasks/sort',
    method: 'put',
  },
  doRecycleAllTaskOfTaskList: {
    url: '/v1/tasks/recycle_all_task_of_taskList',
    method: 'put',
  },
};

export const permissions = getPermissionStr(methodUrl);

export function getList(params) {
  return request({
    ...methodUrl.getList,
    params,
  });
}

export function getInfo(params) {
  return request({
    ...methodUrl.getInfo,
    params,
  });
}

export function doCreate(data) {
  return request({
    ...methodUrl.doCreate,
    data,
  });
}

export function doEdit(data) {
  return request({
    ...methodUrl.doCreate,
    data,
  });
}

export function doDelete(data) {
  return request({
    ...methodUrl.doDelete,
    data,
  });
}

export function doEditSort(data) {
  return request({
    ...methodUrl.doEditSort,
    data,
  });
}

export function doRecycleAllTaskOfTaskList(data) {
  return request({
    ...methodUrl.doRecycleAllTaskOfTaskList,
    data,
  });
}
