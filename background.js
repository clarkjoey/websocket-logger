let isRecording = false;
let logs = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'startRecording') {
    isRecording = true;
    logs = [];
  }

  if (message.action === 'stopRecording') {
    isRecording = false;
  }

  if (message.action === 'logMessage' && isRecording) {
    logs.push({
      direction: message.direction,
      data: message.data,
      timestamp: new Date().toISOString()
    });
  }

  if (message.action === 'downloadLog') {
    let keyword = message.keyword?.toLowerCase();
    let filtered = logs.filter(entry => {
      return !keyword || JSON.stringify(entry.data).toLowerCase().includes(keyword);
    });

    let blob = new Blob([JSON.stringify(filtered, null, 2)], { type: 'application/json' });
    let url = URL.createObjectURL(blob);

    chrome.downloads.download({
      url,
      filename: `websocket-log-${Date.now()}.json`
    });
  }
});