function toTaskFb() {
  return new Promise(async resolve => {
    // 检查开关
    if (this.options.canTaskFb === false) {
      return resolve()
    }
    // 检查次数
    if (this.fbCount >= 20) {
      this.onText(`副本任务已完成。`, `hig`)
      return resolve()
    }
    // 检查状态
    const toCheck = await this.toCheck()
    if (toCheck === false) {
      return resolve()
    }
    // 扫古宗门
    if (this.options.canTaskGzm === true) {
      if (this.wdCount !== 99) {
        this.onText(`副本任务古宗门无法扫荡，武道塔低于九十九层。`, `hir`)
        return resolve()
      }
      // 检查背包
      this.send(`pack`)
      if ((await this.awaitPackList()) === false) return resolve()
      // 前往清理背包
      if (this.packCount >= this.packLimit) {
        if ((await this.toClear()) === false) return resolve()
      }
      // 前往塔顶
      this.send(`stopstate,jh fam 9 start,go enter,go up`)
      // 疯癫的老头
      const npcId = await this.awaitNpcName(`疯癫的老头`)
      if (npcId === undefined) return resolve()
      // 前往古大陆
      this.send(`ggdl ${npcId},go north,go north,go north,go north,go north,go north,tiao1 shi,tiao1 shi,tiao2 shi,jumpdown`)
      const awaitRoomPath = await this.awaitRoomPath(`zc/shanjiao`)
      if (awaitRoomPath === false) return resolve()
      // 扫荡古宗门五次
      this.send(`cr gmp/shanmen 0 5`)
      await this.await(2500)
    }

    // 检查背包
    this.send(`tasks,pack`)
    if ((await this.awaitPackList()) === false) return resolve()
    // 前往清理背包
    if (this.packCount >= this.packLimit) {
      if ((await this.toClear()) === false) return resolve()
    }
    // 检查次数
    if (this.fbCount >= 20) {
      this.onText(`副本任务已完成。`, `hig`)
      return resolve()
    }
    // 扫荡副本
    if (this.options.canTaskFb) {
      const id = this.options.canTaskFbId
      const type = this.options.canTaskFbType
      const count = 20 - this.fbCount
      this.send(`stopstate,cr ${id} ${type} ${count}`)
      await this.await(count / 2 * 1000)
    }
    // 检查背包
    this.send(`tasks,pack`)
    if ((await this.awaitPackList()) === false) return resolve()
    this.onText(`副本任务已完成。`, `hig`)
    resolve()
  })
}

export default {
  methods: { toTaskFb },
}
