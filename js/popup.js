;'use strict';

/* global chrome */

window.addEventListener('DOMContentLoaded', () => {
  let inputs = null;

  const tbody = document.querySelector('tbody');
  chrome.storage.sync.get(storage => {
    for (let i = 0; i < storage.trs.quantity; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < storage.tds.quantity; j++) {
        let td = document.createElement('td');
        let input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('disabled', 'true');
        td.appendChild(input);
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    inputs = tbody.querySelectorAll('input');
  });

  const edit = document.getElementById('edit-button');
  edit.addEventListener('click', event => {
    event.preventDefault();
    if (edit.getAttribute('data-editing')) {
      inputs.forEach(input => input.setAttribute('disabled', 'true'));
      edit.textContent = 'Edit';
      edit.removeAttribute('data-editing');
    } else {
      inputs.forEach(input => input.removeAttribute('disabled'));
      edit.textContent = 'Save';
      edit.setAttribute('data-editing', 'true');
    }
  });
});
