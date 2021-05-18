import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  doChange: {
    url: '/v1/user_task_likes/change',
    method: 'post',
  },
};

export const permissions = getPermissionStr(methodUrl);

export function doChange(data) {
  return request({
    ...methodUrl.doChange,
    data,
  });
}
