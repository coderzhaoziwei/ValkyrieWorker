function toTask() {
  return new Promise(async resolve => {
    // 扫荡副本
    await this.toTaskFb()
    // 请安
    await this.toTaskQa()
    // 师门
    await this.toTaskSm()
    // 衙门追捕
    await this.toTaskYm()
    // 武道塔
    await this.toTaskWd()

    // 挖矿结束
    if (this.options.canTaskEndWk) {
      await this.toWakuang()
      return resolve()
    }
    // 闭关结束
    if (this.options.canTaskEndBg) {
      await this.toXiulian()
      return resolve()
    }
    // 打坐结束
    if (this.options.canTaskEndDz) {
      await this.toDazuo()
      return resolve()
    }

    resolve()
  })
}

export default {
  methods: { toTask },
}
