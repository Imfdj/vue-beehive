import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/project_templates/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/project_templates',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/project_templates',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/project_templates',
    method: 'delete',
    data,
  });
}
