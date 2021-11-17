;'use strict';

/* global chrome */

window.addEventListener('DOMContentLoaded', () => {
  /**
   * @see https://stackoverflow.com/a/23167789/4223982
   */
  document
    .getElementById('export-button')
    .addEventListener('click', () => {
      chrome.storage.sync.get(storage => {
        chrome.downloads.download({
          url: 'data:application/json;base64,' + btoa(
            unescape( // https://stackoverflow.com/a/26603875/4223982
              encodeURIComponent(JSON.stringify(storage))
            )
          ),
          filename: 'text-snippets.json',
        });
      });
    });

  /**
   * @see https://stackoverflow.com/a/36930012/4223982
   */
  document
    .getElementById('import-button')
    .addEventListener('click', () => {
      const fileChooser = document.createElement('input');
      fileChooser.type = 'file';
      fileChooser.addEventListener('change', () => {
        const file = fileChooser.files[0];
        const reader = new FileReader();
        reader.onload = () => {
          const storage = JSON.parse('' + reader.result);
          chrome.storage.sync.set(storage, () => alert('Imported!'));
        };
        reader.readAsText(file);
        form.reset();
      });
      const form = document.createElement('form');
      form.appendChild(fileChooser);
      fileChooser.click();
    });
});
