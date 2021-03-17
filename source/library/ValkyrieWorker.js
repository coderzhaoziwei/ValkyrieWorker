import EventEmitter from './EventEmitter'
import ValkyrieWorkerContent from './ValkyrieWorkerContent.js'

const workerBlob = new Blob([ValkyrieWorkerContent])
const workerURL = URL.createObjectURL(workerBlob)

const eventToData = function(event) {
  const data = event.data
  return data[0] === '{' ? new Function(`return ${ data };`)() : { 'type': 'text', 'text': data }
}
const dataToEvent = function(data) {
  return data.type === 'text' ? { data: data.text } : { data: JSON.stringify(data) }
}

class ValkyrieWorker {
  constructor() {
    this.websocket = {
      readyState: 0,
      onopen: () => {},
      onclose: () => {},
      onerror: () => {},
      onmessage: () => {},
    }
    this.eventEmitter = new EventEmitter()
    this.worker = new Worker(workerURL)
    this.debugMode = false

    const handlers = {
      websocketOnopen: () => this.websocket.onopen(),
      websocketOnclose: () => this.websocket.onclose(),
      websocketOnerror: event => this.websocket.onerror(event),
      websocketOnmessage: event => {
        const data = eventToData(event)
        this.onData(data)
      },
      setReadyState: value => {
        console.log('ValkyrieWorker: WebSocket.readyState', value)
        this.websocket.readyState = value
      },
    }
    this.worker.onmessage = function(event) {
      const type = event.data.type
      const args = event.data.args
      handlers[type](...args)
    }

    const self = this
    unsafeWindow.WebSocket = function(uri) {
      self.worker.postMessage({ type: 'createWebSocket', args: [uri] })
    }
    unsafeWindow.WebSocket.prototype = {
      set onopen(fn) { self.websocket.onopen = fn },
      set onclose(fn) { self.websocket.onclose = fn },
      set onerror(fn) { self.websocket.onerror = fn },
      set onmessage(fn) { self.websocket.onmessage = fn },
      get readyState() { return self.websocket.readyState },
      send(command) { self.sendCommand(command) },
    }
  }
  onData(data) {
    if (this.debugMode === true) console.info(JSON.parse(JSON.stringify(data)))
    const type = data.dialog || data.type
    this.eventEmitter.emit(type, data)

    const event = dataToEvent(data)
    this.websocket.onmessage(event)
  }
  onText(text) {
    this.onData({ type: 'text', text })
  }
  sendCommand(command) {
    this.worker.postMessage({ type: 'sendCommand', args: [command] })
    this.onData({ type: 'sendCommand', command })
  }
  sendCommands(...args) {
    this.worker.postMessage({ type: 'sendCommands', args })
    this.onData({ type: 'sendCommands', args })
  }
  on(type, handler) {
    return this.eventEmitter.on(type, handler)
  }
  once(type, handler) {
    return this.eventEmitter.once(type, handler)
  }
  off(id) {
    this.eventEmitter.off(id)
  }

  hasOwn(any, name) {
    return Object.prototype.hasOwnProperty.call(any, name)
  }
  isArray(any) {
    return any instanceof Array
  }
  isString(any) {
    return typeof any === 'string'
  }
  setCookie(name, value) {
    document.cookie = name + '=' + value
  }
  getCookie(name) {
    const cookies = document.cookie.split(';').reduce((cookies, cookieString) => {
      const i = cookieString.indexOf('=')
      const name = cookieString.substr(0, i).trim()
      const value = cookieString.substr(i + 1)
      cookies[name] = value
      return cookies
    }, {})
    return cookies[name]
  }
  deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  }
  createElement(tag, options) {
    const element = document.createElement(tag)
    Object.keys(options).forEach(name => element.setAttribute(name, options[name]))
    return element
  }


  /* TemperMonkey 的内置方法 */
  // setValue(key, value) {
  //   GM_setValue(key, value)
  // }
  // getValue(key) {
  //   GM_getValue(key)
  // }
  // copyToClipboard(data) {
  //   GM_setClipboard(data, 'text')
  // }
  // downloadByURL(url, filename) {
  //   GM_download(url, filename)
  // }
  // httpRequest(options) {
  //   GM_xmlhttpRequest(options)
  // }
}

export default ValkyrieWorker
