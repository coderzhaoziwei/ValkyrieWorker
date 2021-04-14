/* 事件类 */
export default class EventEmitter {
  constructor() {
    this.id = 0
    this.types = {}
    this.handlers = {}
  }
  on(type, handler) {
    const id = ++ this.id
    if (!this.types[type]) this.types[type] = []
    this.types[type].push(id)
    this.handlers[id] = { id, type, handler }
    return id
  }
  off(id) {
    const handler = this.handlers[id]
    delete this.handlers[id]

    const type = handler.type
    const index = this.types[type].findIndex(item => item === id)
    delete this.types[type][index]
  }
  emit(type, data) {
    const ids = this.types[type]
    if (ids instanceof Array) {
      ids.forEach(id => {
        const { handler, once } = this.handlers[id]
        if (typeof handler === `function`) handler(data)
        if (once === true) this.off(id)
      })
    }
  }
}
