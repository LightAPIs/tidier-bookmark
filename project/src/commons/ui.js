'use strict';

/**
 * Syntactic sugar
 */
const ui = {
  get(...arg) {
    return chrome.i18n.getMessage(...arg);
  },
  /**
   * 是否启用暗黑模式
   */
  dark() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  },
  /**
   * Remove leading and trailing spaces
   * @param {String} value 字符串值
   */
  removeLTSpaces(value) {
    return value.replace(/^\s+|\s+$/g, '');
  },
  /**
   * 正则表达式替换方法
   * @param {String} pattern 模式值
   * @param {String[]|String} flags 标志值
   * @param {String} str 待替换字符串
   * @param {String} [replacement] 替换值(默认为空)
   */
  regReplace(pattern, flags, str, replacement = '') {
    let result = '';
    if (str) {
      let f = '';
      if (Array.isArray(flags)) {
        f = flags.join('');
      } else if (typeof flags === 'string') {
        f = flags;
      }

      try {
        const re = new RegExp(pattern, f);
        result = str.replace(re, replacement);
      } catch (e) {
        console.error(e);
        result = str;
      }
    }
    return result;
  },
  /**
   * 正则表达式测试方法
   * @param {String} pattern 模式值
   * @param {String[]|String} flags 标志值
   * @param {String} str 测试字符串
   */
  regTest(pattern, flags, str) {
    let result = false;
    if (str) {
      let f = '';
      if (Array.isArray(flags)) {
        f = flags.join('');
      } else if (typeof flags === 'string') {
        f = flags;
      }

      try {
        const re = new RegExp(pattern, f);
        result = re.test(str);
      } catch (e) {
        console.error(e);
        result = false;
      }
    }
    return result;
  },
};

export default ui;
