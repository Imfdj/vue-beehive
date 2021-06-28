import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getList: {
    url: '/v1/role_menus/list',
    method: 'get',
  },
  doCreate: {
    url: '/v1/role_menus',
    method: 'post',
  },
  doEdit: {
    url: '/v1/role_menus',
    method: 'put',
  },
  doDelete: {
    url: '/v1/role_menus',
    method: 'delete',
  },
  doBulkMenuCreate: {
    url: '/v1/role_menus/bulk_menu',
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

export function doBulkMenuCreate(data) {
  return request({
    ...methodUrl.doBulkMenuCreate,
    data,
  });
}
