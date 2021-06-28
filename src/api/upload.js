import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  upload: {
    url: '/v1/uploads',
    method: 'post',
  },
};

export const permissions = Object.assign({}, methodUrl, { ...getPermissionStr(methodUrl) });

export function upload(data) {
  return request({
    ...methodUrl.upload,
    data,
  });
}
