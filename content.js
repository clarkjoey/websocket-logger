let OriginalWebSocket = window.WebSocket;

window.WebSocket = function (url, protocols) {
  let socket = protocols ? new OriginalWebSocket(url, protocols) : new OriginalWebSocket(url);

  socket.addEventListener('message', function (event) {
    chrome.runtime.sendMessage({
      action: 'logMessage',
      direction: 'incoming',
      data: safeJson(event.data)
    });
  });

  let originalSend = socket.send;
  socket.send = function (data) {
    chrome.runtime.sendMessage({
      action: 'logMessage',
      direction: 'outgoing',
      data: safeJson(data)
    });
    return originalSend.apply(this, arguments);
  };

  return socket;
};

function safeJson(data) {
  try {
    return JSON.parse(data);
  } catch (e) {
    return data;
  }
};