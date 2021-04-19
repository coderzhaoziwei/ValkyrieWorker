import WORKER_CONTENT from "./ValkyrieWorker"
import { EventEmitter } from "./GameInstance"

class ValkyrieInstance {
  constructor() {
    this.websocket = this.createWebSocket() // 仅是一个中间对象
    this.worker = this.createWebWorker()
    this.eventEmitter = new EventEmitter()
    this.isDeveloperMode = false // 开发者模式
    this.init()

    this.roles = {}
    this._role = {}
    // 房间
    this.room = { name: ``, path: ``, desc: ``, cmds: [], x: ``, y: `` }
    // 出口
    this.exitList = []
    // 区域地图
    this.map = { svg: ``, width: 0, height: 0 }
    this.roleList = []
    // 属性
    this.score = {}
    this.state = { value: 0, text: ``, detail: `` }
    // 技能
    this.skillList = []
    this.skillLimit = 0
    // 背包
    this.packList = []
    this.equipList = []
    this.packLimit = 0
    this.moneyValue = 0
    // 仓库
    this.storeList = []
    this.storeLimit = 0
    // 商店
    this.seller = ``
    this.sellList = []
    // 聊天列表
    this.chatList = []
    // 任务
    this.smCount = 20
    this.smTotal = 99
    this.smTarget = ``
    this.ymCount = 20
    this.ymTotal = 99
    this.ymTarget = ``
    this.ymTargetX = ``
    this.ymTargetY = ``
    this.ybCount = 20
    this.ybTotal = 99
    this.fbCount = 20
    this.wdCount = 99
    this.wdTotal = 99
    this.wdValue = true
    this.qaValue = true
    this.xyValue = true
    this.mpValue = true // true 表示任务完成
  }
  createWebSocket() {
    return {
      readyState: 0,
      onopen: () => {},
      onclose: () => {},
      onerror: () => {},
      onmessage: () => {},
    }
  }
  createWebWorker() {
    const WORKER_BLOB = new Blob([WORKER_CONTENT])
    const WORKER_URL = URL.createObjectURL(WORKER_BLOB)
    return new Worker(WORKER_URL)
  }
  init() {
    unsafeWindow.console.log = () => {}

    const handlers = {
      websocketOnopen: () => this.websocket.onopen(),
      websocketOnclose: () => this.websocket.onclose(),
      websocketOnerror: event => this.websocket.onerror(event),
      websocketOnmessage: event => this.onData(this.eventToData(event)),
      setReadyState: value => {
        console.log(`ValkyrieWorker: WebSocket.readyState`, value)
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
      self.worker.postMessage({ type: `createWebSocket`, args: [uri] })
    }
    unsafeWindow.WebSocket.prototype = {
      set onopen(fn) {
        self.websocket.onopen = fn
      },
      set onclose(fn) {
        self.websocket.onclose = fn
      },
      set onerror(fn) {
        self.websocket.onerror = fn
      },
      set onmessage(fn) {
        self.websocket.onmessage = fn
      },
      get readyState() {
        return self.websocket.readyState
      },
      send(command) {
        self.sendCommand(command)
      },
    }
  }
  eventToData(event) {
    const data = event.data
    return data[0] === `{` ? new Function(`return ${ data };`)() : { type: `text`, text: data }
  }
  dataToEvent(data) {
    return data.type === `text` ? { data: data.text } : { data: JSON.stringify(data) }
  }
  onData(data) {
    if (this.isDeveloperMode === true) {
      console.info(JSON.parse(JSON.stringify(data)))
    }
    this.eventEmitter.emit(data.dialog || data.type, data)
    this.websocket.onmessage(this.dataToEvent(data))
  }
  onText(text) {
    this.onData({ type: `text`, text })
  }
  sendCommand(command) {
    this.worker.postMessage({ type: `sendCommand`, args: [command] })
    this.onData({ type: `sendCommand`, command })
  }
  sendCommands(...args) {
    this.worker.postMessage({ type: `sendCommands`, args })
    this.onData({ type: `sendCommands`, args })
  }
  on(type, handler) {
    return this.eventEmitter.on(type, handler.bind(this))
  }
  off(id) {
    this.eventEmitter.off(id)
  }
  hasOwn(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }
  getCookie(name) {
    const cookies = document.cookie.split(`;`).reduce((cookies, cookieString) => {
      const i = cookieString.indexOf(`=`)
      const name = cookieString.substr(0, i).trim()
      const value = cookieString.substr(i + 1)
      cookies[name] = value
      return cookies
    }, {})
    return cookies[name]
  }
  setCookie(name, value) {
    document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
    return true
  }
  setLocalRoles(value) {
    if (value instanceof Array) {
      localStorage.setItem(`__roles__`, JSON.stringify(value))
    }
  }
  getLocalRoles() {
    return JSON.parse(localStorage.getItem(`__roles__`) || `[]`)
  }
  // 默认保存角色信息
  get role() {
    return this._role
  }
  set role(value) {
    this._role = value

    const roles = this.getLocalRoles()
    const index = roles.findIndex(item => item.id === value.id)
    if (index === -1) {
      roles.push(value)
    } else {
      roles[index] = value
    }
    this.setLocalRoles(roles)
  }
  // 先天悟性
  get wx1() {
    return Number(this.score.int) || 0
  }
  // 后天悟性
  get wx2() {
    return Number(this.score.int_add) || 0
  }
  // 学习效率
  get xxxl() {
    return parseInt(this.score.study_per ) || 0
  }
  // 练习效率
  get lxxl() {
    return parseInt(this.score.lianxi_per) || 0
  }
  // 练习每一跳消耗＝(先天悟性＋后天悟性)×(1＋练习效率%－先天悟性%)
  get lxCost() {
    return parseInt((this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100))
  }
  // 学习每一跳消耗＝(先天悟性＋后天悟性)×(1＋学习效率%－先天悟性%)×3
  get xxCost() {
    return parseInt((this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3)
  }
  // 当前 NPC 列表
  get npcList() {
    return this.roleList.filter(role => role.isNpc)
  }
  // 气血百分比
  get hpPercentage() {
    return parseInt((this.score.hp / this.score.max_hp) * 100) || 0
  }
  // 内力百分比
  get mpPercentage() {
    return parseInt((this.score.mp / this.score.max_mp) * 100) || 0
  }
  // 性别
  get genderValue() {
    return ['女', '男'].findIndex(item => item === this.score.gender)
  }
}

export default new ValkyrieInstance()
