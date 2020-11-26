import request from '@/utils/request';

export function getRouterList(params) {
  return request({
    url: '/v1/menus/user_menus',
    method: 'get',
    params,
  });
}
