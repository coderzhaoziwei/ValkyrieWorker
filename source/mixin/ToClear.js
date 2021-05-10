function toClear() {
  return new Promise(async resolve => {
    // 等待检查
    const toCheck = await this.toCheck()
    if (toCheck === false) return resolve(false)

    // 前往仓库
    this.send(`stopstate,jh fam 0 start,go north,go west,pack,store`)
    // 等待获取仓库数据
    const awaitStoreList = await this.awaitStoreList()
    if (awaitStoreList === false) return resolve(false)

    // 同名物品存入仓库
    this.storeList.forEach(x => {
      const item = this.packList.find(y => x.name === y.name)
      if (item) this.sendCommands(`store ${item.count} ${item.id}`)
    })
    // 前往当铺清理背包
    this.sendCommands(`store,stopstate,jh fam 0 start,go south,go east,sell all,1000,pack`)
    // 等待获取背包数据
    const awaitPackList = await this.awaitPackList()
    if (awaitPackList === false) return resolve(false)

    // 检查背包物品数量
    if (this.packCount < this.packLimit) {
      this.onText(`<hig>物品清理已完成。</hig>[${this.packCount}/${this.packLimit}]`, `hic`)
      resolve(true)
    } else {
      this.onText(`<hig>物品清理已完成。</hig>[${this.packCount}/${this.packLimit}]`, `hir`)
      resolve(false)
    }
  })
}

export default {
  methods: { toClear },
}
