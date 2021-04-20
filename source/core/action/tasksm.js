import ValkyrieInstance from "../ValkyrieInstance"

import { BUY_LIST } from "../GameData"

// 师门任务
ValkyrieInstance.prototype.tasksm = async function() {return new Promise(async resolve => {
  let repeat = true

  while (repeat) {
    const check = await this.tasksm_check()
    if (check === false) return resolve(repeat = false)

    const ask = await this.tasksm_ask()
    if (ask === false) return resolve(repeat = false)

    const search = await this.tasksm_search()
    if (search === false) return resolve(repeat = false)

    const submit = await this.tasksm_submit()
    if (submit === false) return resolve(repeat = false)
  }

})}
// 1. 检查
ValkyrieInstance.prototype.tasksm_check = async function() {return new Promise(async resolve => {
  // 是否已经完成
  const check = await new Promise(resolve => {
    const A = this.on(`tasks`, () => [this.off(A), resolve(this.smCount < 20)])
    this.sendCommands(256, `tasks`)
  })
  if (check === false) {
    this.onText(`<hig>师门任务已完成。</hig>`)
    return resolve(false)
  }

  // 状态
  const checkstate = await this.checkstate()
  if (checkstate === false) {
    return resolve(false)
  }

  // 背包
  if (this.packCount >= this.packLimit) {
    const clearup = await this.clearup()
    if (clearup === false) {
      return resolve(false)
    }
  }

  resolve(true)
})}
// 2. 请求
ValkyrieInstance.prototype.tasksm_ask = async function() {return new Promise(async resolve => {
  // 前往师傅房间
  if (this.room.path !== this.master.room) {
    await new Promise(resolve => {
      const A = this.on(`items`, () => (this.room.path === this.master.room) && [this.off(A), resolve()])
      this.sendCommands(256, `pack`, this.master.commands)
    })
  }
  // 向师傅请求任务
  const npc = this.npcList.find(npc => npc.name.includes(this.master.name))
  if (npc) {
    const A = this.on(`tasks`, () => [this.off(A), resolve(true)])
    this.sendCommands(256, `task sm ${npc.id},tasks`)
  } else {
    this.onText(`<hir>没有找到<hiy>${this.master.name}</hiy>师傅。</hir>`)
    resolve(false)
  }
})}
// 3. 寻找
ValkyrieInstance.prototype.tasksm_search = async function() {return new Promise(async resolve => {
  // 背包
  const pack = this.packList.find(item => item.name === this.smTarget)
  if (pack) {
    return resolve(true)
  }
  // 售卖
  const buy = BUY_LIST.find(buy => buy.selllist.includes(this.smTarget))
  if (buy) {
    // 等待监听到物品 购买
    await new Promise(resolve => {
      const A = this.on(`items`, () => {
        const npc = this.npcList.find(npc => npc.name.includes(buy.seller))
        if (npc) {
          this.off(A)
          const B = this.on(`list`, () => {
            const item = this.sellList.find(item => item.name === this.smTarget)
            if (item) {
              this.off(B)
              this.sendCommands(256, `buy 1 ${item.id} from ${this.seller}`)
              resolve()
            }
          })
          this.sendCommands(256, `list ${npc.id}`)
        }
      })
      this.sendCommands(256, buy.commands)
    })
    return resolve(true)
  }
  // 仓库
  if (this.options.canTaskSmStore) {
    await new Promise(resolve => {
      const A = this.on(`list`, () => [this.off(A), resolve()])
      this.sendCommands(256, `stopstate,jh fam 0 start,go north,go west,pack,store`)
    })
    const store = this.storeList.find(store => store.name === this.smTarget)
    if (store) {
      this.sendCommands(256, `qu 1 ${ store.id }`)
      return resolve(true)
    }
  }
  // 师门令牌
  if (this.options.canTaskSmCard && this.smTotal < 110) {
    const cardRegExp =
      this.smTotal < 30 ? /^<hi[gcyzo]>师门令牌/i :
      this.smTotal < 50 ? /^<hi[cyzo]>师门令牌/i :
      this.smTotal < 70 ? /^<hi[yzo]>师门令牌/i :
      this.smTotal < 90 ? /^<hi[zo]>师门令牌/i : /^<hio>师门令牌/i

    const card = this.packList.find(card => cardRegExp.test(card.name))
    if (card) {
      this.smTarget = card.name
      return resolve(true)
    }
  }

  this.onText(`<hir>找不到要求的师门任务物品。</hir>`)
  // 放弃
  if (this.options.canTaskSmGiveup) {
    this.smTarget = `放弃`
    return resolve(true)
  }

  return resolve(false)
})}
// 4. 提交
ValkyrieInstance.prototype.tasksm_submit = async function() {return new Promise(async resolve => {
  // 前往师傅房间
  if (this.room.path !== this.master.room) {
    await new Promise(resolve => {
      const A = this.on(`items`, () => (this.room.path === this.master.room) && [this.off(A), resolve()])
      this.sendCommands(256, `pack`, this.master.commands)
    })
  }
  const npc = this.npcList.find(npc => npc.name.includes(this.master.name))
  const pack = this.packList.find(item => item.name === this.smTarget)
  // 放弃任务
  if (npc && this.smTarget === `放弃`) {
    this.sendCommands(256, `task sm ${ npc.id } giveup`)
    return resolve(true)
  }
  // 向师傅提交任务
  if (npc && pack) {
    this.sendCommands(256, `task sm ${ npc.id } give ${ pack.id },pack`)
    return resolve(true)
  }

  resolve(false)
})}
