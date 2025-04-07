let isRecording = false;
let logs = [];

function updateBadge(count) {
    chrome.action.setBadgeText({ text: count > 0 ? count.toString() : '' });
    chrome.action.setBadgeBackgroundColor({ color: '#ff3b30' }); // red
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'startRecording') {
        isRecording = true;
        logs = [];
        updateBadge(0);
    }

    if (message.action === 'stopRecording') {
        isRecording = false;
        updateBadge(0);
    }

    if (message.action === 'logMessage' && isRecording) {
        logs.push({
            direction: message.direction,
            data: message.data,
            timestamp: new Date().toISOString()
        });
        updateBadge(logs.length);
    }

    if (message.action === 'downloadLog') {
        let keyword = message.keyword?.toLowerCase();
        let filtered = logs.filter(entry => {
            return !keyword || JSON.stringify(entry.data).toLowerCase().includes(keyword);
        });

        chrome.runtime.sendMessage({
            action: 'downloadReady',
            log: filtered
        });
    }
});