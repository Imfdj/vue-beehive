import request from '@/utils/request';

export async function create(data) {
  return request({
    url: '/v1/verification_codes',
    method: 'post',
    data,
  });
}
