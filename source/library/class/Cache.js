import Util from "./Util"
import Chat from "./Chat"
import Pack from "./Pack"
import Role from "./Role"
import Skill from "./Skill"
import STATE_LIST from "../data/STATE_LIST"

/** 缓存类
 * @param {object}        role       - 当前角色信息
 * @param {object}        roles      - 全部角色信息
 * @param {object}        room       - 房间基本信息
 * @param {Array}         exitList   - 房间出口列表
 * @param {object}        map        - 房间区域地图
 * @param {Array}         roleList   - 房间角色列表
 * @param {object}        score      - 当前角色属性
 * @param {object}        state      - 当前角色状态
 * @param {Array.<Skill>} skillList  - 角色技能列表
 * @param {number}        skillLimit - 角色技能上限
 * @param {Array.<Pack>}  packList   - 角色物品列表
 * @param {Array.<Base>}  equipList  - 角色装备列表
 * @param {number}        packLimit  - 背包物品上限
 * @param {number}        money      - 金钱具体数值
 * @param {Array.<Pack>}  storeList  - 仓库物品列表
 * @param {number}        packLimit  - 仓库容量上限
 * @param {string}        seller     - 商店卖家标识
 * @param {Array}         sellList   - 商店售卖列表
 * @param {Array}         chatList   - 聊天内容列表
 */
