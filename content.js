function injectWebSocketHook() {
    let script = document.createElement('script');
    script.src = chrome.runtime.getURL('injected.js');
    script.onload = () => script.remove();
    (document.head || document.documentElement).appendChild(script);
}

injectWebSocketHook();

window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (event.data?.type === 'WS_LOG') {
        console.log('[content] Forwarding to background:', event.data);
        chrome.runtime.sendMessage({
            action: 'logMessage',
            direction: event.data.direction,
            data: safeJson(event.data.data)
        });
    }
});

function safeJson(data) {
    try {
        return JSON.parse(data);
    } catch (e) {
        return data;
    }
}  