
/* global chrome */

chrome.runtime.onInstalled.addListener(_ => {
  chrome.storage.sync.get(storage => {
    if (!storage.snippets) {
      storage.snippets = {
        charSnippets: [],
        textSnippets: [],
      }
    }
    chrome.storage.sync.set({
      snippets: {
        // storage.snippets.char & storage.snippets.text are used for compatibility with earlier version
        charSnippets: storage.snippets.char || storage.snippets.charSnippets,
        textSnippets: storage.snippets.text || storage.snippets.textSnippets,
      },
    })
  })
})