export default class Cache {
  constructor() {
    this.role = {}
    this.roles = {}
    this.score = {}
    this.state = { value: 0, text: ``, detail: `` }
    this.room = { name: ``, path: ``, desc: ``, cmds: [], x: ``, y: `` }
    this.exitList = []
    this.map = { svg: ``, width: 0, height: 0 }
    this.roleList = []
    this.skillList = []
    this.skillLimit = 0
    this.packList = []
    this.equipList = []
    this.packLimit = 0
    this.money = 0
    this.storeList = []
    this.storeLimit = 0
    this.seller = ``
    this.sellList = []
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

  updateRoleItems(items) {
    items.forEach(item => {
      const { id, name, title } = item
      this.roles[id] = { name, title }
    })
  }
  updateLoginId(id) {
    const name = this.roles[id].name
    const title = this.roles[id].title
    const cookies = {
      u: Util.getCookie(`u`),
      p: Util.getCookie(`p`),
      s: Util.getCookie(`s`),
    }
    const token = `${ cookies.u } ${ cookies.p }`
    const server = [`一区`, `二区`, `三区`, `四区`, `测试`][cookies.s]

    // 首次登录记录信息
    if (typeof unsafeWindow.id !== `string`) {
      const account = { id, name, server, cookies, token }
      Util.updateAccount(account)
    }

    // 添加全局标识
    unsafeWindow.id = id

    // 更新当前角色信息
    this.role = Util.getValue(`role`)
    this.role.id = id
    this.role.name = name
    this.role.title = title
    this.role.server = server
    Util.setValue(`role`, this.role)
  }
  updateRoomData(data) {
    const { name, path, desc, commands } = data
    this.room.name = name
    this.room.path = path
    this.room.desc = desc

    this.room.cmds.splice(0)
    this.room.cmds.push(...commands)

    const nameList = name.split(/-|\(|\)/)
    this.room.x = nameList[0]
    this.room.y = nameList[1]
  }
  updateExitItems(items) {
    this.exitList.splice(0)

    Object.keys(items).forEach(dir => {
      const name = items[dir]
      const cmd = `go ${dir}`
      this.exitList.push({ dir, name, cmd })
    })
  }
  updateMapItems(items) {
    const position = { minX: 99999, minY: 99999, maxX: 0, maxY: 0 }
    items.forEach(item => {
      const [x, y] = item.p
      if (x < position.minX) position.minX = x
      if (x > position.maxX) position.maxX = x
      if (y < position.minY) position.minY = y
      if (y > position.maxY) position.maxY = y
    })
    const [offsetX, offsetY] = [0 - position.minX, 0 - position.minY]
    const [unitX, unitY, unitW, unitH] = [100, 50, 60, 20]
    const rects = []
    const lines = []
    const texts = []

    items.forEach(map => {
      const l = (map.p[0] + offsetX) * unitX + 20
      const t = (map.p[1] + offsetY) * unitY + 20
      const rect = `<rect x="${l}" y="${t}" fill="dimgrey" stroke-width="1" stroke="gray" width="${unitW}" height="${unitH}"></rect>`
      rects.push(rect)
      map.exits && map.exits.forEach(exit => {
        const regexp = /^([a-z]{1,2})(\d)?([d|l])?$/
        if (regexp.test(exit)) {
          const length = RegExp.$2 ? parseInt(RegExp.$2) : 1
          const points = {
            w: [
              [l - (unitX - unitW) - unitX * (length - 1), t + unitH / 2],
              [l, t + unitH / 2],
            ],
            e: [
              [l + unitW, t + unitH / 2],
              [l + unitX + unitX * (length - 1), t + unitH / 2],
            ],
            s: [
              [l + unitW / 2, t + unitH],
              [l + unitW / 2, t + unitY + unitY * (length - 1)],
            ],
            n: [
              [l + unitW / 2, t],
              [l + unitW / 2, t - (unitY - unitH) - unitY * (length - 1)],
            ],
            nw: [
              [l - length * unitX + unitW, t - length * unitY + unitH],
              [l, t],
            ],
            ne: [
              [l + unitW, t],
              [l + length * unitX, t - (unitY - unitH)],
            ],
            se: [
              [l + unitW, t + unitH],
              [l + length * unitX, t + length * unitY],
            ],
            sw: [
              [l, t + unitH],
              [l - (unitX - unitW) - unitX * (length - 1), t + length * unitY],
            ],
          }[RegExp.$1]
          const [a, b] = points
          if (a) {
            const line = `<line stroke="gray" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"`
            + `${RegExp.$3 ? ` stroke-dasharray="5,5"` : ``} stroke-width="${RegExp.$3 === `l` ? 10 : 1}"></line >`
            lines.push(line)
          }
        }
      })
      const text = `<text x="${l+30}" y="${t+14}" text-anchor="middle" style="font-size:12px;" fill="#232323">${map.n}</text>`
      texts.push(text)
    })

    const width = (position.maxX + offsetX + 1) * unitX
    const height = (position.maxY + offsetY + 1) * unitY

    this.map.svg = `<svg viewBox="0,0,${width},${height}" preserveAspectRatio="xMidYMid meet">`
      + `${rects.join(``)}${lines.join(``)}${texts.join(``)}</svg>`
    this.map.width = width
    this.map.height = height
  }

  updateScoreData(data) {
    Object.keys(data).forEach(key => {
      const ignoreList = [`type`, `dialog`, `id`] // 忽略
      if (ignoreList.includes(key)) return

      this.score[key] = data[key]
    })
  }

  updateItems(items) {
    this.roleList.splice(0)
    items.forEach(item => item && this.roleList.push(new Role(item)))
    this.roleList.sort((a, b) => b.sort - a.sort)
  }
  updateAddItemData(data) {
    this.roleList.push(new Role(data))
    this.roleList.sort((a, b) => b.sort - a.sort)
  }
  updateRemoveItemId(id) {
    const index = this.roleList.findIndex(item => item.id === id)
    if (index !== -1) this.roleList.splice(index, 1)
  }
  updateScData(data) {
    const index = this.roleList.findIndex(item => item.id === data.id)
    if (index === -1) return

    if (Util.hasOwn(data, `hp`)) this.roleList[index].hp = data.hp
    if (Util.hasOwn(data, `mp`)) this.roleList[index].mp = data.mp
    if (Util.hasOwn(data, `max_hp`)) this.roleList[index].max_hp = data.max_hp
    if (Util.hasOwn(data, `max_mp`)) this.roleList[index].max_mp = data.max_mp
  }

  updateStateData(data) {
    const index = STATE_LIST.findIndex(state => data.state && data.state.includes(state))
    this.state.value = index + 1
    this.state.text = STATE_LIST[index] || data.state || ``
    this.state.detail = ``

    // 重置状态文本
    data.state = this.state.text
    // 删除状态描述
    delete data.desc
  }

  updateSkillData(data) {
    if (Util.hasOwn(data, `items`)) {
      this.skillList.splice(0)
      data.items.forEach(item => this.skillList.push(new Skill(item)))
      this.skillList.sort((a, b) => a.sort - b.sort)
      // 修改技能列表数据
      data.items = this.skillList
    }
    if (Util.hasOwn(data, `limit`)) {
      this.skillLimit = parseInt(data.limit) || 0
    }
    if (Util.hasOwn(data, `item`)) {
      this.skillList.push(new Skill(data.item))
    }
    if (Util.hasOwn(data, `id`)) {
      const index = this.skillList.findIndex(skill => skill.id === data.id)
      if (index !== -1) {
        const skill = this.skillList[index]
        const onText = unsafeWindow.ValkyrieWorker.onText
        if (Util.hasOwn(data, `level`)) {
          skill.level = Number(data.level) || 1
          onText(`你的技能${ skill.name }提升到了<hiw>${ skill.level }</hiw>级！`)
        }
        if (Util.hasOwn(data, `exp`)) {
          skill.updateExp(data.exp)
          switch (this.state.text) {
            case `练习`:
              onText(`你练习${ skill.name }消耗了${ this.lxCost }点潜能。${ data.exp }%`)
              this.state.detail = skill.nameText
              this.score.pot -= this.lxCost
              break
            case `学习`:
              onText(`你学习${ skill.name }消耗了${ this.xxCost }点潜能。${ data.exp }%`)
              this.state.detail = skill.nameText
              this.score.pot -= this.xxCost
              break
            case `炼药`:
              onText(`你获得了炼药经验，${ skill.name }当前<hiw>${ skill.level }</hiw>级。${ data.exp }%`)
              break
          }
        }
/* 潜能消耗＝等级平方差×技能颜色系数 */
// const qnCost = (Math.pow(this.skillLimit, 2) - Math.pow(skill.level, 2)) * skill.k
/* 秒数消耗＝潜能/每一跳的潜能/(每分钟秒数/每分钟五次) */
// const time = qnCost / this.lxCost / ( 60 / 5)
// const timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time/60)}小时${parseInt(time%60)}分钟`
// 还需要${ timeString }消耗${ qn }点潜能到${ this.skillLimit }级。
      }
    }
    if (Util.hasOwn(data, `pot`)) {
      this.score.pot = Number(data.pot) || 0
    }
  }

  updatePackData(data) {
    if (Util.hasOwn(data, `money`)) {
      this.money = Number(data.money) || 0
    }
    if (Util.hasOwn(data, `max_item_count`)) {
      this.packLimit = Number(data.max_item_count) || 0
    }
    if (Util.hasOwn(data, `eqs`)) {
      data.eqs.forEach((eq, index) => (this.equipList[index] = eq))
    }
    if (Util.hasOwn(data, `items`)) {
      this.packList.splice(0)
      data.items.forEach(item => this.packList.push(new Pack(item)))
      this.packList.sort((a, b) => a.sort - b.sort)
      // 修改物品列表数据
      data.items = this.packList
    }
  }
  updateStoreData(data) {
    if (Util.hasOwn(data, `max_store_count`)) {
      this.storeLimit = Number(data.max_store_count) || 0
    }
    if (Util.hasOwn(data, `stores`)) {
      this.storeList.splice(0)
      data.stores.forEach(item => this.storeList.push(new Pack(item)))
      this.storeList.sort((a, b) => a.sort - b.sort)
      // 修改仓库列表数据
      data.stores = this.storeList
    }
  }
  updateSellData(data) {
    if (Util.hasOwn(data, `seller`) && Util.hasOwn(data, `selllist`)) {
      this.seller = data.seller
      this.sellList.splice(0)
      data.selllist.forEach(item => this.sellList.push(new Pack(item)))
    }
  }

  updateMsgData(data) {
    this.chatList.push(new Chat(data))

    if (this.chatList.length > 1100) {
      this.chatList.splice(0, 100)
    }
  }
  updateTaskItems(items) {
    this.smTarget = ``
    this.ymTarget = ``
    this.ymTargetX = ``
    this.ymTargetY = ``
    items.forEach(task => {
      const { id, state, title, desc } = task
      switch (id) {
        case `signin`:
          // 副本：<hik>0/20</hik>
          // 副本：<hig>20/20</hig>
          desc.match(/副本：<[\S]{3}>(\d+)\/20<[\S]{4}>/)
          this.fbCount = Number(RegExp.$1) || 0
          // <hig>武道塔可以重置，进度20/29</hig>，
          // <nor>武道塔已重置，进度99/99</nor>，
          desc.match(/武道塔([\S]{1,2})重置，进度(\d+)\/(\d+)/)
          this.wdValue = (RegExp.$1 === `已`)
          this.wdCount = Number(RegExp.$2) || 0
          this.wdTotal = Number(RegExp.$3) || 0
          // <hig>还没有给首席请安</hig>
          // 本周尚未协助襄阳守城，尚未挑战门派BOSS，还可以挑战武神BOSS5次。
          this.qaValue = (/还没有给首席请安/.test(desc) === false)
          this.xyValue = (/本周尚未协助襄阳守城/.test(desc) === false)
          this.mpValue = (/尚未挑战门派BOSS/.test(desc) === false)
          break
        case `sm`:
          // 你的师门委托目前完成0/20个，共连续完成16个。
          desc.match(/目前完成(\d+)\/20个，共连续完成(\d+)个/)
          this.smCount = Number(RegExp.$1) || 0
          this.smTotal = Number(RegExp.$2) || 0
          // 你的师门委托你去寻找<wht>当归</wht>，你可以慢慢寻找，没有时间限制，目前完成0/20个，共连续完成16个。
          if (/你的师门委托你去寻找(\S+)，你可以慢慢寻找/.test(desc)) {
            this.smTarget = RegExp.$1
          }
          break
        case `yamen`:
          // 扬州知府委托你追杀逃犯：目前完成0/20个，共连续完成34个。
          desc.match(/目前完成(\d+)\/20个，共连续完成(\d+)个/)
          this.ymCount = Number(RegExp.$1) || 0
          this.ymTotal = Number(RegExp.$2) || 0
          // 扬州知府委托你追杀逃犯：司空荔蓓，据说最近在峨眉派-走廊出现过，你还有9分57秒去寻找他，目前完成0/20个，共连续完成34个。
          if (/扬州知府委托你追杀逃犯：(\S+)，据说最近在(\S+)-(\S+)出现过/.test(desc)) {
            this.ymTarget = RegExp.$1
            this.ymTargetX = RegExp.$2
            this.ymTargetY = RegExp.$3
          }
          break
        case `yunbiao`:
          // 你目前没有接受到委托，本周完成0/20个，共连续完成0个。
          desc.match(/本周完成(\d+)\/20个，共连续完成(\d+)个/)
          this.ybCount = Number(RegExp.$1) || 0
          this.ybTotal = Number(RegExp.$2) || 0
          break
        default:
          // this.activity = { id, state, title, desc }
          // if (state === 2) // 可领取
          break
      }
    })
  }

  /** 先天悟性
   * @return {number}
   */
  get wx1() {
    return Number(this.score.int) || 0
  }
  /** 后天悟性
   * @return {number}
   */
  get wx2() {
    return Number(this.score.int_add) || 0
  }
  /** 学习效率
   * @return {number}
   */
  get xxxl() {
    return parseInt(this.score.study_per ) || 0
  }
  /** 练习效率
   * @return {number}
   */
  get lxxl() {
    return parseInt(this.score.lianxi_per) || 0
  }
  /** 练习消耗
   * @return {number}
   * @explain 练习每一跳消耗＝(先天悟性＋后天悟性)×(1＋练习效率%－先天悟性%)
   */
  get lxCost() {
    return parseInt((this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100))
  }
  /** 学习消耗
   * @return {number}
   * @explain 学习每一跳消耗＝(先天悟性＋后天悟性)×(1＋学习效率%－先天悟性%)×3
   */
  get xxCost() {
    return parseInt((this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3)
  }
  /** 当前 NPC 列表
   * @return {Array.<Role>}
   */
  get npcList() {
    return this.roleList.filter(role => role.isNpc)
  }

  /** 气血百分比
   * @return {number} [0, 100]
   */
  get hpPercentage() {
    return parseInt((this.score.hp / this.score.max_hp) * 100) || 0
  }
  /** 内力百分比
   * @return {number} [0, 100]
   */
  get mpPercentage() {
    return parseInt((this.score.mp / this.score.max_mp) * 100) || 0
  }

  get genderValue() {
    return ['女', '男'].findIndex(item => item === this.score.gender)
  }

  /* 几个全局的 Worker 方法 以下提供 this 调用 */
  get sendCommand() {
    return command => unsafeWindow.ValkyrieWorker.sendCommand(command)
  }
  get sendCommands() {
    return (...args) => unsafeWindow.ValkyrieWorker.sendCommands(...args)
  }
  get onData() {
    return data => unsafeWindow.ValkyrieWorker.onData(data)
  }
  get onText() {
    return text => unsafeWindow.ValkyrieWorker.onText(text)
  }
  get on() {
    return (type, handler) => unsafeWindow.ValkyrieWorker.on(type, handler.bind(this))
  }
  get off() {
    return id => unsafeWindow.ValkyrieWorker.off(id)
  }

}
