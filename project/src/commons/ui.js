'use strict';

/**
 * Syntactic sugar
 */
const ui = {
  $(id) {
    return document.getElementById(id);
  },
  create(tag) {
    return document.createElement(tag);
  },
  get(...arg) {
    return chrome.i18n.getMessage(...arg);
  },
  /**
   * Remove leading and trailing spaces
   * @param {String} value 字符串值
   */
  removeLTSpaces(value) {
    return value.replace(/^\s+|\s+$/g, '');
  },
};

export default ui;
