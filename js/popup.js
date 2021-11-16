;'use strict';

/* global chrome */

window.addEventListener('DOMContentLoaded', () => {
  const minNumberOfTrs = 2;
  const numberOfTds = 10;

  const editText = 'Edit';
  const saveText = 'Save';

  const charSnippetsEditButton = document.getElementById('char-snippets__edit-button');
  charSnippetsEditButton.textContent = editText;
  const charSnippetsTbody = document.querySelector('#char-snippets__table tbody');
  const charSnippetsAddRowButton = document.getElementById('char-snippets__add-row-button');

  const textSnippetsEditButton = document.getElementById('text-snippets__edit-button');
  textSnippetsEditButton.textContent = editText;
  const textSnippetsTbody = document.querySelector('#text-snippets__table tbody');
  const textSnippetsAddSnippetButton = document.getElementById('text-snippets__add-snippet-button');

  chrome.storage.sync.get(storage => {

    /*
     * =================================================================================================================
     * CHAR SNIPPETS
     * =================================================================================================================
     */

    let key = 0;
    let numberOfRows = storage.snippets.char.length < minNumberOfTrs * numberOfTds
      ? minNumberOfTrs
      : storage.snippets.char.length / numberOfTds;
    for (let i = 0; i < numberOfRows; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < numberOfTds; j++) {
        let td = document.createElement('td');
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('maxlength', '1');
        input.setAttribute('disabled', 'true');
        input.value = storage.snippets.char[key] || '';
        if (i >= minNumberOfTrs && (j + 1) % numberOfTds === 0) {
          td.appendChild(getCharSnippetDeleteRowButton());
        }
        td.appendChild(input);
        tr.appendChild(td);
        key++;
      }
      charSnippetsTbody.appendChild(tr);
    }

    charSnippetsEditButton.addEventListener('click', () => {
      if (charSnippetsEditButton.textContent === saveText) {
        const snippets = [];
        charSnippetsTbody.querySelectorAll('input').forEach(input => {
          input.setAttribute('disabled', 'true');
          snippets.push(input.value);
        });
        chrome.storage.sync.get(storage => {
          storage.snippets.char = snippets;
          chrome.storage.sync.set(storage);
          charSnippetsEditButton.textContent = editText;
        });
      } else {
        charSnippetsTbody.querySelectorAll('input').forEach(input => input.removeAttribute('disabled'));
        charSnippetsEditButton.textContent = saveText;
      }
    });

    charSnippetsAddRowButton.addEventListener('click', () => {
      chrome.storage.sync.get(storage => {
        const tr = charSnippetsTbody.querySelector('tr:last-child').cloneNode(true);
        tr.childNodes.forEach(td => td.querySelector('input').value = '');
        tr.lastChild.appendChild(getCharSnippetDeleteRowButton());
        charSnippetsTbody.appendChild(tr);
        setCharSnippets(storage);
      });
    });

    charSnippetsTbody.addEventListener('click', event => {
      if (event.target.classList.contains('delete-row-button')) {
        chrome.storage.sync.get(storage => {
          event.target.closest('tr').remove();
          setCharSnippets(storage);
        });
      }
    });

    /*
     * =================================================================================================================
     * TEXT SNIPPETS
     * =================================================================================================================
     */

    numberOfRows = storage.snippets.text.length <= minNumberOfTrs
      ? minNumberOfTrs
      : storage.snippets.text.length;
    for (let i = 0; i < numberOfRows; i++) {
      let tr = document.createElement('tr');
      let td = document.createElement('td');
      let textarea = document.createElement('textarea');
      textarea.setAttribute('disabled', 'true');
      textarea.value = storage.snippets.text[i] || '';
      if (i >= minNumberOfTrs) {
        td.appendChild(getTextSnippetDeleteRowButton());
      }
      td.appendChild(textarea);
      tr.appendChild(td);
      textSnippetsTbody.appendChild(tr);
    }

    textSnippetsEditButton.addEventListener('click', () => {
      if (textSnippetsEditButton.textContent === saveText) {
        const snippets = [];
        textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => {
          textarea.setAttribute('disabled', 'true');
          snippets.push(textarea.value);
        });
        chrome.storage.sync.get(storage => {
          storage.snippets.text = snippets;
          chrome.storage.sync.set(storage);
          textSnippetsEditButton.textContent = editText;
        });
      } else {
        textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => textarea.removeAttribute('disabled'));
        textSnippetsEditButton.textContent = saveText;
      }
    });

    textSnippetsAddSnippetButton.addEventListener('click', () => {
      chrome.storage.sync.get(storage => {
        const tr = textSnippetsTbody.querySelector('tr:last-child').cloneNode(true);
        tr.querySelector('textarea').value = '';
        tr.lastChild.appendChild(getTextSnippetDeleteRowButton());
        textSnippetsTbody.appendChild(tr);
        setTextSnippets(storage);
      });
    });

    textSnippetsTbody.addEventListener('click', event => {
      if (event.target.classList.contains('delete-snippet-button')) {
        chrome.storage.sync.get(storage => {
          event.target.closest('tr').remove();
          setTextSnippets(storage);
        });
      }
    });

  });

  function setCharSnippets(storage)
  {
    const snippets = [];
    charSnippetsTbody.querySelectorAll('input').forEach(input => snippets.push(input.value));
    storage.snippets.char = snippets;
    chrome.storage.sync.set(storage);
  }

  function setTextSnippets(storage)
  {
    const snippets = [];
    textSnippetsTbody.querySelectorAll('textarea').forEach(textarea => snippets.push(textarea.value));
    storage.snippets.text = snippets;
    chrome.storage.sync.set(storage);
  }

  function getCharSnippetDeleteRowButton()
  {
    const span = document.createElement('span');
    span.classList.add('delete-row-button');
    span.setAttribute('title', 'Delete row');
    span.textContent = '×';
    return span;
  }

  function getTextSnippetDeleteRowButton()
  {
    const span = document.createElement('span');
    span.classList.add('delete-snippet-button');
    span.setAttribute('title', 'Delete snippet');
    span.textContent = '×';
    return span;
  }

});
