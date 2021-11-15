;'use strict';

/* global chrome */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    trs: {
      quantity: 3,
    },
    tds: {
      quantity: 10,
      snippets: {},
    },
  });
});
