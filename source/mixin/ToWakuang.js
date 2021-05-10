function toWakuang() {
  return new Promise(async resolve => {
    // 正在挖矿
    if (this.stateText === `挖矿`) return [this.onText(`挖矿任务正在进行。`, `hig`), resolve()]
    // 检查状态
    if ((await this.toCheck()) === false) return resolve()

    // 前往仓库
    this.send(`stopstate,jh fam 0 start,go north,go west,pack,store`)
    // 仓库数据
    if ((await this.awaitStoreList()) === false) return resolve()

    // 检查武器
    const eqName = (this.equipList[0] || {}).name || ``
    if (/铁镐/.test(eqName)) return [this.onText(`挖矿任务装备${eqName}。`, `hig`), this.send(`stopstate,wakuang`), resolve()]
    // 检查背包
    const packItem = this.packList.find(x => /铁镐/.test(x.name))
    if (packItem) return [this.onText(`挖矿任务装备${packItem.name}。`, `hig`), this.send(`stopstate,wakuang`), resolve()]
    // 检查仓库
    const storeItem = this.storeList.find(x => /铁镐/.test(x.name))
    if (storeItem) return [this.onText(`挖矿任务装备${storeItem.name}。`, `hig`), this.send(`stopstate,qu 1 ${storeItem.id},wakuang`), resolve()]

    // 清理背包
    if ((await this.toClear()) === false) return resolve()
    // 寻找铁匠
    this.send(`stopstate,jh fam 0 start,go east,go east,go south`)
    const npcId = await this.awaitNpcName(`铁匠铺老板`)
    if (npcId === undefined) return resolve()
    // 浏览商品
    this.send(`stopstate,list ${npcId}`)
    if ((await this.awaitSellList()) === false) return resolve()

    // 购买铁镐
    const sellItem = this.sellList.find(x => /铁镐/.test(x.name))
    if (sellItem) {
      this.onText(`挖矿任务购买${sellItem.name}。`, `hig`)
      this.send(`stopstate,buy 1 ${sellItem.id} from ${this.seller},wakuang`)
      return resolve()
    }

    // 挖矿失败
    this.onText(`挖矿任务失败。`, `hir`)
    this.send(`stopstate,wakuang`)
    resolve()
  })
}

export default {
  methods: { toWakuang },
}
