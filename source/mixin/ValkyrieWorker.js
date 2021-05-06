import Emitter from "../class/Emitter"
import ValkyrieWorkerContent from "./ValkyrieWorkerContent"

function eventToData(event) {
  const data = event.data
  if (typeof data === `string` && data[0] === `{`) {
    try { return new Function(`return ${ data };`)() } catch (error) {}
  }
  return { type: `text`, text: data }
}
function dataToEvent(data) {
  if (data.type === `text`) return { data: data.text }
  return { data: JSON.stringify(data) }
}

// String => Blob
const WebWorkerContentBlob = new Blob([ValkyrieWorkerContent])
// Blob => URL
const WebWorkerContentURL = URL.createObjectURL(WebWorkerContentBlob)
// 子线程 Worker 对象
const ValkyrieWebWorker = new Worker(WebWorkerContentURL)

// 伪 WebSocket 中间件
const ValkyrieWebSocket = {
  readyState: 0,
  onopen: () => {},
  onclose: () => {},
  onerror: () => {},
  onmessage: () => {},
}
// 重写全局 WebSocket 类
unsafeWindow.WebSocket = function(uri) {
  ValkyrieWebWorker.postMessage({ type: `create`, args: [uri] })
}
unsafeWindow.WebSocket.prototype = {
  set onopen(fn) {
    ValkyrieWebSocket.onopen = fn
  },
  set onclose(fn) {
    ValkyrieWebSocket.onclose = fn
  },
  set onerror(fn) {
    ValkyrieWebSocket.onerror = fn
  },
  set onmessage(fn) {
    ValkyrieWebSocket.onmessage = fn
  },
  get readyState() {
    return ValkyrieWebSocket.readyState
  },
  send(command) {
    sendCommand(command)
  },
}

// Worker 线程事件
ValkyrieWebWorker.onmessage = event => {
  const type = event.data.type
  const args = event.data.args
  // 处理函数集合
  const handlers = {
    onopen: event => {
      ValkyrieWebSocket.onopen(event)
    },
    onclose: event => {
      ValkyrieWebSocket.onclose(event)
    },
    onerror: event => {
      ValkyrieWebSocket.onerror(event)
    },
    onmessage: event => {
      onData(eventToData(event))
    },
    readyState: value => {
      ValkyrieWebSocket.readyState = value
    },
  }
  try {
    handlers[type](...args)
  } catch (error) {
    console.log(type)
    console.log(...args)
    console.error(error)
  }
}

// 监听器
const ValkyrieEmitter = new Emitter()

// 接收 Worker 线程中的 WebSocket 的 data 数据
function onData(data) {
  // 输出数据
  console.log(data)
  // 触发事件
  const type = data.dialog || data.type
  ValkyrieEmitter.emit(type, data)
  // 返回至 WebSocket.onmessage 中处理
  ValkyrieWebSocket.onmessage(dataToEvent(data))
}
// data.type === `text`
function onText(text, tag) {
  if (tag) {
    text = `<${tag}>${text}</${tag}>`
  }
  onData({ type: `text`, text })
}
function sendCommand(command) {
  ValkyrieWebWorker.postMessage({ type: `sendCommand`, args: [command] })
  onData({ type: `sendCommand`, command })
}
function sendCommands(...args) {
  ValkyrieWebWorker.postMessage({ type: `sendCommands`, args })
  onData({ type: `sendCommands`, args })
}
function stopCommands() {
  ValkyrieWebWorker.postMessage({ type: `stopCommands` })
  onData({ type: `stopCommands` })
}

export default {
  data() {
    return {
      id: ``,
      name: ``,
      serverText: ``,
      idListCache: [],

      documentWidth: 0,
    }
  },
  methods: {
    onData,
    onText,
    sendCommand,
    sendCommands,
    stopCommands,
    send: sendCommands,
    // 注册监听事件
    on(type, handler) {
      // 绑定 this 便于调用自身属性和方法
      return ValkyrieEmitter.on(type, handler.bind(this))
    },
    setCookie(name, value) {
      document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
      return true
    },
    getCookie(name) {
      const cookies = document.cookie.split(`;`).reduce((cookies, cookieString) => {
        const i = cookieString.indexOf(`=`)
        const name = cookieString.substr(0, i).trim()
        const value = cookieString.substr(i + 1)
        cookies[name] = value
        return cookies
      }, {})
      return cookies[name]
    },
    setIdList(value) {
      if (value instanceof Array) {
        localStorage.setItem(`__roles__`, JSON.stringify(value))
      }
    },
    getIdList() {
      const string = localStorage.getItem(`__roles__`) || `[]`
      return JSON.parse(string)
    },
    getValue(key) {
      if (this.id) {
        const object = JSON.parse(localStorage.getItem(this.id) || `{}`)
        return object[key] || {}
      }
    },
    setValue(key, value) {
      if (this.id) {
        const object = JSON.parse(localStorage.getItem(this.id) || `{}`)
        object[key] = value
        localStorage.setItem(this.id, JSON.stringify(object))
        return object
      }
    },
    hasOwn(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop)
    },
  },
  mounted() {
    // 角色列表
    this.on(`roles`, function(data) {
      if (data.roles instanceof Array) {
        data.roles.forEach(item => this.idListCache.push(item))
      }
    })
    // 监听 id 值
    this.on(`login`, function(data) {
      const item = this.idListCache.find(x => x.id === data.id)
      if (item) {
        const { id, name, title } = item
        const cookies = {
          u: this.getCookie(`u`),
          p: this.getCookie(`p`),
          s: this.getCookie(`s`),
        }
        const token = `${ cookies.u } ${ cookies.p }`
        const server = [`一区`, `二区`, `三区`, `四区`, `五区`, `六区`][cookies.s]

        // 获取本地 idList
        const idList = this.getIdList()
        const index = idList.findIndex(x => x.id === id)
        if (index !== -1) {
          idList.splice(index, 1) // 找到就删
        }
        // 插入至首位
        idList.unshift({ id, name, title, server, cookies, token })
        // 保存
        this.setIdList(idList)

        this.id = id
        this.name = name
        this.serverText = server
        unsafeWindow.id = id // 全局标识
      }
    })
    // 监听窗口的宽度
    if (document && document.body && document.body.clientWidth) {
      this.documentWidth = document.body.clientWidth
    }
    // 此处必须使用箭头函数使 this 指向 Vue 实例
    unsafeWindow.addEventListener(`resize`, () => {
      this.documentWidth = document.body.clientWidth
    })

  },
}
