var websocket

const handlers = {
  createWebSocket(uri) {
    websocket = new WebSocket(uri)
    websocket.onopen = function(event) {
      console.log('ValkyrieWorker: WebSocket.onopen', event)
      postMessage({ type: 'setReadyState', args: [websocket.readyState] })
      postMessage({ type: 'websocketOnopen', args: [] })
    }
    websocket.onclose = function(event) {
      console.log('ValkyrieWorker: WebSocket.onclose', event)
      postMessage({ type: 'setReadyState', args: [websocket.readyState] })
      postMessage({ type: 'websocketOnclose', args: [] })
    }
    websocket.onerror = function(event) {
      console.log('ValkyrieWorker: WebSocket.onerror', event)
      postMessage({ type: 'setReadyState', args: [websocket.readyState] })
      postMessage({ type: 'websocketOnerror', args: [] })
    }
    websocket.onmessage = function(event) {
      postMessage({ type: 'websocketOnmessage', args: [{ data: event.data }] })
    }
  },
  sendCommand(command) {
    websocket.send(command)
  },
}

onmessage = function(event) {
  try {
    const type = event.data.type
    const args = event.data.args
    handlers[type](...args)
  } catch (error) {
    console.error(error)
  }
}
