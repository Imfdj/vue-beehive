/**
 * @Author Imfdj
 * @Description:
 * @Date Created in 2021/8/13 12:05
 * @Modified By:
 */
import { isEmail, isExternal } from './validate';

export function validatePhone(rule, value, callback) {
  if (value) {
    if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(value)) {
      callback();
    } else {
      callback(new Error('手机号格式有误'));
    }
  } else {
    callback();
  }
}

export function validateEmail(rule, value, callback) {
  if (value) {
    if (isEmail(value)) {
      callback();
    } else {
      callback(new Error('邮箱格式有误'));
    }
  } else {
    callback();
  }
}

export function validateUrl(rule, value, callback) {
  if (value) {
    if (isExternal(value)) {
      callback();
    } else {
      callback(new Error('格式有误'));
    }
  } else {
    callback();
  }
}
