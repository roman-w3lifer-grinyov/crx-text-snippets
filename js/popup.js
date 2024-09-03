
/* global chrome */

window.addEventListener('DOMContentLoaded', _ => {
  const minNumberOfTrs = 2
  const numberOfTds = 10

  const editText = 'Edit'
  const saveText = 'Save'

  const charSnippetsEditButton = document.getElementById('char-snippets__edit-button')
  charSnippetsEditButton.textContent = editText
  const charSnippetsTbody = document.querySelector('#char-snippets__table tbody')
  const charSnippetsAddRowButton = document.getElementById('char-snippets__add-row-button')

  const textSnippetsEditButton = document.getElementById('text-snippets__edit-button')
  textSnippetsEditButton.textContent = editText
  const textSnippetsTbody = document.querySelector('#text-snippets__table tbody')
  const textSnippetsAddSnippetButton = document.getElementById('text-snippets__add-snippet-button')

  chrome.storage.sync.get(storage => {

    /*
     * =================================================================================================================
     * CHAR SNIPPETS
     * =================================================================================================================
     */

    let key = 0
    let numberOfRows = storage.snippets.char.length < minNumberOfTrs * numberOfTds
      ? minNumberOfTrs
      : storage.snippets.char.length / numberOfTds
    for (let i = 0; i < numberOfRows; i++) {
      let tr = document.createElement('tr')
      for (let j = 0; j < numberOfTds; j++) {
        let td = document.createElement('td')
        let input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('readonly', 'true')
        input.classList.add('copyable')
        input.value = storage.snippets.char[key] || ''
        if (i >= minNumberOfTrs && (j + 1) % numberOfTds === 0) {
          td.appendChild(getCharSnippetsDeleteRowButton())
        }
        td.appendChild(input)
        tr.appendChild(td)
        key++
      }
      charSnippetsTbody.appendChild(tr)
    }

    charSnippetsEditButton.addEventListener('click', _ => {
      if (charSnippetsEditButton.textContent === saveText) {
        const snippets = []
        charSnippetsTbody.querySelectorAll('input').forEach(input => {
          input.setAttribute('readonly', 'true')
          input.classList.add('copyable')
          snippets.push(input.value)
        })
        chrome.storage.sync.get(storage => {
          storage.snippets.char = snippets
          chrome.storage.sync.set(storage)
          charSnippetsEditButton.textContent = editText
        })
      } else {
        charSnippetsTbody.querySelectorAll('input').forEach(input => {
          input.removeAttribute('readonly')
          input.classList.remove('copyable')
        })
        charSnippetsEditButton.textContent = saveText
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
      copySnippet(event, 'char-snippets__copied')
    })

    document.getElementById('char-snippets__clear-all-button').addEventListener('click', _ => {
      if (!confirm('Are you sure you want to delete all char snippets?')) {
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

    numberOfRows = storage.snippets.text.length <= minNumberOfTrs
      ? minNumberOfTrs
      : storage.snippets.text.length
    for (let i = 0; i < numberOfRows; i++) {
      let tr = document.createElement('tr')
      let td = document.createElement('td')
      let textarea = document.createElement('textarea')
      textarea.setAttribute('readonly', 'true')
      textarea.classList.add('copyable')
      textarea.value = storage.snippets.text[i] || ''
      if (i >= minNumberOfTrs) {
        td.appendChild(getTextSnippetDeleteRowButton())
      }
      td.appendChild(textarea)
      tr.appendChild(td)
      textSnippetsTbody.appendChild(tr)
    }

    textSnippetsEditButton.addEventListener('click', _ => {
      if (textSnippetsEditButton.textContent === saveText) {
        const snippets = []
        textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => {
          textarea.setAttribute('readonly', 'true')
          textarea.classList.add('copyable')
          snippets.push(textarea.value)
        })
        chrome.storage.sync.get(storage => {
          storage.snippets.text = snippets
          chrome.storage.sync.set(storage)
          textSnippetsEditButton.textContent = editText
        })
      } else {
        textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => {
          textarea.removeAttribute('readonly')
          textarea.classList.remove('copyable')
        })
        textSnippetsEditButton.textContent = saveText
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
      copySnippet(event, 'text-snippets__copied')
    })

    document.getElementById('text-snippets__clear-all-button').addEventListener('click', _ => {
      if (!confirm('Are you sure you want to delete all text snippets?')) {
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
    storage.snippets.char = snippets
    chrome.storage.sync.set(storage)
  }

  function setTextSnippets(storage)
  {
    const snippets = []
    textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => snippets.push(textarea.value))
    storage.snippets.text = snippets
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
    event.target.classList.add('copied')
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
   * TEXT SNIPPETS
   * =================================================================================================================
   */

  document.getElementById('export-import-button').addEventListener('click', _ => chrome.runtime.openOptionsPage())
})
