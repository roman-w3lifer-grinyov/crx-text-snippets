
/* global chrome */

window.addEventListener('DOMContentLoaded', _ => {
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
