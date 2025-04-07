let filterInput = document.getElementById('filter')

document.getElementById('start').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'startRecording' })
});

document.getElementById('stop').addEventListener('click', () => {
  chrome.runtime.sendMessage({ action: 'stopRecording' })
});

document.getElementById('download').addEventListener('click', () => {
  let keyword = filterInput.value.trim()
  chrome.runtime.sendMessage({ action: 'downloadLog', keyword })
});