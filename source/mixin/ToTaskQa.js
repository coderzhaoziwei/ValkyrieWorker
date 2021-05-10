import FAMLIY_DATA from "../data/FAMLIY_DATA.json"

function toTaskQa() {
  return new Promise(async resolve => {
    // 检查选项
    if (this.options.canTaskQa === false) return resolve()
    // 无门无派
    if (this.familyText === `无门无派`) return [this.onText(`请安任务无门无派不可完成。`, `hir`), resolve()]
    // 已经完成
    if (this.qaComplete) return [this.onText(`请安任务已完成。`, `hig`), resolve()]

    // 获取首席数据
    const familyData = FAMLIY_DATA[this.familyText]
    if (this.hasOwn(familyData, `chief`) === false) return [this.onText(`请安任务获取首席数据失败。`, `hir`), resolve()]

    const chief = familyData.chief
    // 前往指定房间
    this.send(chief.commands)
    // 等待指定房间
    const awaitRoomPath = await this.awaitRoomPath(chief.path)
    if (awaitRoomPath === false) return resolve()

    // 查找首席弟子
    await this.await()
    const npc = this.npcList.find(x => x.name.includes(chief.name))
    if (npc) {
      this.onText(`请安任务目标${npc.name.replace(/\s/g, ``)}。`, `hig`)
      this.send(`ask2 ${npc.id},tasks`)
    } else {
      this.onText(`请安任务找不到目标${this.familyText}${chief.name}。`, `hir`)
    }
    resolve()
  })
}

export default {
  methods: { toTaskQa },
}
