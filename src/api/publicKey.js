import request from '@/utils/request';

export function getPublicKey(data) {
  return request({
    url: '/v1/configurations/public_key',
    method: 'get',
  });
}
