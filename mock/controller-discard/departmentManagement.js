import { mock } from 'mockjs';

export default [
  {
    url: '/departmentManagement/list',
    type: 'get',
    response: config => {
      return {
        code: 200,
        msg: 'success',
        totalCount: 999,
        data: mock({
          'data|10': [
            {
              id: '@id',
            },
          ],
        }).data,
      };
    },
  },
  {
    url: '/departmentManagement/getList',
    type: 'post',
    response: config => {
      return {
        code: 200,
        msg: 'success',
        totalCount: 999,
        data: mock({
          'data|10': [
            {
              id: '@id',
            },
          ],
        }).data,
      };
    },
  },
  {
    url: '/departmentManagement/doEdit',
    type: 'post',
    response: config => {
      return {
        code: 200,
        msg: '模拟保存成功',
      };
    },
  },
  {
    url: '/departmentManagement/doDelete',
    type: 'post',
    response: config => {
      return {
        code: 200,
        msg: '模拟删除成功',
      };
    },
  },
];
