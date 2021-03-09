import request from '@/utils/request';

export function getList(params) {
  return request({
    url: '/v1/project_template_tasks/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/project_template_tasks',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/project_template_tasks',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/project_template_tasks',
    method: 'delete',
    data,
  });
}
