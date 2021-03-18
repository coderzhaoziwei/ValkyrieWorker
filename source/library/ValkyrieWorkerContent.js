const worker = {
  websocket: undefined,
  commands: [],
  sendState: false,
}

const handlers = {
  createWebSocket(uri) {
    worker.websocket = new WebSocket(uri)
    worker.websocket.onopen = function() {
      console.log('ValkyrieWorker: WebSocket.onopen')
      postMessage({ type: 'setReadyState', args: [worker.websocket.readyState] })
      postMessage({ type: 'websocketOnopen', args: [] })
    }
    worker.websocket.onclose = function() {
      console.log('ValkyrieWorker: WebSocket.onclose')
      postMessage({ type: 'setReadyState', args: [worker.websocket.readyState] })
      postMessage({ type: 'websocketOnclose', args: [] })
    }
    worker.websocket.onerror = function() {
      console.log('ValkyrieWorker: WebSocket.onerror')
      postMessage({ type: 'setReadyState', args: [worker.websocket.readyState] })
      postMessage({ type: 'websocketOnerror', args: [] })
    }
    worker.websocket.onmessage = function(event) {
      postMessage({ type: 'websocketOnmessage', args: [{ data: event.data }] })
    }
  },
  sendCommand(command) {
    worker.websocket.send(command)
  },
  sendCommands(...args) {
    args = args.flat(Infinity)
    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(',')))
    args = args.flat(Infinity)

    worker.commands.push(...args)
    if (worker.sendState === false) {
      worker.sendState = true
      sendLoop(0)
    }
  },
}

function sendLoop(ms = 256) {
  const command = worker.commands.splice(0, 1)[0]
  /* 1. undefined */
  if (command === undefined) {
    worker.sendState = false
    return
  }
  /* 2. number */
  if (isNaN(Number(command)) === false) {
    sendLoop(Number(command))
    return
  }
  /* 3. string */
  if (typeof command === 'string') {
    setTimeout(() => {
      handlers.sendCommand(command)
      sendLoop()
    }, ms)
  }
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
