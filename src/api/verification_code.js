import request from '@/utils/request';
import { getPermissionStr } from '@/utils';

const methodUrl = {
  create: {
    url: '/v1/verification_codes',
    method: 'post',
  },
};

export const permissions = getPermissionStr(methodUrl);

export async function create(data) {
  return request({
    ...methodUrl.create,
    data,
  });
}
