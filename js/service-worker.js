
/* global chrome */

chrome.runtime.onInstalled.addListener(_ => {
  chrome.storage.sync.get(storage => {
    const initialStorage = {
      snippets: {
        charSnippets: [],
        textSnippets: [],
      },
      sidePanelMode: false,
    }
    if (isEmptyObject(storage)) {
      storage = initialStorage
    } else {
      storage = {
        snippets: {
          // storage.snippets.char & storage.snippets.text are used for compatibility with earlier version
          charSnippets: (storage.snippets && (storage.snippets.char || storage.snippets.charSnippets)) ||
            initialStorage.snippets.charSnippets,
          textSnippets: (storage.snippets && (storage.snippets.text || storage.snippets.textSnippets)) ||
            initialStorage.snippets.textSnippets,
          sidePanelMode: !!storage.sidePanelMode,
        },
      }
    }
    chrome.storage.sync.set(storage)
    chrome.storage.sync.get(null, storage => {
      if (!storage.sidePanelMode) {
        chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: false})
      }
    })
  })
})

function isEmptyObject(obj)
{
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false
    }
  }
  return true
}
