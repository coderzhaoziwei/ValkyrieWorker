function toXiulian() {
  return new Promise(async resolve => {
    // 正在修炼
    if (this.statText === `修炼` || this.statText === `闭关`) {
      this.onText(`修炼任务正在进行。`, `hig`)
      return resolve()
    }
    // 检查状态
    if ((await this.toCheck()) === false) return resolve()
    // 前往练功
    this.send(`stopstate,jh fam 0 start,go west,go west,go north,go enter,go west,xiulian`)
    // 等待房间
    if ((await this.awaitRoomPath(`home/liangong`)) === false) return resolve()
    // 任务完成
    this.onText(`修炼任务已完成。`, `hig`)
    resolve()
  })
}

export default {
  methods: { toXiulian },
}
