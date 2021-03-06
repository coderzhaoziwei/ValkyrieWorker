import WorkerContent from './worker.js'

(function() {
  if (unsafeWindow.ValkyrieWorkerTag === true) return
  unsafeWindow.ValkyrieWorkerTag = true

  console.log(GM_info.script.name, GM_info.script.version)

  const workerBlob = new Blob([WorkerContent])
  const workerURL = URL.createObjectURL(workerBlob)
  const worker = new Worker(workerURL)
  const postMessage = function(data) {
    worker.postMessage(data)
  }

  const websocket = {
    readyState: 0,
    onopen: () => {},
    onclose: () => {},
    onerror: () => {},
    onmessage: () => {},
  }

  const handlers = {
    setReadyState(value) {
      console.log('set websocket.readyState: ', value)
      websocket.readyState = value
    },
    websocketOnopen() {
      websocket.onopen()
    },
    websocketOnclose() {
      websocket.onclose()
    },
    websocketOnerror(event) {
      websocket.onerror(event)
    },
    websocketOnmessage(event) {
      websocket.onmessage(event)
    },
  }

  worker.onmessage = function(event) {
    try {
      const type = event.data.type
      const args = event.data.args
      handlers[type](...args)
    } catch (error) {
      console.error(data)
      console.error(error)
    }
  }

  unsafeWindow.WebSocket = function(uri) {
    postMessage({ type: 'createWebSocket', args: [uri] })
  }
  unsafeWindow.WebSocket.prototype = {
    set onopen(fn) {
      console.log('set websocket.onopen')
      websocket.onopen = fn
    },
    set onclose(fn) {
      console.log('set websocket.onclose')
      websocket.onclose = fn
    },
    set onerror(fn) {
      console.log('set websocket.onerror')
      websocket.onerror = fn
    },
    set onmessage(fn) {
      console.log('set websocket.onmessage')
      websocket.onmessage = fn
    },
    get readyState() {
      return websocket.readyState
    },
    send(command) {
      postMessage({ type: 'sendCommand', args: [command] })
    },
  }

})()
