// import ui from '../commons/ui';
import shortcuts from '../commons/shortcuts';

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
          // 没有检索到标签页时，将按钮提示恢复原状
          shortcuts.resetIconState();
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
