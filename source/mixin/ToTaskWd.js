function toTaskWd() {
  return new Promise(async resolve => {
    // 检查开关
    if (this.options.canTaskWd === false) return resolve()
    // 任务数据
    this.send(`tasks`)
    if ((await this.awaitTaskData()) === false) return resolve()
    // 已经完成
    if (this.wdCount === this.wdTotal && this.wdComplete) return [this.onText(`武道任务已完成。`, `hig`), resolve()]
    // 检查状态
    if ((await this.toCheck()) === false) return resolve()

    // 前往武道塔门口 重置
    if (this.wdCount === this.wdTotal && this.wdComplete === false) {
      this.send(`stopstate,jh fam 9 start`)
      const npcId = await this.awaitNpcName(`守门人`)
      if (npcId === undefined) return resolve()
      this.send(`ask1 ${npcId}`) // 重置
    }
    // 前往武道塔塔内 武道塔守护者
    if (this.roomPath === `wudao/ta`) this.send(`stopstate,go up`)
    else if (this.roomPath === `wudao/men`) this.send(`stopstate,go enter`)
    else this.send(`stopstate,jh fam 9 start,go enter`)

    const npcId = await this.awaitNpcName(`武道塔守护者`)
    if (npcId === undefined) return resolve()

    // 进入战斗
    this.send(`kill ${npcId}`)
    // 战斗结束
    const awaitCombatEnd = await this.awaitCombatEnd()
    if (awaitCombatEnd === false) {
      return resolve()
    }
    // 进入循环
    await this.toTaskWd()
    return resolve()
  })
}

export default {
  methods: { toTaskWd },
}
