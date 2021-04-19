import { PACK_LIST } from "./GameData"

export class Base {
  constructor(data) {
    this.id = data.id
    this.name = data.name
  }
  get nameText() {
    // 删除标签后的格式化文本
    return this.name.replace(/<\S+?>/g, ``)
  }
  get colorValue() {
    // 颜色 [1-7]
    const index = [        // 0: 无法判断
      /^<(hiw|wht)>/i,     // 1: 白
      /^<hig>/i,           // 2: 绿
      /^<hic>/i,           // 3: 蓝
      /^<hiy>/i,           // 4: 黄
      /^<hiz>/i,           // 5: 紫
      /^<hio>/i,           // 6: 橙
      /^<(hir|ord|red)>/i, // 7: 红
      /^<\S\S\S>/,         // 8: 未知
    ].findIndex(regexp => regexp.test(this.name)) + 1

    // 打印未知标签
    if (index === 8) console.warn(this.name)

    return index
  }
}

export class Role extends Base {
  constructor(data) {
    super(data)
    this.hp = data.hp || 0
    this.mp = data.mp || 0
    this.max_hp = data.max_hp || 0
    this.max_mp = data.max_mp || 0
    this.status = data.status || []
    this.p = data.p || 0 // 1: 玩家对象
  }
  get isSelf() {
    // 是否玩家自己
    return this.id === unsafeWindow.id
  }
  get isPlayer() {
    // 是否玩家
    return this.p === 1
  }
  get isOffline() {
    // 是否掉线的玩家
    return this.name.includes(`<red>&lt;断线中&gt;</red>`)
  }
  get isNpc() {
    // 是否NPC
    return !this.isPlayer
  }
  get sortValue() {
    // 排序权重
    if (this.isSelf) return 0
    if (this.isNpc) return this.colorValue
    return this.colorValue + this.isOffline ? 2000 : 1000
  }
}

export class Pack extends Base {
  constructor(data) {
    super(data)
    this.count = data.count
    this.unit = data.unit
    this.value = data.value || 0
    this.can_eq = data.can_eq || 0 // 可装备: 0/1
    this.can_use = data.can_use || 0 // 可使用: 0/1
    this.can_study = data.can_study || 0 // 可学习: 0/1
    this.can_combine = data.can_combine || 0 // 可合成: 0/1
  }
  get isEquip() {
    return this.can_eq === 1
  }
  get sortValue() {
    const index = PACK_LIST.findIndex(name => this.name.includes(name))
    return this.colorValue + (index === -1 ? 10000 : (index * 10))
  }
  get valueText() {
    // 物品价值文本
    return this.value
  }
}

export class Skill extends Base {
  constructor(data) {
    super(data)
    this.level = Number(data.level) || 0
    this.can_enables = data.can_enables || undefined
    this.enable_skill = data.enable_skill || ``
    this.exp = 0
    this._exp = data.exp
  }
  set _exp(value) {
    value = Number(value) || 0
    // 计算后的熟练度数值为 [10, 95] 区间中 5 的倍数
    this.exp = (value <= 10) ? 10 : parseInt(value / 5) * 5
  }
  get _exp() {
    return this.exp
  }
  get k() {
    // 技能系数 = 技能颜色 * 2.5
    return this.colorValue * 2.5
  }
  get sortValue() {
    // 基础技能
    if (this.colorValue === 1) {
      return [
        `force`, // 1: 内功
        `unarmed`, // 2: 拳脚
        `dodge`, // 3: 轻功
        `parry`, // 4: 招架
        `blade`, // 5: 刀
        `sword`, // 6: 剑
        `club`, // 7: 棍
        `staff`, // 8: 杖
        `whip`, // 9: 鞭
        `throwing`, // 10: 暗器
        `bite`, // 11: 野兽扑咬
        `literate`, // 12: 读书识字
        `lianyao`, // 13: 炼药术
      ].findIndex(item => item === this.id) + 1
    }
    // 特殊技能 = 等级权重 + 颜色权重
    const levelSort = 100000 - this.level
    const colorSort = (10 - this.colorValue) / 2
    return levelSort + colorSort
  }
}

export class Chat {
  constructor(data) {
    this.id = data.uid || ``
    // 聊天频道
    this.channel = data.ch
    // 聊天内容
    this.content = data.content.trim().replace(/\n/g, `<br>`)
    this.name = data.name || ``
    // 本地生成的时间
    this.time = new Date()

    // 世界频道专有：等级
    this.level = data.lv || 0
    // 门派频道专有：门派
    this.family = data.fam || ``
    // 全区频道专有：服务器
    this.server = data.server || ``
  }
  get isSelf() {
    return this.id === unsafeWindow.id
  }
  get isTm() {
    return this.channel === `tm`
  }
  get isEs() {
    return this.channel === `es`
  }
  get isFa() {
    return this.channel === `fam`
  }
  get isSy() {
    return this.channel === `sys`
  }
  get isPt() {
    return this.channel === `pty`
  }
  get isCh() {
    return this.channel === `chat`
  }
  get isRu() {
    return this.channel === `rumor`
  }
  get commandText() {
    return `look3 ${this.id}`
  }
  get tag() {
    if (this.isTm) return `hig`
    if (this.isEs) return `hio`
    if (this.isFa) return `hiy`
    if (this.isSy) return `hir`
    if (this.isPt) return `hiz`
    if (this.isRu) return `him`
    if (this.isCh) return [0, 0, 0, `hiy`, `hiz`, `hio`, `hir`][this.level] || `hic`
    return `hiy`
  }
  get titleText() {
    if (this.isTm) return `队伍`
    if (this.isPt) return `帮派`
    if (this.isRu) return `谣言`
    if (this.isSy) return `系统`
    if (this.isFa) return `${this.family}`
    if (this.isEs) return `${this.server}`
    if (this.isCh) return [`百姓`, `武士`, `武师`, `宗师`, `武圣`, `武帝`, `武神`][this.level] || `闲聊`
    return `脚本`
  }
  get titleHtml() {
    return `<${this.tag}>【${this.titleText}】</${this.tag}>`
  }
  get timeText() {
    return new Date(this.time).toLocaleTimeString(`en-DE`)
  }
}

export class EventEmitter {
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
