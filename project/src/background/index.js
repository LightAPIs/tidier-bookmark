chrome.bookmarks.getRecent(5, arr => {
  console.log('最近添加的书签');
  console.log(arr);
});

chrome.bookmarks.getTree(arr => {
  console.log('书签树');
  console.log(arr);
});
