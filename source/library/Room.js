import Role from './Role'

class Room {
  constructor() {
    this.name = ''
    this.path = ''
    this.desc = ''
    this.cmds = []
    this.list = []
    this.exit = {}
    this.dirs = {}
  }
  get nameList() {
    return this.name.split(/-|\(|\)/)
  }
  get x() {
    return this.nameList[0]
  }
  get y() {
    return this.nameList[1]
  }

  get npcList() {
    return this.list.filter(item => item.isNpc)
  }


  updateRoom(data) {
    const { name, path, desc, commands } = data
    this.name = name
    this.path = path
    this.desc = desc
    this.cmds.splice(0)
    this.cmds.push(...commands)
  }
  updateExit(items) {
    Object.keys(this.exit).forEach(key => delete this.exit[key])
    Object.keys(this.dirs).forEach(key => delete this.dirs[key])

    Object.keys(items).forEach(dir => {
      const name = items[dir]
      this.exit[name] = `go ${dir}`
      this.dirs[dir] = name
    })
  }
  updateItems(items) {
    this.list.splice(0)
    items.forEach(item => item && this.list.push(new Role(item)))
    this.list.sort((a, b) => b.sort - a.sort)
  }
  updateItemadd(item) {
    this.list.push(new Role(item))
    this.list.sort((a, b) => b.sort - a.sort)
  }
  updateItemremove(id) {
    const index = this.list.findIndex(item => item.id === id)
    if (index !== -1) this.list.splice(index, 1)
  }
  updateSc(data) {
    const index = this.list.findIndex(item => item.id === data.id)
    if (index === -1) return
    const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
    if (hasOwn(data, 'hp')) this.list[index].hp = data.hp
    if (hasOwn(data, 'mp')) this.list[index].mp = data.mp
    if (hasOwn(data, 'max_hp')) this.list[index].max_hp = data.max_hp
    if (hasOwn(data, 'max_mp')) this.list[index].max_mp = data.max_mp
  }
}

export default Room
