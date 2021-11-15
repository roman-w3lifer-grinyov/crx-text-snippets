;'use strict';

/* global chrome */

window.addEventListener('DOMContentLoaded', () => {
  const editText = 'Edit';
  const saveText = 'Save';
  const charSnippetEditButton = document.getElementById('char-snippet__edit-button');
  charSnippetEditButton.textContent = editText;

  let inputs = null;

  const tbody = document.querySelector('tbody');
  chrome.storage.sync.get(storage => {
    let key = 0;
    for (let i = 0; i < storage.trs.quantity; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < storage.tds.quantity; j++) {
        let td = document.createElement('td');
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('disabled', 'true');
        input.value = storage.tds.snippets[key] || '';
        td.appendChild(input);
        tr.appendChild(td);
        key++;
      }
      tbody.appendChild(tr);
    }
    inputs = tbody.querySelectorAll('input');

    charSnippetEditButton.addEventListener('click', event => {
      event.preventDefault();
      if (charSnippetEditButton.textContent === saveText) {
        const snippets = {};
        inputs.forEach((input, index) => {
          input.setAttribute('disabled', 'true');
          snippets[index] = input.value;
        });
        chrome.storage.sync.get(storage => {
          storage.tds.snippets = snippets;
          chrome.storage.sync.set(storage);
          charSnippetEditButton.textContent = editText;
        });
      } else {
        inputs.forEach(input => input.removeAttribute('disabled'));
        charSnippetEditButton.textContent = saveText;
      }
    });
  });
});
