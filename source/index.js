import Util from "./library/class/Util"
import Cache from "./library/class/Cache"
import ValkyrieWorker from "./library/ValkyrieWorker"

import "./library/action/xiulian"

(function() {
  if (unsafeWindow.ValkyrieWorker) return

  const worker = new ValkyrieWorker()
  unsafeWindow.ValkyrieWorker = worker

  const cache = Vue.reactive(new Cache())
  unsafeWindow.ValkyrieCache = cache

  const on = (type, handler) => worker.on(type, handler)

  unsafeWindow.Vue = Vue
  unsafeWindow.Element3 = Element3
  unsafeWindow.Gsap = gsap
  unsafeWindow.Util = Util
  unsafeWindow.console.log = _=>_

  // 角色列表
  on(`roles`, data => cache.updateRoleItems(data.roles))
  // 角色登入
  on(`login`, data => cache.updateLoginId(data.id))
  // 房间
  on(`room`, data => cache.updateRoomData(data))
  // 出口
  on(`exits`, data => (data.items) && cache.updateExitItems(data.items))
  // 地图
  on(`map`, data => (data.map) && cache.updateMapItems(data.map))
  // 房间角色列表
  on(`items`, data => (data.items) && cache.updateItems(data.items))
  on(`itemadd`, data => cache.updateAddItemData(data))
  on(`itemremove`, data => (data.id) && cache.updateRemoveItemId(data.id))
  on(`sc`, data => cache.updateScData(data))
  // 属性
  on(`score`, data => (data.id === unsafeWindow.id) && cache.updateScoreData(data))
  on(`sc`, data => (data.id === unsafeWindow.id) && cache.updateScoreData(data))
  // 状态
  on(`state`, data => cache.updateStateData(data))
  // 技能
  on(`skills`, data => cache.updateSkillData(data))
  // 物品
  on(`pack`, data => cache.updatePackData(data))
  on(`list`, data => cache.updateStoreData(data))
  on(`list`, data => cache.updateSellData(data))
  // 聊天
  on(`msg`, data => cache.updateMsgData(data))
  // 任务
  on(`tasks`, data => (data.items) && cache.updateTaskItems(data.items))
  // 自定义指令
  on(`custom-command`, data => {
    // {npc:*****}
    while (/{npc:([\s\S]+?)}/i.test(data.command)) {
      const npc = cache.npcList.find(npc => npc.name.includes(RegExp.$1))
      data.command = data.command.replace(/{npc:([\s\S]+?)}/i, npc ? npc.id : `[unkonw id]`)
    }
    worker.sendCommand(data.command)
  })

  on(`text`, data => {
    // <hig>你获得了5360点经验，200000点潜能，<wht>二十六两白银</wht><yel>八十个铜板</yel>。</hig>
    if (/你获得了(\d+)点经验，(\d+)点潜能/.test(data.text)) {
      cache.score.exp += Number(RegExp.$1) || 0
      cache.score.pot += Number(RegExp.$2) || 0

    }
  })
  on(`text`, data => {
    // 技能等级提升
    if (/^<hiy>你的[\s\S]+等级提升了！<\/hiy>$/.test(data.text)) {
      return delete data.type
    }

    // 获得经验潜能
    if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
      data.text = data.text.replace(/<\S+?>/g, ``)
      return
    }

  })


})()
