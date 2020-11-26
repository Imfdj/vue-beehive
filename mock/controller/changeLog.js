const data = [
  {
    content: "在github上获得了第一个star，感恩一位名叫Bequiet2014的github用户",
    timestamp: "2020-03-23",
  },
  {
    content: "增加更换主题功能",
    timestamp: "2020-04-10",
  },
  {
    content: "大幅精简代码",
    timestamp: "2020-04-14",
  },
  {
    content: "修复群友反馈的bug",
    timestamp: "2020-04-16",
  },
  {
    content: "剔除maptalks",
    timestamp: "2020-04-17",
  },
  {
    content:
      "换行符统一修改为lf 支持苹果 linux windows协同开发 强制开启最严格eslint规则 不要哭 严格是有好处的",
    timestamp: "2020-04-17",
  },
  {
    content: "彻底完成手机端适配,记录这一天熬夜到了晚上三点",
    timestamp: "2020-04-18",
  },
  {
    content:
      "删除babel-polyfill 提高打包速度 减少压缩体积（放弃ie是这个项目做出的最伟大的决定）",
    timestamp: "2020-04-18",
  },
  {
    content: "源码精简至800k",
    timestamp: "2020-04-19",
  },
  {
    content: "添加视频播放器组件",
    timestamp: "2020-04-20",
  },
  {
    content: "修复路由懒加载 完善主题配色",
    timestamp: "2020-04-22",
  },
  {
    content: "修复全局axios拦截 加快动画展示效果 修改登录页样式",
    timestamp: "2020-04-24",
  },
  {
    content: "简化权限与登录逻辑 更新mockServer",
    timestamp: "2020-04-25",
  },
  {
    content: "优化登录退出逻辑 代码更清晰 退出不再重载网页 改为重载路由形式",
    timestamp: "2020-04-26",
  },
  {
    content: "无端的指责只会让我更加努力 修复sidebar 简化permission",
    timestamp: "2020-04-28",
  },
  {
    content: "又是一个深夜 实现了表格增删改查的一键生成",
    timestamp: "2020-04-30",
  },
  {
    content: "大幅优化tagsview标签动画",
    timestamp: "2020-05-02",
  },
  {
    content: "三种图标组件实现mock模拟分页",
    timestamp: "2020-05-03",
  },
  {
    content: "添加了markdown编辑器组件",
    timestamp: "2020-05-04",
  },
  {
    content: "添加stylelint-plus自动规整排序样式",
    timestamp: "2020-05-06",
  },
  {
    content: "添加商城模板",
    timestamp: "2020-05-12",
  },
  {
    content: "github标星超过1000 感恩",
    timestamp: "2020-05-13",
  },
  {
    content: "添加验证码组件",
    timestamp: "2020-05-14",
  },
  {
    content: "修复横向菜单bug",
    timestamp: "2020-05-16",
  },
  {
    content: "又被人骂了 挺好的 让我下定决心重写了tagsBar",
    timestamp: "2020-05-20",
  },
  {
    content: "仿ant-design 添加雪花屏",
    timestamp: "2020-05-26",
  },
  {
    content: "添加人员管理模块",
    timestamp: "2020-06-02",
  },
  {
    content: "github标星超过2000 感恩",
    timestamp: "2020-06-03",
  },
  {
    content: "添加炫酷地图组件",
    timestamp: "2020-06-11",
  },
  {
    content: "抽离更多公共配置，框架使用更顺手",
    timestamp: "2020-06-19",
  },
  {
    content: "彻底完成了tagsbar多标签页的重构",
    timestamp: "2020-06-22",
  },
  {
    content: "感恩github标星过3.0K 祝大家端午节快乐",
    timestamp: "2020-06-25",
  },
  {
    content: "彻底重构了SideBar与TopBar 大幅精简dom渲染逻辑 全球首发",
    timestamp: "2020-06-25",
  },
  {
    content: "添加菜单管理",
    timestamp: "2020-07-7",
  },
  {
    content: "首次采用sass-loader 9.0写法，感谢github用户 shaonialife",
    timestamp: "2020-07-7",
  },
  {
    content: "添加vue-amap组件",
    timestamp: "2020-07-11",
  },
];

export default [
  {
    url: "/changeLog/getList",
    type: "post",
    response: (config) => {
      return {
        code: 200,
        msg: "success",
        totalCount: 999,
        data: data,
      };
    },
  },
];
