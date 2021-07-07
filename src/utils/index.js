import dayjs from 'dayjs';
import lodash from 'lodash';
import weekOfYear from 'dayjs/plugin/weekOfYear';

dayjs.extend(weekOfYear);

/**
 * @description addEventListener
 * @type {function(...[*]=)}
 */
export const on = (function () {
  return function (element, event, handler, useCapture = false) {
    if (element && event && handler) {
      element.addEventListener(event, handler, useCapture);
    }
  };
})();

/**
 * @description removeEventListener
 * @type {function(...[*]=)}
 */
export const off = (function () {
  return function (element, event, handler, useCapture = false) {
    if (element && event) {
      element.removeEventListener(event, handler, useCapture);
    }
  };
})();

/**
 * time时间后执行callback，如存在未执行Timeout则清除
 * @copyright Imfdj imfdjjj@gmail.com
 */
let timerWaitTimeout = null;
export const waitTimeout = function (time, callback) {
  if (timerWaitTimeout) {
    clearTimeout(timerWaitTimeout);
  }
  timerWaitTimeout = setTimeout(() => {
    timerWaitTimeout = null;
    callback();
  }, time);
};

/**
 * 时间人性化转换，几秒前，X分钟起，X小时前提供下次更新时间
 * @copyright Imfdj imfdjjj@gmail.com
 */
export const dateHumanizeFormat = function (date, options) {
  const opts = {};
  Object.assign(opts, { coarsness: false }, options);
  const nowDate = new Date();
  const targetDate = new Date(date);
  const isSameYear = nowDate.getFullYear() === targetDate.getFullYear();
  const isSameYearMonth =
    nowDate.getFullYear() === targetDate.getFullYear() && nowDate.getMonth() === targetDate.getMonth();
  const currentDay = dayjs(date).day();
  const limit = Date.now() - targetDate.getTime();
  const limitDays = nowDate.getDate() - targetDate.getDate();
  const limitWeeks = nowDate.getFullYear() === targetDate.getFullYear() ? dayjs().week() - dayjs(date).week() : null;
  const weekLocalNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const data = {
    refreshTime: 0, // 距离下次刷新时间（ms）
  };

  switch (true) {
    case (limitWeeks === -1 && currentDay !== 0) || (limitWeeks === -2 && currentDay === 0):
      data.value = `下${weekLocalNames[currentDay]} ${dayjs(date).format('HH:mm')}`;
      break;
    case isSameYearMonth && limitDays === -1:
      data.value = `明天 ${dayjs(date).format('HH:mm')}`;
      break;
    case limit > 0 && limit < 60 * 1000 && !opts.coarsness:
      data.value = '几秒前';
      data.refreshTime = 60 * 1000 - limit;
      break;
    case limit > 0 && limit < 60 * 60 * 1000 && !opts.coarsness:
      data.value = `${Math.floor(limit / 1000 / 60)} 分钟前`;
      data.refreshTime = 60 * 1000 - (limit % (60 * 1000));
      break;
    case limit > 0 && limit < 4 * 60 * 60 * 1000 && !opts.coarsness:
      data.value = `${Math.floor(limit / 1000 / 60 / 60)} 小时前`;
      data.refreshTime = 60 * 60 * 1000 - (limit % (60 * 60 * 1000));
      break;
    case isSameYearMonth && limitDays === 0:
      data.value = `今天 ${dayjs(date).format('HH:mm')}`;
      break;
    case isSameYearMonth && limitDays === 1:
      data.value = `昨天 ${dayjs(date).format('HH:mm')}`;
      break;
    case (limitWeeks === 0 && currentDay !== 0) || (limitWeeks === -1 && currentDay === 0):
      data.value = `${weekLocalNames[currentDay]} ${dayjs(date).format('HH:mm')}`;
      break;
    case (limitWeeks === 1 && currentDay !== 0) || (limitWeeks === 0 && currentDay === 0):
      data.value = `上${weekLocalNames[currentDay]} ${dayjs(date).format('HH:mm')}`;
      break;
    case !isSameYear:
      data.value = dayjs(date).format('YYYY年M月D日 HH:mm');
      break;
    default:
      data.value = dayjs(date).format('M月D日 HH:mm');
      break;
  }

  return data;
};

/**
 * time时间后执行callback，如存在未执行Timeout则清除
 * @copyright Imfdj imfdjjj@gmail.com
 */
export const getPermissionStr = function (permissions) {
  return lodash.mapValues(permissions, o => `${o.method}:/api${o.url}`);
};
