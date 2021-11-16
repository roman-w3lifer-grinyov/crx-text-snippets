;'use strict';

/* global chrome */

window.addEventListener('DOMContentLoaded', () => {
  const minNumberOfTrs = 2;
  const numberOfTds = 10;

  const editText = 'Edit';
  const saveText = 'Save';
  const charSnippetEditButton = document.getElementById('char-snippets__edit-button');
  charSnippetEditButton.textContent = editText;
  const tbody = document.querySelector('#char-snippets__table tbody');
  const charSnippetAddRowButton = document.getElementById('char-snippets__add-row-button');

  chrome.storage.sync.get(storage => {
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
        input.setAttribute('disabled', 'true');
        input.value = storage.snippets.char[key] || '';
        if (i >= minNumberOfTrs && (j + 1) % numberOfTds === 0) {
          td.appendChild(getCharSnippetDeleteRowButton());
        }
        td.appendChild(input);
        tr.appendChild(td);
        key++;
      }
      tbody.appendChild(tr);
    }

    charSnippetEditButton.addEventListener('click', event => {
      event.preventDefault();
      if (charSnippetEditButton.textContent === saveText) {
        const snippets = [];
        tbody.querySelectorAll('input').forEach(input => {
          input.setAttribute('disabled', 'true');
          snippets.push(input.value);
        });
        chrome.storage.sync.get(storage => {
          storage.snippets.char = snippets;
          chrome.storage.sync.set(storage);
          charSnippetEditButton.textContent = editText;
        });
      } else {
        tbody.querySelectorAll('input').forEach(input => input.removeAttribute('disabled'));
        charSnippetEditButton.textContent = saveText;
      }
    });

    charSnippetAddRowButton.addEventListener('click', event => {
      event.preventDefault();
      chrome.storage.sync.get(storage => {
        const tr = tbody.querySelector('tr:last-child').cloneNode(true);
        tr.childNodes.forEach(td => td.firstChild.value = '');
        tr.lastChild.appendChild(getCharSnippetDeleteRowButton());
        tbody.appendChild(tr);
        setCharSnippets(storage);
      });
    });

    tbody.addEventListener('click', event => {
      if (event.target.classList.contains('delete-row-button')) {
        chrome.storage.sync.get(storage => {
          event.target.closest('tr').remove();
          setCharSnippets(storage);
        });
      }
    });
  });

  function setCharSnippets(storage)
  {
    const snippets = [];
    tbody.querySelectorAll('input').forEach(input => snippets.push(input.value));
    storage.snippets.char = snippets;
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
});
