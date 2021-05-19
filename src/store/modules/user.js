/**
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue';
import VueSocketIO from 'vue-socket.io';
import { getInfo, login, logout, doRefreshToken, githubLogin } from '@/api/user';
import { getAccessToken, getAccessCsrf, getRefreshToken, removeAccessToken, setAccessToken } from '@/utils/accessToken';
import { resetRouter } from '@/router';
import { title, tokenName } from '@/config/settings';
import { encryptedData } from '@/utils/encrypt';
import store from '@/store';

const state = {
  accessToken: getAccessToken(),
  accessCsrf: getAccessCsrf(),
  refreshToken: getRefreshToken(),
  username: '',
  avatar: '',
  userInfo: {},
  onlineUserSocketIds: [], // 在线用户socketIds
};
const getters = {
  accessToken: state => state.accessToken,
  accessCsrf: state => state.accessCsrf,
  refreshToken: state => state.refreshToken,
  username: state => state.username,
  avatar: state => state.avatar,
  userInfo: state => state.userInfo,
  permissions: state => state.userInfo?.permissions || [],
  onlineUserIds: state => {
    const onlineUserIds = state.onlineUserSocketIds.map(item => item.split('_')[0]);
    return Array.from(new Set(onlineUserIds));
  },
};
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = JSON.parse(accessToken).jwt;
    state.accessCsrf = JSON.parse(accessToken).csrf;
    state.refreshToken = JSON.parse(accessToken).refreshToken;
    setAccessToken(accessToken);
  },
  setusername(state, username) {
    state.username = username;
  },
  setAvatar(state, avatar) {
    state.avatar = avatar;
  },
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo;
  },
  setOnlineUserSocketIds(state, onlineUserSocketIds) {
    state.onlineUserSocketIds = onlineUserSocketIds;
  },
};
const actions = {
  SOCKET_sync({ commit, state }, data) {
    const { params, action } = data;
    switch (action) {
      case 'online': {
        commit('setOnlineUserSocketIds', params);
        break;
      }
      case 'join': {
        const data = new Set(state.onlineUserSocketIds);
        commit('setOnlineUserSocketIds', Array.from(data.add(params.socketId)));
        break;
      }
      case 'leave': {
        const data = new Set(state.onlineUserSocketIds);
        data.delete(params.socketId);
        commit('setOnlineUserSocketIds', Array.from(data));
        break;
      }
      default:
        break;
    }

    // socket 全局 Ack确认
    Vue.prototype.$socket.emit('ack', {
      id: data.id,
      result: 'OK',
    });
  },
  // // socket 全局 Ack确认
  // SOCKET_message({ commit }, data) {
  //   Vue.prototype.$socket.emit('ack', {
  //     id: data.id,
  //     result: 'OK',
  //   });
  // },
  async login({ commit }, userInfo) {
    // 如果存在username，password则为账号密码登录，否则为github授权登录
    const { code, data, msg } = !userInfo.code ? await login(userInfo) : await githubLogin(userInfo);
    if (code !== 0) {
      Vue.prototype.$baseMessage(msg, 'error');
      return;
    }
    const { accessToken, csrf, refreshToken } = data;
    if (accessToken) {
      commit('setAccessToken', JSON.stringify({ jwt: `Bearer ${accessToken}`, csrf, refreshToken }));
      const hour = new Date().getHours();
      const thisTime =
        hour < 8 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 18 ? '下午好' : '晚上好';
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`, 'success', 'top-right', 60);
    } else {
      Vue.prototype.$baseMessage(`登录接口异常，未正确返回${tokenName}...`, 'error');
    }
  },
  async getInfo({ commit, state }) {
    const { data } = await getInfo();
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error');
      return false;
    }
    let { permissions, username, avatar } = data;

    // 创建socket
    const options = {
      transports: ['websocket'],
      query: {
        userId: data.id,
        accessToken: state.accessToken,
      },
    };
    const connection = process.env.NODE_ENV === 'production' ? '/' : '/';
    Vue.use(
      new VueSocketIO({
        debug: process.env.NODE_ENV !== 'production',
        connection, //options object is Optional
        options,
        vuex: {
          store,
          actionPrefix: 'SOCKET_',
          mutationPrefix: 'SOCKET_',
        },
      })
    );

    if (permissions && username) {
      commit('setusername', username);
      commit('setAvatar', avatar);
      commit('setUserInfo', data);
      return permissions;
    } else {
      Vue.prototype.$baseMessage('获取用户信息接口异常', 'error');
      return false;
    }
  },
  async logout({ dispatch, commit }) {
    await logout(state.accessToken);
    await dispatch('tagsBar/delAllRoutes', null, { root: true });
    await dispatch('resetAccessToken');
    await resetRouter();
    commit('setUserInfo', {});
  },
  resetAccessToken({ commit }) {
    commit('setAccessToken', JSON.stringify({}));
    removeAccessToken();
    // 断开socket连接
    Vue.prototype.$socket.disconnect();
  },
  async refreshToken({ commit, state }) {
    try {
      // 解析refreshToken，拿到userInfo
      const userInfo = JSON.parse(window.atob(state.refreshToken.match(/\.(.*)\./)[1])).data.userInfo;
      const {
        code,
        data: { accessToken, refreshToken },
      } = await doRefreshToken({
        refreshToken: state.refreshToken,
        secret: await encryptedData(userInfo.id),
      });
      if (code === 0) {
        commit(
          'setAccessToken',
          JSON.stringify({ jwt: `Bearer ${accessToken}`, csrf: state.accessCsrf, refreshToken })
        );
      }
    } catch (e) {
      return Promise.reject(e);
    }
  },
};
export default { state, getters, mutations, actions };
