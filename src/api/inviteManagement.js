import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getList: {
    url: '/v1/invites/list',
    method: 'get',
  },
  doCreate: {
    url: '/v1/invites',
    method: 'post',
  },
  doEdit: {
    url: '/v1/invites',
    method: 'put',
  },
  doDelete: {
    url: '/v1/invites',
    method: 'delete',
  },
  getValid: {
    url: '/v1/invites/valid',
    method: 'get',
  },
  getInfoByUUID: {
    url: '/v1/invites/uuid',
    method: 'get',
  },
  doAcceptInvite: {
    url: '/v1/invites/accept',
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

export function getValid(params) {
  return request({
    ...methodUrl.getValid,
    params,
  });
}

export function getInfoByUUID(params) {
  return request({
    ...methodUrl.getInfoByUUID,
    params,
  });
}

export function doAcceptInvite(data) {
  return request({
    ...methodUrl.doAcceptInvite,
    data,
  });
}
