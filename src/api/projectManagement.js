import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getList: {
    url: '/v1/projects/list',
    method: 'get',
  },
  doCreate: {
    url: '/v1/projects',
    method: 'post',
  },
  doEdit: {
    url: '/v1/projects',
    method: 'put',
  },
  doDelete: {
    url: '/v1/projects',
    method: 'delete',
  },
  getInfo: {
    url: '/v1/projects',
    method: 'get',
  },
  getStatistics: {
    url: '/v1/projects/statistics',
    method: 'get',
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

export function getInfo(params) {
  return request({
    ...methodUrl.getInfo,
    params,
  });
}

export function getStatistics(params) {
  return request({
    ...methodUrl.getStatistics,
    params,
  });
}
