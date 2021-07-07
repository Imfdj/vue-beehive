import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getList: {
    url: '/v1/task_task_tags/list',
    method: 'get',
  },
  doCreate: {
    url: '/v1/task_task_tags',
    method: 'post',
  },
  doEdit: {
    url: '/v1/task_task_tags',
    method: 'put',
  },
  doDelete: {
    url: '/v1/task_task_tags',
    method: 'delete',
  },
  doChange: {
    url: '/v1/task_task_tags/change',
    method: 'post',
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

export function doChange(data) {
  return request({
    ...methodUrl.doChange,
    data,
  });
}
