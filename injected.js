(function () {
    console.log('[inject] WebSocket hook script running');

    let OriginalWebSocket = window.WebSocket;

    window.WebSocket = function (url, protocols) {
        console.log('[inject] New WebSocket connection:', url);
        let socket = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

        socket.addEventListener('message', function (event) {
            console.log('[inject] Incoming message:', event.data);
            window.postMessage({
                type: 'WS_LOG',
                direction: 'incoming',
                data: event.data
            }, '*');
        });

        let originalSend = socket.send;
        socket.send = function (data) {
            console.log('[inject] Outgoing message:', data);
            window.postMessage({
                type: 'WS_LOG',
                direction: 'outgoing',
                data: data
            }, '*');
            return originalSend.apply(this, arguments);
        };

        return socket;
    };
})();  