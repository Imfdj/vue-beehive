import { loadingText, messageDuration, title } from '@/config/settings';
import configSettings from '@/config/settings';
import * as lodash from 'lodash';
import dayjs from 'dayjs';
import { Loading, Message, MessageBox, Notification } from 'element-ui';
import store from '@/store';
import { getAccessToken } from '@/utils/accessToken';

const accessToken = store.getters['user/accessToken'];
const layout = store.getters['settings/layout'];

const install = (Vue, opts = {}) => {
  /* 全局accessToken */
  Vue.prototype.$baseAccessToken = () => {
    return accessToken || getAccessToken();
  };
  /* 全局标题 */
  Vue.prototype.$baseTitle = (() => {
    return title;
  })();
  /* 全局加载层 */
  Vue.prototype.$baseLoading = (index, text, callback) => {
    let loading;
    if (!index) {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        background: 'hsla(0,0%,100%,.8)',
      });
    } else {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: 'vab-loading-type' + index,
        background: 'hsla(0,0%,100%,.8)',
      });
    }
    if (callback) {
      callback(loading);
    } else {
      setTimeout(() => {
        loading.close();
      }, messageDuration);
    }
  };
  /* 全局多彩加载层 */
  Vue.prototype.$baseColorfullLoading = (index, text, callback) => {
    let loading;
    if (!index) {
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: 'dots-loader',
        background: 'hsla(0,0%,100%,.8)',
      });
    } else {
      switch (index) {
        case 1:
          index = 'dots';
          break;
        case 2:
          index = 'gauge';
          break;
        case 3:
          index = 'inner-circles';
          break;
        case 4:
          index = 'plus';
          break;
      }
      loading = Loading.service({
        lock: true,
        text: text || loadingText,
        spinner: index + '-loader',
        background: 'hsla(0,0%,100%,.8)',
      });
    }
    if (callback) {
      callback(loading);
    } else {
      setTimeout(() => {
        loading.close();
      }, messageDuration);
    }
  };
  /* 全局Message */
  Vue.prototype.$baseMessage = (message, type) => {
    Message({
      offset: 60,
      showClose: true,
      message: message,
      type: type,
      dangerouslyUseHTMLString: true,
      duration: messageDuration,
    });
  };

  /* 全局Alert */
  Vue.prototype.$baseAlert = (content, title, callback) => {
    MessageBox.alert(content, title || '温馨提示', {
      confirmButtonText: '确定',
      dangerouslyUseHTMLString: true,
      callback: action => {
        if (callback) {
          callback();
        }
      },
    });
  };

  /* 全局Confirm */
  Vue.prototype.$baseConfirm = (content, title, callback1, callback2) => {
    MessageBox.confirm(content, title || '温馨提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      closeOnClickModal: false,
      type: 'warning',
    })
      .then(() => {
        if (callback1) {
          callback1();
        }
      })
      .catch(() => {
        if (callback2) {
          callback2();
        }
      });
  };

  /* 全局Notification */
  Vue.prototype.$baseNotify = (message, title, type = 'success', position = 'bottom-left', offset) => {
    Notification({
      title,
      message,
      position,
      type,
      duration: messageDuration,
      offset,
    });
  };

  /* 全局TableHeight */
  Vue.prototype.$baseTableHeight = formType => {
    let height = window.innerHeight;
    let paddingHeight = 400;
    const formHeight = 50;

    if (layout === 'vertical') {
      paddingHeight = 340;
    }

    if ('number' == typeof formType) {
      height = height - paddingHeight - formHeight * formType;
    } else {
      height = height - paddingHeight;
    }
    return height;
  };

  /* 全局验证资源权限
   * @param string
   * @return Boolean
   */
  Vue.prototype.$checkPermission = permission => {
    const permissions = (store.getters['user/userInfo'] && store.getters['user/userInfo'].permissions) || [];
    return permissions.includes(permission);
  };

  /* 全局lodash */
  Vue.prototype.$baseLodash = lodash;
  /* 全局dayjs */
  Vue.prototype.$baseDayjs = dayjs;
  /* 全局事件总线 */
  Vue.prototype.$baseEventBus = new Vue();
  /* 全局settings配置 */
  Vue.prototype.$configSettings = configSettings;
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default install;
