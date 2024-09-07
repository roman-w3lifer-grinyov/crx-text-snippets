
/* global chrome */

window.addEventListener('DOMContentLoaded', _ => {

  const app = {
    minNumberOfTrs: 2,
    numberOfTds: 10,
    editText: 'Edit',
    saveText: 'Save',
  }

  const charSnippetsEditButton = document.getElementById('char-snippets-edit-save-button')
  charSnippetsEditButton.textContent = app.editText
  const charSnippetsTable = document.querySelector('#char-snippets-table')
  const charSnippetsAddRowButton = document.getElementById('char-snippets-add-row-button')

  const textSnippetsEditButton = document.getElementById('text-snippets-edit-save-button')
  textSnippetsEditButton.textContent = app.editText
  const textSnippetsTable = document.querySelector('#text-snippets-table')
  const textSnippetsAddSnippetButton = document.getElementById('text-snippets-add-snippet-button')

  chrome.storage.sync.get(storage => {

    /*
     * =================================================================================================================
     * CHAR SNIPPETS
     * =================================================================================================================
     */

    let key = 0
    const numberOfRowsForCharSnippets = storage.snippets.charSnippets.length < app.minNumberOfTrs * app.numberOfTds
      ? app.minNumberOfTrs
      : storage.snippets.charSnippets.length / app.numberOfTds
    for (let i = 0; i < numberOfRowsForCharSnippets; i++) {
      const tr = document.createElement('tr')
      for (let j = 0; j < app.numberOfTds; j++) {
        const td = document.createElement('td')
        const input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('readonly', 'true')
        input.value = storage.snippets.charSnippets[key] || ''
        if (i >= app.minNumberOfTrs && (j + 1) % app.numberOfTds === 0) {
          td.appendChild(getCharSnippetsDeleteRowButton())
        }
        td.appendChild(input)
        tr.appendChild(td)
        key++
      }
      charSnippetsTable.appendChild(tr)
    }

    charSnippetsEditButton.addEventListener('click', _ => {
      if (charSnippetsEditButton.textContent === app.saveText) {
        const snippets = []
        charSnippetsTable.querySelectorAll('input').forEach(input => {
          input.setAttribute('readonly', 'true')
          snippets.push(input.value)
        })
        storage.snippets.charSnippets = snippets
        chrome.storage.sync.set(storage)
        charSnippetsEditButton.textContent = app.editText
      } else {
        charSnippetsTable.querySelectorAll('input').forEach(input => {
          input.removeAttribute('readonly')
        })
        charSnippetsEditButton.textContent = app.saveText
      }
    })

    charSnippetsAddRowButton.addEventListener('click', _ => {
      const tr = charSnippetsTable.querySelector('tr:last-child').cloneNode(true)
      tr.childNodes.forEach(td => td.querySelector('input').value = '')
      tr.lastChild.appendChild(getCharSnippetsDeleteRowButton())
      charSnippetsTable.appendChild(tr)
      charSnippetsEditButton.click()
    })

    charSnippetsTable.addEventListener('click', event => {
      if (event.target.classList.contains('delete-row-button')) {
        event.target.closest('tr').remove()
        setCharSnippets(storage)
      }
      copySnippet(event, 'char-snippets-notification-box')
    })

    document.getElementById('char-snippets-clear-all-button').addEventListener('click', _ => {
      if (!confirm('Your char snippets will be deleted!')) {
        return
      }
      charSnippetsTable.querySelectorAll('input').forEach(input => input.value = '')
      setCharSnippets(storage)
    })

    /*
     * =================================================================================================================
     * TEXT SNIPPETS
     * =================================================================================================================
     */

    const numberOfRowsForTextSnippets = storage.snippets.textSnippets.length <= app.minNumberOfTrs
      ? app.minNumberOfTrs
      : storage.snippets.textSnippets.length
    for (let i = 0; i < numberOfRowsForTextSnippets; i++) {
      const tr = document.createElement('tr')
      const td = document.createElement('td')
      const textarea = document.createElement('textarea')
      textarea.setAttribute('readonly', 'true')
      textarea.value = storage.snippets.textSnippets[i] || ''
      if (i >= app.minNumberOfTrs) {
        td.appendChild(getTextSnippetDeleteRowButton())
      }
      td.appendChild(textarea)
      tr.appendChild(td)
      textSnippetsTable.appendChild(tr)
    }

    textSnippetsEditButton.addEventListener('click', _ => {
      if (textSnippetsEditButton.textContent === app.saveText) {
        const snippets = []
        textSnippetsTable.querySelectorAll('textarea').forEach(textarea => {
          textarea.setAttribute('readonly', 'true')
          snippets.push(textarea.value)
        })
        storage.snippets.textSnippets = snippets
        chrome.storage.sync.set(storage)
        textSnippetsEditButton.textContent = app.editText
      } else {
        textSnippetsTable.querySelectorAll('textarea').forEach(textarea => {
          textarea.removeAttribute('readonly')
        })
        textSnippetsEditButton.textContent = app.saveText
      }
    })

    textSnippetsAddSnippetButton.addEventListener('click', _ => {
      const tr = textSnippetsTable.querySelector('tr:last-child').cloneNode(true)
      tr.querySelector('textarea').value = ''
      tr.lastChild.appendChild(getTextSnippetDeleteRowButton())
      textSnippetsTable.appendChild(tr)
      textSnippetsEditButton.click()
    })

    textSnippetsTable.addEventListener('click', event => {
      if (event.target.classList.contains('delete-snippet-button')) {
        event.target.closest('tr').remove()
        setTextSnippets(storage)
      }
      copySnippet(event, 'text-snippets-notification-box')
    })

    document.getElementById('text-snippets-clear-all-button').addEventListener('click', _ => {
      if (!confirm('Your text snippets will be deleted!')) {
        return
      }
      textSnippetsTable.querySelectorAll('textarea').forEach(textarea => textarea.value = '')
      setTextSnippets(storage)
    })

    /*
     * =================================================================================================================
     * COMMON FUNCTIONS
     * =================================================================================================================
     */

    charSnippetsTable.addEventListener('input', _ => storage => setCharSnippets(storage))
    textSnippetsTable.addEventListener('input', _ => storage => setTextSnippets(storage))

    function setCharSnippets(storage)
    {
      const snippets = []
      charSnippetsTable.querySelectorAll('input').forEach(input => snippets.push(input.value))
      storage.snippets.charSnippets = snippets
      chrome.storage.sync.set(storage)
    }

    function setTextSnippets(storage)
    {
      const snippets = []
      textSnippetsTable.querySelectorAll('textarea').forEach(textarea => snippets.push(textarea.value))
      storage.snippets.textSnippets = snippets
      chrome.storage.sync.set(storage)
    }

    function getCharSnippetsDeleteRowButton()
    {
      const span = document.createElement('span')
      span.classList.add('delete-row-button')
      span.setAttribute('title', 'Delete row')
      span.textContent = '×'
      return span
    }

    function getTextSnippetDeleteRowButton()
    {
      const span = document.createElement('span')
      span.classList.add('delete-snippet-button')
      span.setAttribute('title', 'Delete snippet')
      span.textContent = '×'
      return span
    }

    function copySnippet(event, selector)
    {
      if (!event.target.readOnly) {
        return
      }
      const copiedMessage = document.getElementById(selector)
      if (!event.target.value) {
        copiedMessage.textContent = 'Nothing to copy!'
      } else {
        copyTextToClipboard(event.target.value)
        copiedMessage.textContent = 'Copied!'
      }
      copiedMessage.style.visibility = 'visible'
      setTimeout(_ => {
        copiedMessage.style.visibility = 'hidden'
        copiedMessage.textContent = ''
      }, 1000)
    }

    function copyTextToClipboard(text)
    {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }

    /*
     * =================================================================================================================
     * EXPORT/IMPORT BUTTONS, SIDE PANEL MODE CHECKBOX
     * =================================================================================================================
     */

    // https://stackoverflow.com/a/23167789/4223982
    document
      .getElementById('export-button')
      .addEventListener('click', _ => {
        chrome.storage.sync.get(storage => {
          chrome.downloads.download({
            url: 'data:application/json;base64,' + btoa(
              unescape( // https://stackoverflow.com/a/26603875/4223982
                encodeURIComponent(JSON.stringify(storage))
              )
            ),
            filename: 'text-snippets.json',
          })
        })
      })

    // https://stackoverflow.com/a/36930012/4223982
    document
      .getElementById('import-button')
      .addEventListener('click', _ => {
        const fileChooser = document.createElement('input')
        fileChooser.type = 'file'
        fileChooser.addEventListener('change', _ => {
          const file = fileChooser.files[0]
          const reader = new FileReader()
          reader.onload = _ => {
            const storage = JSON.parse('' + reader.result)
            chrome.storage.sync.set(storage, _ => {
              location.reload()
              alert('Imported!')
            })
          }
          reader.readAsText(file)
          form.reset()
        })
        const form = document.createElement('form')
        form.appendChild(fileChooser)
        fileChooser.click()
      })

    const sidePanelModeCheckbox = document.getElementById('side-panel-mode-checkbox')
    sidePanelModeCheckbox.checked = storage.sidePanelMode

    sidePanelModeCheckbox.addEventListener('change', e => {
      if (e.target.checked) {
        chrome.storage.sync.set({sidePanelMode: true})
        close()
        chrome.tabs.query({active: true, currentWindow: true}, tabs => chrome.sidePanel.open({tabId: tabs[0].id}))
        chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: true})
      } else {
        chrome.storage.sync.set({sidePanelMode: false})
        close()
        chrome.sidePanel.setPanelBehavior({openPanelOnActionClick: false})
        chrome.action.openPopup()
      }
    })

  })
})
