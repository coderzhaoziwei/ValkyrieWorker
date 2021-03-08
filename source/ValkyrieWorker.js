import EventEmitter from './EventEmitter'
import ValkyrieWorkerContent from './ValkyrieWorkerContent.js'
const workerBlob = new Blob([ValkyrieWorkerContent])
const workerURL = URL.createObjectURL(workerBlob)

export default class ValkyrieWorker {
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

    const self = this
    const handlers = {
      setReadyState(value) {
        console.log('ValkyrieWorker: websocket.readyState =', value)
        self.websocket.readyState = value
      },
      websocketOnopen() {
        self.websocket.onopen()
      },
      websocketOnclose() {
        self.websocket.onclose()
      },
      websocketOnerror(event) {
        self.websocket.onerror(event)
      },
      websocketOnmessage(event) {
        const data = self.eventToData(event)
        self.ondata(data)
      },
    }
    self.worker.onmessage = function(event) {
      try {
        const type = event.data.type
        const args = event.data.args
        handlers[type](...args)
      } catch (error) {
        console.log(event.data)
        console.error(error)
      }
    }
    unsafeWindow.WebSocket = function(uri) {
      self.worker.postMessage({ type: 'createWebSocket', args: [uri] })
    }
    unsafeWindow.WebSocket.prototype = {
      set onopen(fn)    { self.websocket.onopen    = fn    },
      set onclose(fn)   { self.websocket.onclose   = fn    },
      set onerror(fn)   { self.websocket.onerror   = fn    },
      set onmessage(fn) { self.websocket.onmessage = fn    },
      get readyState()  { return self.websocket.readyState },
      send(command) {
        self.worker.postMessage({ type: 'sendCommand', args: [command] })
      },
    }
  }
  ondata(data) {
    const type = data.dialog || data.type
    this.eventEmitter.emit(type, data)

    const event = this.dataToEvent(data)
    this.websocket.onmessage(event)
  }
  ontext(text) {
    this.ondata({ type: 'text', text })
  }
  on(type, handler) {
    this.eventEmitter.on(type, handler)
  }
  once(type, handler) {
    this.eventEmitter.once(type, handler)
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

  /**
   * event <=> data
   * event: WebSocket.onmessage(event) 中的参数
   * data: { type, ... }
   */
  eventToData(event) {
    const data = event.data
    return data[0] === '{' ? new Function(`return ${ data };`)() : { 'type': 'text', 'text': data }
  }
  dataToEvent(data) {
    return data.type === 'text' ? { data: data.text } : { data: JSON.stringify(data) }
  }

  /**
   * name => color
   * 0: 无法判断
   * 1: <wht> 白
   * 2: <hig> 绿
   * 3: <hic> 蓝
   * 4: <hiy> 黄
   * 5: <hiz> 紫
   * 6: <hio> 橙
   * 7: <hir> <ord> 红
   */
  getColorIdByName(name) {
    const index = [
      /^<wht>/i,
      /^<hig>/i,
      /^<hiy>/i,
      /^<hic>/i,
      /^<hiz>/i,
      /^<hio>/i,
      /^<(hir|ord)>/i,
    ].findIndex(regexp => regexp.test(name))
    if (index === -1 && /^<...>/i.test(name)) {
      console.error(name)
    }
    return index + 1
  }

}
