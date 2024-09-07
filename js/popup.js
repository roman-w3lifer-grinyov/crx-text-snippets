
/* global chrome */

window.addEventListener('DOMContentLoaded', _ => {

  const app = {}
  app.minNumberOfTrs = 2
  app.numberOfTds = 10
  app.editText = 'Edit'
  app.saveText = 'Save'

  const charSnippetsEditButton = document.getElementById('char-snippets-edit-save-button')
  charSnippetsEditButton.textContent = app.editText
  const charSnippetsTbody = document.querySelector('#char-snippets-table tbody')
  const charSnippetsAddRowButton = document.getElementById('char-snippets-add-row-button')

  const textSnippetsEditButton = document.getElementById('text-snippets-edit-save-button')
  textSnippetsEditButton.textContent = app.editText
  const textSnippetsTbody = document.querySelector('#text-snippets-table tbody')
  const textSnippetsAddSnippetButton = document.getElementById('text-snippets-add-snippet-button')

  chrome.storage.sync.get(storage => {

    /*
     * =================================================================================================================
     * CHAR SNIPPETS
     * =================================================================================================================
     */

    let key = 0
    let numberOfRows = storage.snippets.charSnippets.length < app.minNumberOfTrs * app.numberOfTds
      ? app.minNumberOfTrs
      : storage.snippets.charSnippets.length / app.numberOfTds
    for (let i = 0; i < numberOfRows; i++) {
      let tr = document.createElement('tr')
      for (let j = 0; j < app.numberOfTds; j++) {
        let td = document.createElement('td')
        let input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('readonly', 'true')
        input.classList.add('copyable')
        input.value = storage.snippets.charSnippets[key] || ''
        if (i >= app.minNumberOfTrs && (j + 1) % app.numberOfTds === 0) {
          td.appendChild(getCharSnippetsDeleteRowButton())
        }
        td.appendChild(input)
        tr.appendChild(td)
        key++
      }
      charSnippetsTbody.appendChild(tr)
    }

    charSnippetsEditButton.addEventListener('click', _ => {
      if (charSnippetsEditButton.textContent === app.saveText) {
        const snippets = []
        charSnippetsTbody.querySelectorAll('input').forEach(input => {
          input.setAttribute('readonly', 'true')
          input.classList.add('copyable')
          snippets.push(input.value)
        })
        chrome.storage.sync.get(storage => {
          storage.snippets.charSnippets = snippets
          chrome.storage.sync.set(storage)
          charSnippetsEditButton.textContent = app.editText
        })
      } else {
        charSnippetsTbody.querySelectorAll('input').forEach(input => {
          input.removeAttribute('readonly')
          input.classList.remove('copyable')
        })
        charSnippetsEditButton.textContent = app.saveText
      }
    })

    charSnippetsAddRowButton.addEventListener('click', _ => {
      chrome.storage.sync.get(storage => {
        const tr = charSnippetsTbody.querySelector('tr:last-child').cloneNode(true)
        tr.childNodes.forEach(td => td.querySelector('input').value = '')
        tr.lastChild.appendChild(getCharSnippetsDeleteRowButton())
        charSnippetsTbody.appendChild(tr)
        setCharSnippets(storage)
      })
    })

    charSnippetsTbody.addEventListener('click', event => {
      if (event.target.classList.contains('delete-row-button')) {
        chrome.storage.sync.get(storage => {
          event.target.closest('tr').remove()
          setCharSnippets(storage)
        })
      }
      copySnippet(event, 'char-snippets-notification-box')
    })

    document.getElementById('char-snippets-clear-all-button').addEventListener('click', _ => {
      if (!confirm('Your char snippets will be deleted!')) {
        return
      }
      chrome.storage.sync.get(storage => {
        charSnippetsTbody.querySelectorAll('input').forEach(input => input.value = '')
        setCharSnippets(storage)
      })
    })

    /*
     * =================================================================================================================
     * TEXT SNIPPETS
     * =================================================================================================================
     */

    numberOfRows = storage.snippets.textSnippets.length <= app.minNumberOfTrs
      ? app.minNumberOfTrs
      : storage.snippets.textSnippets.length
    for (let i = 0; i < numberOfRows; i++) {
      let tr = document.createElement('tr')
      let td = document.createElement('td')
      let textarea = document.createElement('textarea')
      textarea.setAttribute('readonly', 'true')
      textarea.classList.add('copyable')
      textarea.value = storage.snippets.textSnippets[i] || ''
      if (i >= app.minNumberOfTrs) {
        td.appendChild(getTextSnippetDeleteRowButton())
      }
      td.appendChild(textarea)
      tr.appendChild(td)
      textSnippetsTbody.appendChild(tr)
    }

    textSnippetsEditButton.addEventListener('click', _ => {
      if (textSnippetsEditButton.textContent === app.saveText) {
        const snippets = []
        textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => {
          textarea.setAttribute('readonly', 'true')
          textarea.classList.add('copyable')
          snippets.push(textarea.value)
        })
        chrome.storage.sync.get(storage => {
          storage.snippets.textSnippets = snippets
          chrome.storage.sync.set(storage)
          textSnippetsEditButton.textContent = app.editText
        })
      } else {
        textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => {
          textarea.removeAttribute('readonly')
          textarea.classList.remove('copyable')
        })
        textSnippetsEditButton.textContent = app.saveText
      }
    })

    textSnippetsAddSnippetButton.addEventListener('click', _ => {
      chrome.storage.sync.get(storage => {
        const tr = textSnippetsTbody.querySelector('tr:last-child').cloneNode(true)
        tr.querySelector('textarea').value = ''
        tr.lastChild.appendChild(getTextSnippetDeleteRowButton())
        textSnippetsTbody.appendChild(tr)
        setTextSnippets(storage)
      })
    })

    textSnippetsTbody.addEventListener('click', event => {
      if (event.target.classList.contains('delete-snippet-button')) {
        chrome.storage.sync.get(storage => {
          event.target.closest('tr').remove()
          setTextSnippets(storage)
        })
      }
      copySnippet(event, 'text-snippets-notification-box')
    })

    document.getElementById('text-snippets-clear-all-button').addEventListener('click', _ => {
      if (!confirm('Your text snippets will be deleted!')) {
        return
      }
      chrome.storage.sync.get(storage => {
        textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => textarea.value = '')
        setTextSnippets(storage)
      })
    })

  })

  function setCharSnippets(storage)
  {
    const snippets = []
    charSnippetsTbody.querySelectorAll('input').forEach(input => snippets.push(input.value))
    storage.snippets.charSnippets = snippets
    chrome.storage.sync.set(storage)
  }

  function setTextSnippets(storage)
  {
    const snippets = []
    textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => snippets.push(textarea.value))
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
    if (!event.target.classList.contains('copyable')) {
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
      event.target.classList.remove('copied')
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

  charSnippetsTbody.addEventListener('input', _ => chrome.storage.sync.get(storage => setCharSnippets(storage)))
  textSnippetsTbody.addEventListener('input', _ => chrome.storage.sync.get(storage => setTextSnippets(storage)))

  /*
   * =================================================================================================================
   * EXPORT/IMPORT BUTTONS
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
          chrome.storage.sync.set(storage, _ => alert('Imported!'))
        }
        reader.readAsText(file)
        form.reset()
      })
      const form = document.createElement('form')
      form.appendChild(fileChooser)
      fileChooser.click()
    })

})
