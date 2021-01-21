import { mock } from 'mockjs';

export default [
  {
    url: '/aaa/getList',
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
    url: '/aaa/doEdit',
    type: 'post',
    response: config => {
      return {
        code: 200,
        msg: '模拟保存成功',
      };
    },
  },
  {
    url: '/aaa/doDelete',
    type: 'post',
    response: config => {
      return {
        code: 200,
        msg: '模拟删除成功',
      };
    },
  },
];
