import ValkyrieInstance from "../ValkyrieInstance"

ValkyrieInstance.prototype.clearup = function() {return new Promise(async resolve => {
  const checkstate = await this.checkstate()
  if (checkstate === false) return resolve(false)

  this.sendCommands(`stopstate,jh fam 0 start,go north,go west,pack,store`)
  const A = this.on(`list`, () => {
    if (this.room.path !== `yz/qianzhuang`) return
    this.off(A)

    this.storeList.forEach(store => {
      const item = this.packList.find(pack => pack.name === store.name)
      if (item) this.sendCommands(`store ${item.count} ${item.id}`)
    })
    this.sendCommands(`stopstate,jh fam 0 start,go south,go east,sell all,1000,pack`)

    const B = this.on(`pack`, data => {
      if (!this.hasOwn(data, `items`)) return
      this.off(B)

      if (this.packCount < this.packLimit) {
        this.onText(`<hig>整理背包完毕。</hig><hic>[${this.packCount}/${this.packLimit}]</hic>`)
        resolve(true)
      } else {
        // 背包容量不足
        this.onText(`<hig>整理背包完毕。</hig><hir>[${this.packCount}/${this.packLimit}]</hir>`)
        resolve(false)
      }
    })

  })
})}
