import request from '@/utils/request';

export function getTree(data) {
  return request({
    url: '/menuManagement/getTree',
    method: 'post',
    data,
  });
}

export function getList(params) {
  return request({
    url: '/v1/menus/list',
    method: 'get',
    params,
  });
}

export function doCreate(data) {
  return request({
    url: '/v1/menus',
    method: 'post',
    data,
  });
}

export function doEdit(data) {
  return request({
    url: '/v1/menus',
    method: 'put',
    data,
  });
}

export function doDelete(data) {
  return request({
    url: '/v1/menus',
    method: 'delete',
    data,
  });
}
