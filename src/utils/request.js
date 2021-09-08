import axios from 'axios';
import {
  baseURL,
  contentType,
  invalidCode,
  messageDuration,
  noPermissionCode,
  noFoundCode,
  invalidRequestCode,
  noAuthenticationCode,
  requestTimeout,
  successCode,
  tokenName,
  debounce,
} from '@/config/settings';
import { Loading, Message, Notification } from 'element-ui';
import store from '@/store';
import qs from 'qs';
import router from '@/router';
import _ from 'lodash';
import { isArray, isNumber } from '@/utils/validate';

const service = axios.create({
  baseURL,
  timeout: requestTimeout,
  headers: {
    'Content-Type': contentType,
  },
});
let loadingInstance;
service.interceptors.request.use(
  config => {
    if (store.getters['user/accessToken']) {
      config.headers[tokenName] = store.getters['user/accessToken'];
      config.headers['x-csrf-token'] = store.getters['user/accessCsrf'];
    }
    // 如果config.data存在，且是Json
    if (config.data && Object.prototype.toString.call(config.data).slice(8, -1).toLowerCase() === 'object') {
      //这里会过滤所有为null的key，如果不需要请自行注释
      config.data = _.pickBy(config.data, item => !_.isNull(item));
    }
    //只针对get方式进行序列化
    if (config.method.toLowerCase() === 'get') {
      //这里会过滤所有为null的key，如果不需要请自行注释
      config.params = _.pickBy(config.params, item => !_.isNull(item));
      // 对所有字符串参数做反斜杠处理，解决反斜杠参数搜索有误问题
      for (const paramsKey in config.params) {
        if (_.isString(config.params[paramsKey])) {
          config.params[paramsKey] = config.params[paramsKey].replace(/\\/g, '\\\\');
        }
      }
      config.paramsSerializer = function (params) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      };
    }
    if (process.env.NODE_ENV !== 'preview') {
      if (contentType === 'application/x-www-form-urlencoded;charset=UTF-8') {
        if (config.data && !config.data.param) {
          config.data = qs.stringify(config.data);
        }
      }
    }
    const needLoading = () => {
      let status = false;
      debounce.forEach(item => {
        if (_.includes(config.url, item)) {
          status = true;
        }
      });
      return status;
    };
    if (needLoading()) {
      loadingInstance = Loading.service();
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

const errorMsg = message => {
  return Message({
    message: message,
    type: 'error',
    duration: messageDuration,
  });
};

const errNotification = (
  title = null,
  message = null,
  type = 'error',
  position = 'bottom-left',
  duration = messageDuration
) => {
  Notification({
    title,
    message,
    type,
    position,
    duration,
  });
};

service.interceptors.response.use(
  async response => {
    if (loadingInstance) {
      loadingInstance.close();
    }
    const { status, data, config } = response;
    // 如果是token过期，则刷新token并重试，如果刷新失败，则跳到登录
    if (status === 202 && data.code === 401) {
      try {
        await store.dispatch('user/refreshToken');
        return service.request(config);
      } catch (e) {
        await store.dispatch('user/resetAccessToken');
        router.push(`/login?redirect=${router.app.$route.fullPath}`);
        return Promise.reject();
      }
    }
    const { code, msg } = data;
    let codeVerification = false;
    if (isNumber(successCode)) {
      codeVerification = code !== successCode;
    }
    if (isArray(successCode)) {
      for (let i = 0; i < successCode.length; i++) {
        if (code === i) {
          codeVerification = code !== i;
          break;
        }
      }
    }

    if (codeVerification) {
      switch (code) {
        case invalidCode:
          errNotification('错误', msg || `后端接口${code}异常`);
          store.dispatch('user/resetAccessToken');
          break;
        default:
          errNotification('错误', msg || `后端接口${code}异常`);
          break;
      }
      return Promise.reject('vue-beehive请求异常拦截:' + JSON.stringify({ url: config.url, code, msg }) || 'Error');
    } else {
      return data;
    }
  },
  async error => {
    switch (error.response?.status) {
      case invalidRequestCode: {
        const data = error.response.data;
        switch (data.code) {
          case 1451:
            errNotification('错误', '操作失败,当前数据存在关联数据');
            break;
          case 1062:
            data.data.detail.forEach(item => {
              if (item.type === 'unique violation' && item.value) {
                errNotification('错误', `${item.value} 已经存在`);
              }
            });
            break;
          default:
            if (data.error) {
              errNotification('错误', data.error);
            } else {
              errNotification('错误', data.msg || `后端接口${error.request?.status}异常`);
            }
            break;
        }
        break;
      }
      case noAuthenticationCode:
        // await store.dispatch('user/resetAccessToken');
        // router.push(`/login?redirect=${router.app.$route.fullPath}`);
        if (error.response.data?.msg) {
          errNotification('无权限', error.response.data.msg);
        }
        router.push(`/401`);
        break;
      case noPermissionCode:
        router.push({
          path: '/403',
        });
        break;
      case noFoundCode:
        router.push({
          path: '/404',
        });
        break;
      default:
        errNotification('错误', error || `后端接口${error.request?.status}异常`);
        break;
    }

    if (loadingInstance) {
      loadingInstance.close();
    }
    /*网络连接过程异常处理*/
    // let { message } = error;
    // if (message == "Network Error") {
    //   message = "后端接口连接异常";
    // }
    // if (message.includes("timeout")) {
    //   message = "后端接口请求超时";
    // }
    // if (message.includes("Request failed with status code")) {
    //   message = "后端接口" + message.substr(message.length - 3) + "异常";
    // }
    // errorMsg(message || "后端接口未知异常");
    return Promise.reject(error);
  }
);
export default service;
