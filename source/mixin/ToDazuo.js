
function toDazuo() {
  return new Promise(async resolve => {
    // 检查状态
    if ((await this.toCheck()) === false) return resolve()
    // 前往打坐
    this.send(`stopstate,jh fam 0 start,go west,go west,go north,go enter,go west,dazuo`)

    // 等待房间
    if ((await this.awaitRoomPath(`home/liangong`)) === false) return resolve()
    // 任务完成
    this.onText(`打坐任务已完成。`, `hig`)
    resolve()
  })
}

export default {
  methods: { toDazuo },
}
