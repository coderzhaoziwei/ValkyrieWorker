import { getColorSortByName } from './Common'

class Role {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.hp = data.hp || 0
    this.mp = data.mp || 0
    this.max_hp = data.max_hp || 0
    this.max_mp = data.max_mp || 0
    this.status = data.status || []
    this.p = data.p || 0
  }
  get isSelf() {
    return this.id === GM_getValue('ValkyrieId')
  }
  get isPlayer() {
    return this.p === 1
  }
  get isOffline() {
    return this.name.includes('<red>&lt;断线中&gt;</red>')
  }
  get isNpc() {
    return !this.isPlayer
  }
  get color() {
    return getColorSortByName(this.name)
  }
  get sort() {
    if (this.isSelf) return 0
    if (this.isNpc) return this.color
    return this.color + this.isOffline ? 2000 : 1000
  }
}

export default Role
