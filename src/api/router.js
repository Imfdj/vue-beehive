import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  getRouterList: {
    url: '/v1/menus/user_menus',
    method: 'get',
  },
};

export const permissions = getPermissionStr(methodUrl);

export function getRouterList(params) {
  return request({
    ...methodUrl.getRouterList,
    params,
  });
}
