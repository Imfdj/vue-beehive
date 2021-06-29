import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getList: {
    url: '/v1/role_permissions/list',
    method: 'get',
  },
  doCreate: {
    url: '/v1/role_permissions',
    method: 'post',
  },
  doEdit: {
    url: '/v1/role_permissions',
    method: 'put',
  },
  doDelete: {
    url: '/v1/role_permissions',
    method: 'delete',
  },
  doBulkPermissionCreate: {
    url: '/v1/role_permissions/bulk_permission',
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

export function doBulkPermissionCreate(data) {
  return request({
    ...methodUrl.doBulkPermissionCreate,
    data,
  });
}
