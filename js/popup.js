;'use strict';

/* global chrome */

window.addEventListener('DOMContentLoaded', () => {
  const minNumberOfTrs = 3;
  const numberOfTds = 10;

  const editText = 'Edit';
  const saveText = 'Save';
  const charSnippetEditButton = document.getElementById('char-snippet__edit-button');
  charSnippetEditButton.textContent = editText;
  const tbody = document.querySelector('tbody');
  const charSnippetAddRowButton = document.getElementById('char-snippet__add-row-button');

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
        tbody.appendChild(tr);
        const snippets = [];
        tbody.querySelectorAll('input').forEach(input => {
          snippets.push(input.value);
        });
        storage.snippets.char = snippets;
        chrome.storage.sync.set(storage);
      });
    });

    tbody.addEventListener('click', () => {})
  });
});
