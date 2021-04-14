import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getList: {
    url: '/v1/roles/list',
    method: 'get',
  },
  doCreate: {
    url: '/v1/roles',
    method: 'post',
  },
  doEdit: {
    url: '/v1/roles',
    method: 'put',
  },
  doDelete: {
    url: '/v1/roles',
    method: 'delete',
  },
  doSetDefault: {
    url: '/v1/roles/is_default',
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

export function doSetDefault(data) {
  return request({
    ...methodUrl.doSetDefault,
    data,
  });
}
