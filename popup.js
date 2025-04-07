document.addEventListener('DOMContentLoaded', () => {
    let filterInput = document.getElementById('filter');
    let statusEl = document.getElementById('status');

    document.getElementById('start').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'startRecording' });
        chrome.storage.local.set({ websocketRecording: true });
        updateStatus(true);
    });

    document.getElementById('stop').addEventListener('click', () => {
        chrome.runtime.sendMessage({ action: 'stopRecording' });
        chrome.storage.local.set({ websocketRecording: false });
        updateStatus(false);
    });

    document.getElementById('download').addEventListener('click', () => {
        let keyword = filterInput.value.trim();
        chrome.runtime.sendMessage({ action: 'downloadLog', keyword });
    });

    function updateStatus(isRecording) {
        statusEl.textContent = isRecording ? 'Status: Recording...' : 'Status: Not recording';
        statusEl.style.color = isRecording ? 'green' : 'red';
    }

    chrome.storage.local.get('websocketRecording', (data) => {
        updateStatus(data.websocketRecording);
    });

    chrome.runtime.onMessage.addListener((message) => {
        if (message.action === 'downloadReady') {
            let json = JSON.stringify(message.log, null, 2);
            let blob = new Blob([json], { type: 'application/json' });
            let url = URL.createObjectURL(blob);

            let a = document.createElement('a');
            a.href = url;
            a.download = `websocket-log-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    });
});
