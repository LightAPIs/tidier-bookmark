'use strict';

/**
 * Syntactic sugar
 */
const ui = {
  $: function(id) {
    return document.getElementById(id);
  },
  create: function(tag) {
    return document.createElement(tag);
  },
  get: function(...arg) {
    return chrome.i18n.getMessage(...arg);
  },
};

export default ui;
