;'use strict';

/* global chrome */

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get(storage => {
    if (!storage.snippets) {
      storage.snippets = {
        char: [],
        text: [],
      };
    }
    chrome.storage.sync.set({
      snippets: {
        char: storage.snippets.char,
        text: storage.snippets.text,
      },
    });
  });
});
