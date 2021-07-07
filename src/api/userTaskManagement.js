import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  doChange: {
    url: '/v1/user_tasks/change',
    method: 'post',
  },
};

export const permissions = Object.assign({}, methodUrl, { ...getPermissionStr(methodUrl) });

export function doChange(data) {
  return request({
    ...methodUrl.doChange,
    data,
  });
}
