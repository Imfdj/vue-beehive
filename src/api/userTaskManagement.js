import request from '@/utils/request';

export function doChange(data) {
  return request({
    url: '/v1/user_tasks/change',
    method: 'post',
    data,
  });
}
