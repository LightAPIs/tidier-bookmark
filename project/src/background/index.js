// import ui from '../commons/ui';
import shortcuts from '../commons/shortcuts';
import ui from '../commons/ui';

chrome.contextMenus.create({
  title: ui.get('contextMenusBrowserRulesTitle'),
  contexts: ['browser_action'],
  onclick() {
    chrome.tabs.create({
      url: './options.html#/rules?operation=add',
    });
  },
});

chrome.windows.onFocusChanged.addListener(windowId => {
  if (windowId !== chrome.windows.WINDOW_ID_NONE && windowId !== chrome.windows.WINDOW_ID_CURRENT) {
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      tabs => {
        if (tabs.length > 0 && tabs[0].url) {
          const { url } = tabs[0];
          chrome.bookmarks.search(
            {
              url,
            },
            res => {
              if (res.length > 0) {
                shortcuts.addBadge();
              } else {
                shortcuts.removeBadge();
              }
            }
          );
        } else {
          shortcuts.resetIconState();
        }
      }
    );
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  activeInfo &&
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      tabs => {
        // Tab.pendingUrl since Chrome 79
        if (tabs.length > 0 && (tabs[0].url || tabs[0].pendingUrl)) {
          const { url, pendingUrl } = tabs[0];
          // *注: 即使监听了 pendingUrl，还是可能会存在由于重定向(如 "http://" => "https://")而导致判定有误的情况，*
          // *所以依旧需要 tabs.onUpdated Events*
          chrome.bookmarks.search(
            {
              url: url || pendingUrl,
            },
            res => {
              if (res.length > 0) {
                shortcuts.addBadge();
              } else {
                shortcuts.removeBadge();
              }
            }
          );
        } else {
          // 没有检索到标签页时，将按钮提示恢复原状
          shortcuts.resetIconState();
        }
      }
    );
});

chrome.tabs.onUpdated.addListener((_tabId, _changeInfo, tab) => {
  tab &&
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      tabs => {
        if (tabs.length > 0 && tabs[0].url) {
          const { url } = tabs[0];
          chrome.bookmarks.search(
            {
              url,
            },
            res => {
              if (res.length > 0) {
                shortcuts.addBadge();
              } else {
                shortcuts.removeBadge();
              }
            }
          );
        }
      }
    );
});

chrome.bookmarks.onCreated.addListener((_id, bookmark) => {
  bookmark &&
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      tabs => {
        if (tabs.length > 0 && tabs[0].url) {
          if (bookmark.url === tabs[0].url) {
            shortcuts.addBadge();
          }
        }
      }
    );
});

chrome.bookmarks.onRemoved.addListener((_id, removeInfo) => {
  removeInfo &&
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      tabs => {
        if (tabs.length > 0 && tabs[0].url) {
          const { url } = tabs[0];
          chrome.bookmarks.search(
            {
              url,
            },
            res => {
              res.length === 0 && shortcuts.removeBadge();
            }
          );
        }
      }
    );
});
