;'use strict';

/* global chrome */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    snippets: {
      char: [],
      text: {},
    },
  });
});
