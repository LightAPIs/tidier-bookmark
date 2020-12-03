'use strict';
import ui from './ui';

/**
 * Some shortcuts of chrome
 */
const shortcuts = {
  /**
   * 为扩展程序图标添加徽章
   */
  addBadge() {
    chrome.browserAction.setTitle({
      title: ui.get('bookmarkModifyTip'),
    });
    chrome.browserAction.setBadgeText({
      text: '+',
    });
  },
  /**
   * 移除扩展程序图标的徽章
   */
  removeBadge() {
    chrome.browserAction.setTitle({
      title: ui.get('bookmarkAddTip'),
    });
    chrome.browserAction.setBadgeText({
      text: '',
    });
  },
  /**
   * 重置扩展程序图标状态
   */
  resetIconState() {
    chrome.browserAction.setTitle({
      title: ui.get('extensionName'),
    });
    chrome.browserAction.setBadgeText({
      text: '',
    });
  },
};

export default shortcuts;
