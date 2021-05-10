import FAMLIY_DATA from "../data/FAMLIY_DATA.json"
import SELL_DATA from "../data/SELL_DATA.json"

const SM_GIVE_UP = `<hiw>师门任务放弃</hiw>`

function toTaskSm() {
  return new Promise(async resolve => {
    // 检查选项
    if (this.options.canTaskSm === false) return resolve()
    // 已经完成
    if (this.smCount >= 20) return [this.onText(`师门任务已完成。`, `hig`), resolve()]
    // 检查状态
    const toCheck = await this.toCheck()
    if (toCheck === false) return resolve()
    // 检查背包
    this.send(`pack`)
    const awaitPackList = await this.awaitPackList()
    if (awaitPackList === false) return resolve()
    if (this.packCount >= this.packLimit) {
      // 前往清理背包
      const toClear = await this.toClear()
      if (toClear === false) return resolve()
      if (this.packCount + 1 >= this.packLimit) return resolve()
    }
    // 获取师傅数据
    const familyData = FAMLIY_DATA[this.familyText]
    if (this.hasOwn(familyData, `master`) === false) return [this.onText(`师门任务获取师傅数据失败。`, `hir`), resolve()]
    const master = familyData.master

    // 查找门派师傅
    this.send(master.commands)
    const masterId = await this.awaitNpcName(master.name)
    if (masterId === false) return [this.onText(`师门任务找不到师傅${this.familyText}${master.name}。`, `hir`), resolve()]

    // 放弃师门任务
    if (this.options.canTaskSmGiveup && this.smTarget === SM_GIVE_UP) {
      this.onText(`师门任务放弃。`, `hir`)
      this.send(`task sm ${masterId} giveup`)
      this.smTarget = ``
    }
    // 请求师门任务
    if (this.smTarget === ``) {
      this.send(`task sm ${masterId},tasks`)
      // 获取任务数据
      const awaitTaskData = await this.awaitTaskData()
      if (awaitTaskData === false) return resolve()
    }

    // 查找背包
    const pack = this.packList.find(x => x.name === this.smTarget)
    // 提交任务物品 结束
    if (pack) {
      // this.onText(`师门任务提交${this.smTarget}给${master.name}。`, `hig`)
      this.send(`task sm ${masterId} give ${ pack.id },pack,task sm ${masterId},tasks`)
      // 获取任务数据
      const awaitTaskData = await this.awaitTaskData()
      if (awaitTaskData === false) return resolve()
      await this.toTaskSm()
      return resolve()
    }
    // 查找商店
    const sell = SELL_DATA.find(x => (x.selllist instanceof Array) && x.selllist.includes(this.smTarget))
    if (sell) {
      this.send(sell.commands)
      const npcId = await this.awaitNpcName(sell.seller)
      if (npcId) {
        this.send(`list ${npcId}`)
        const awaitSellList = await this.awaitSellList()
        if (awaitSellList) {
          const item = this.sellList.find(x => x.name === this.smTarget)
          // 购买任务物品 结束
          if (item) {
            // this.onText(`师门任务商店获取${this.smTarget}。`, `hig`)
            this.send(`buy 1 ${item.id} from ${this.seller}`)
            await this.toTaskSm()
            return resolve()
          }
        }
      }
    }
    // 查找仓库
    if (this.options.canTaskSmStore) {
      this.send(`stopstate,jh fam 0 start,go north,go west,pack,store`)
      const awaitStoreList = await this.awaitStoreList()
      if (awaitStoreList) {
        const store = this.storeList.find(x => x.name === this.smTarget)
        // 取出任务物品 结束
        if (store) {
          // this.onText(`师门任务仓库获取${this.smTarget}。`, `hig`)
          this.send(`qu 1 ${ store.id }`)
          await this.toTaskSm()
          return resolve()
        }
      }
    }
    // 师门令牌
    if (this.options.canTaskSmCard && this.smTotal < 110) {
      const cardRegExp = this.smTotal < 30 ? /^<hi[gcyzo]>师门令牌/i
        : this.smTotal < 50 ? /^<hi[cyzo]>师门令牌/i
        : this.smTotal < 70 ? /^<hi[yzo]>师门令牌/i
        : this.smTotal < 90 ? /^<hi[zo]>师门令牌/i
        : /^<hio>师门令牌/i
      const card = this.packList.find(x => cardRegExp.test(x.name))
      // 目标师门令牌 结束
      if (card) {
        this.smTarget = card.name
        // this.onText(`师门任务准备提交${this.smTarget}。`, `hig`)
        await this.toTaskSm()
        return resolve()
      }
    }
    // 放弃师门任务 结束
    if (this.options.canTaskSmGiveup) {
      this.smTarget = SM_GIVE_UP
      await this.toTaskSm()
      return resolve()
    }
    return resolve()
  })
}

export default {
  methods: { toTaskSm },
}
