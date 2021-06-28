import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getList: {
    url: '/v1/task_lists/list',
    method: 'get',
  },
  doCreate: {
    url: '/v1/task_lists',
    method: 'post',
  },
  doEdit: {
    url: '/v1/task_lists',
    method: 'put',
  },
  doDelete: {
    url: '/v1/task_lists',
    method: 'delete',
  },
  doEditSort: {
    url: '/v1/task_lists/sort',
    method: 'put',
  },
};

export const permissions = Object.assign({}, methodUrl, { ...getPermissionStr(methodUrl) });

export function getList(params) {
  return request({
    ...methodUrl.getList,
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
    ...methodUrl.doEdit,
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
