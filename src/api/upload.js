import request from '@/utils/request';

export function upload(data) {
  return request({
    url: '/v1/uploads',
    method: 'post',
    data,
  });
}
