import Valkyrie from "../Valkyrie"

// 自定义指令
Valkyrie.on(`custom-command`, function(data) {
  // {npc:*****}
  while (/{npc:([\s\S]+?)}/i.test(data.command)) {
    const npc = this.npcList.find(npc => npc.name.includes(RegExp.$1))
    data.command = data.command.replace(/{npc:([\s\S]+?)}/i, npc ? npc.id : `[unkonw id]`)
  }

  this.sendCommand(data.command)
})
