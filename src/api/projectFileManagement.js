import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/project_files/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/project_files',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/project_files',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/project_files',
    method: 'delete',
    data,
  });
}
