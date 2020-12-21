'use strict';
import ui from './ui';

/**
 * Some shortcuts of chrome
 */
const shortcuts = {
  /**
   * 为扩展程序图标添加徽章
   * @param {Boolean} useFavoritesIcon  是否使用收藏夹图标
   */
  addBadge(useFavoritesIcon) {
    const darkMode = ui.dark();
    if (useFavoritesIcon) {
      chrome.browserAction.setTitle({
        title: ui.get('bookmarkModifyTip'),
      });
      chrome.browserAction.setBadgeText({
        text: '',
      });

      if (darkMode) {
        chrome.browserAction.setIcon({
          path: {
            '16': 'icons/favorites/fill-dark-16.png',
            '19': 'icons/favorites/fill-dark-19.png',
            '24': 'icons/favorites/fill-dark-24.png',
            '32': 'icons/favorites/fill-dark-32.png',
            '48': 'icons/favorites/fill-dark-48.png',
            '64': 'icons/favorites/fill-dark-64.png',
            '96': 'icons/favorites/fill-dark-96.png',
            '128': 'icons/favorites/fill-dark-128.png',
          },
        });
      } else {
        chrome.browserAction.setIcon({
          path: {
            '16': 'icons/favorites/fill-light-16.png',
            '19': 'icons/favorites/fill-light-19.png',
            '24': 'icons/favorites/fill-light-24.png',
            '32': 'icons/favorites/fill-light-32.png',
            '48': 'icons/favorites/fill-light-48.png',
            '64': 'icons/favorites/fill-light-64.png',
            '96': 'icons/favorites/fill-light-96.png',
            '128': 'icons/favorites/fill-light-128.png',
          },
        });
      }
    } else {
      chrome.browserAction.setTitle({
        title: ui.get('bookmarkModifyTip'),
      });
      chrome.browserAction.setBadgeText({
        text: '+',
      });
    }
  },
  /**
   * 移除扩展程序图标的徽章
   * @param {Boolean} useFavoritesIcon  是否使用收藏夹图标
   */
  removeBadge(useFavoritesIcon) {
    const darkMode = ui.dark();
    chrome.browserAction.setTitle({
      title: ui.get('bookmarkAddTip'),
    });
    chrome.browserAction.setBadgeText({
      text: '',
    });

    if (useFavoritesIcon) {
      if (darkMode) {
        chrome.browserAction.setIcon({
          path: {
            '16': 'icons/favorites/dark-16.png',
            '19': 'icons/favorites/dark-19.png',
            '24': 'icons/favorites/dark-24.png',
            '32': 'icons/favorites/dark-32.png',
            '48': 'icons/favorites/dark-48.png',
            '64': 'icons/favorites/dark-64.png',
            '96': 'icons/favorites/dark-96.png',
            '128': 'icons/favorites/dark-128.png',
          },
        });
      } else {
        chrome.browserAction.setIcon({
          path: {
            '16': 'icons/favorites/light-16.png',
            '19': 'icons/favorites/light-19.png',
            '24': 'icons/favorites/light-24.png',
            '32': 'icons/favorites/light-32.png',
            '48': 'icons/favorites/light-48.png',
            '64': 'icons/favorites/light-64.png',
            '96': 'icons/favorites/light-96.png',
            '128': 'icons/favorites/light-128.png',
          },
        });
      }
    }
  },
  /**
   * 重置扩展程序图标状态
   * @param {Boolean} useFavoritesIcon  是否使用收藏夹图标
   */
  resetIconState(useFavoritesIcon) {
    const darkMode = ui.dark();
    chrome.browserAction.setTitle({
      title: ui.get('extensionName'),
    });
    chrome.browserAction.setBadgeText({
      text: '',
    });

    if (useFavoritesIcon) {
      if (darkMode) {
        chrome.browserAction.setIcon({
          path: {
            '16': 'icons/favorites/dark-16.png',
            '19': 'icons/favorites/dark-19.png',
            '24': 'icons/favorites/dark-24.png',
            '32': 'icons/favorites/dark-32.png',
            '48': 'icons/favorites/dark-48.png',
            '64': 'icons/favorites/dark-64.png',
            '96': 'icons/favorites/dark-96.png',
            '128': 'icons/favorites/dark-128.png',
          },
        });
      } else {
        chrome.browserAction.setIcon({
          path: {
            '16': 'icons/favorites/light-16.png',
            '19': 'icons/favorites/light-19.png',
            '24': 'icons/favorites/light-24.png',
            '32': 'icons/favorites/light-32.png',
            '48': 'icons/favorites/light-48.png',
            '64': 'icons/favorites/light-64.png',
            '96': 'icons/favorites/light-96.png',
            '128': 'icons/favorites/light-128.png',
          },
        });
      }
    }
  },
  /**
   * 还原为默认扩展程序图标
   */
  RestoreIcon() {
    chrome.browserAction.setIcon({
      path: {
        '16': 'icons/app/icon-16.png',
        '19': 'icons/app/icon-19.png',
        '24': 'icons/app/icon-24.png',
        '32': 'icons/app/icon-32.png',
        '48': 'icons/app/icon-48.png',
        '64': 'icons/app/icon-64.png',
        '96': 'icons/app/icon-96.png',
        '128': 'icons/app/icon-128.png',
      },
    });
  },
};

export default shortcuts;
