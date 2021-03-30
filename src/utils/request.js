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
import { Loading, Message } from 'element-ui';
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
    if (config.data) {
      //这里会过滤所有为空、0、fasle的key，如果不需要请自行注释
      // config.data = _.pickBy(config.data, _.identity);
    }
    //只针对get方式进行序列化
    if (config.method.toLowerCase() === 'get') {
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
          errorMsg(msg || `后端接口${code}异常`);
          store.dispatch('user/resetAccessToken');
          break;
        default:
          errorMsg(msg || `后端接口${code}异常`);
          break;
      }
      return Promise.reject(
        'vue-admin-beautiful请求异常拦截:' + JSON.stringify({ url: config.url, code, msg }) || 'Error'
      );
    } else {
      return data;
    }
  },
  async error => {
    switch (error.response?.status) {
      case invalidRequestCode:
        const data = error.response.data;
        switch (data.code) {
          case 1451:
            errorMsg('操作失败,当前数据存在关联数据');
            break;
          default:
            errorMsg(data.msg || `后端接口${error.request?.status}异常`);
            break;
        }
        break;
      case noAuthenticationCode:
        await store.dispatch('user/resetAccessToken');
        router.push(`/login?redirect=${router.app.$route.fullPath}`);
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
        errorMsg(error || `后端接口${error.request?.status}异常`);
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
