import { storage, tokenTableName } from '@/config/settings';
import cookie from 'js-cookie';

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 获取accessToken
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getAccessToken() {
  return  getField('jwt')
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 获取accessToken
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getAccessCsrf() {
  return  getField('csrf')
}

function getField(field) {
  if (storage) {
    if ('localStorage' === storage) {
      return getLocalJwt();
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenTableName) && JSON.parse(sessionStorage.getItem(tokenTableName))[field] || '';
    } else if ('cookie' === storage) {
      return cookie.get(tokenTableName);
    } else {
      return getLocalJwt();
    }
  } else {
    return getLocalJwt();
  }
  function getLocalJwt() {
    return localStorage.getItem(tokenTableName) && JSON.parse(localStorage.getItem(tokenTableName))[field] || ''
  }
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 存储accessToken
 * @param accessToken
 * @returns {void|*}
 */
export function setAccessToken(accessToken) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(tokenTableName, accessToken);
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(tokenTableName, accessToken);
    } else if ('cookie' === storage) {
      return cookie.set(tokenTableName, accessToken);
    } else {
      return localStorage.setItem(tokenTableName, accessToken);
    }
  } else {
    return localStorage.setItem(tokenTableName, accessToken);
  }
}

/**
 * @copyright chuzhixin 1204505056@qq.com
 * @description 移除accessToken
 * @returns {void|Promise<void>}
 */
export function removeAccessToken() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(tokenTableName);
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear();
    } else if ('cookie' === storage) {
      return cookie.remove(tokenTableName);
    } else {
      return localStorage.removeItem(tokenTableName);
    }
  } else {
    return localStorage.removeItem(tokenTableName);
  }
}
