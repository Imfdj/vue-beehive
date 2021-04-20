const isProdQiniu = process.env.BUILD_TARGET && process.env.BUILD_TARGET.trim() == 'qiniu';
const dayjs = require('dayjs');
const path = require('path');
const fs = require('fs');
const prefix = `vue-beehive/${dayjs().format('YYYYMMDD-HHmmss')}`;
// 打包时，供七牛cdn上传使用
if (isProdQiniu) fs.writeFileSync(path.resolve(__dirname, './prefix'), prefix, 'utf-8');

module.exports = {
  // 开发以及部署时的URL
  publicPath: isProdQiniu ? `https://qiniucdn.imfdj.top/${prefix}/` : '/',
  // 生产环境构建文件的目录名
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
  assetsDir: 'static',
  // 开发环境每次保存时是否输出为eslint编译警告
  lintOnSave: true,
  // 默认的接口地址
  baseURL: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'preview' ? '/api' : '/api',
  //标题 （包括初次加载雪花屏的标题 页面的标题 浏览器的标题）
  title: 'beehive',
  //简写
  //开发环境端口号
  devPort: '80',
  //版本号
  version: process.env.VUE_APP_VERSION,
  //烦请保留package.json作者信息 保留版权可免费商用 如需去除并自定义为自己企业的版权请联系群主QQ 1204505056 需支付299元 恶意修改发生纠纷及出现任何问题 由修改人自行承担
  copyright: process.env.VUE_APP_AUTHOR,
  //是否显示顶部进度条
  progressBar: true,
  // 路由模式，可选值为 history 或 hash
  routerMode: 'history',
  //不经过token校验的路由
  routesWhiteList: ['/login', '/register', '/retrieve_password', '/404', '/401'],
  //加载时显示文字
  loadingText: '正在加载中...',
  //token名称
  tokenName: 'Authorization',
  //token在localStorage、sessionStorage、cookie存储的key的名称
  tokenTableName: 'vue-admin-beautiful',
  //token存储位置localStorage sessionStorage cookie
  storage: 'localStorage',
  //token失效回退到登录页时是否记录本次的路由
  recordRoute: true,
  //是否显示logo，不显示时设置false，显示时请填写remixIcon图标名称，暂时只支持设置remixIcon
  logo: 'beehive',
  //是否国定头部 固定fixed 不固定noFixed
  header: 'fixed',
  //横纵布局 horizontal vertical
  layout: 'horizontal',
  //是否开启主题配置按钮
  themeBar: false,
  //是否显示多标签页
  tagsBar: false,
  //是否显示骨架屏
  skeleton: false,
  //配后端数据的接收方式application/json;charset=UTF-8或者application/x-www-form-urlencoded;charset=UTF-8
  contentType: 'application/json;charset=UTF-8',
  //消息框消失时间
  messageDuration: 3000,
  //最长请求时间
  requestTimeout: 5000,
  //操作正常code，支持String、Array两种方式
  successCode: [200, 201, 204, 0],
  //参数错误code
  invalidRequestCode: 400,
  //登录失效code
  invalidCode: 402,
  //无权限code
  noPermissionCode: 403,
  //没有找到code
  noFoundCode: 404,
  //无认证code
  noAuthenticationCode: 401,
  //是否显示在页面高亮错误
  errorLog: ['development', 'test', 'production'],
  //是否开启登录RSA加密
  loginRSA: process.env.NODE_ENV === 'production' && true,
  //vertical布局时是否只保持一个子菜单的展开
  uniqueOpened: true,
  //vertical布局时默认展开的菜单path，使用逗号隔开建议只展开一个
  defaultOopeneds: ['/vab'],
  //需要加loading层的请求，防止重复提交
  debounce: ['doEdit'],
  //需要自动注入并加载的模块
  providePlugin: {},
  //npm run build时是否自动生成7z压缩包
  build7z: false,
  //github授权登录authorize请求地址
  github_auth_authorize_url: 'https://github.com/login/oauth/authorize',
  //github授权登录client_id
  github_auth_client_id: process.env.NODE_ENV === 'production' ? 'd347423472204bea6caf' : '7191c2792ca23d773c32',
  //github授权登录重定向地址
  github_auth_redirect_uri:
    process.env.NODE_ENV === 'production' ? 'https://beehive.imfdj.top/login' : 'http://localhost/login',
};
