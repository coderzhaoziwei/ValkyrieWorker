
function toTaskYm() {
  return new Promise(async resolve => {
    // 检查选项
    if (this.options.canTaskYm === false) return resolve()
    // 已经完成
    if (this.ymCount >= 20) return [this.onText(`追捕任务已完成。`, `hig`), resolve()]
    // 检查状态
    const toCheck = await this.toCheck()
    if (toCheck === false) return resolve()
    // 扬州知府
    this.send(`stopstate,jh fam 0 start,go west,go north,go north`)
    const npcId = await this.awaitNpcName(`扬州知府`)
    if (npcId === false) return resolve()
    // 请求任务
    this.send(`tasks`)

    // 扫荡追捕
    if (this.options.canTaskYmSweep) {
      // 次数不足
      if (this.ymTotal - this.ymCount < 20) {
        if (this.options.canTaskYmGiveup) {
          this.send(`ask1 ${npcId},ask2 ${npcId}`) // 接受任务 然后放弃
        } else {
          this.onText(`<hir>追捕任务的扫荡次数不足。</hir>`)
          return resolve()
        }
      }
      this.send(`ask3 ${npcId}`)
      await this.await(10000)
      this.onText(`追捕任务已完成。`, `hig`)
      this.send(`tasks`)
      return resolve()
    }

    return resolve()
  })
}

export default {
  methods: { toTaskYm },
}
