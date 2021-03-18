import * as Common  from './library/Common'
import Valkyrie from './library/Valkyrie'
import ValkyrieWorker from './library/ValkyrieWorker'

(function() {
  if (unsafeWindow.Valkyrie) return

  unsafeWindow.Vue = Vue
  unsafeWindow.Element3 = Element3
  unsafeWindow.Valkyrie = Valkyrie
  unsafeWindow.ValkyrieWorker = new ValkyrieWorker()

  unsafeWindow.gsap = gsap
  unsafeWindow.common = Common
  unsafeWindow.console.log = _=>_

  const on = (type, handler) => unsafeWindow.ValkyrieWorker.on(type, handler)

  on('roles', data => Valkyrie.storage.updateRoles(data.roles))
  on('login', data => Valkyrie.storage.updateId(data.id))
  on('state', data => Valkyrie.state.updateState(data.state))
  on('room', data => Valkyrie.room.updateRoom(data))
  on('exits', data => Valkyrie.room.updateExit(data.items))
  on('items', data => Valkyrie.room.updateItems(data.items))
  on('itemadd', data => Valkyrie.room.updateItemadd(data))
  on('itemremove', data => Valkyrie.room.updateItemremove(data.id))
  on('sc', data => Valkyrie.room.updateSc(data))
  on('skills', data => Valkyrie.skill.updateSkills(data))
  // 物品
  on('pack', data => Valkyrie.pack.updatePack(data))
  on('list', data => Valkyrie.pack.updateStore(data))
  // 消息
  on('msg', data => Valkyrie.channel.updateMessage(data))
  // 地图
  on('map', data => Valkyrie.map.updateMap(data.map))
  // 任务
  on('tasks', data => Valkyrie.task.updateTask(data.items))
  // 属性
  on('score', data => Valkyrie.score.updateScore(data))
  on('sc', data => Valkyrie.score.updateScore(data))
  on('login', data => {
    if (data.id) Valkyrie.score.id = data.id
  })
  on('text', data => {
    // <hig>你获得了5360点经验，200000点潜能，<wht>二十六两白银</wht><yel>八十个铜板</yel>。</hig>
    if (/你获得了(\d+)点经验，(\d+)点潜能/.test(data.text)) {
      Valkyrie.score.exp += Number(RegExp.$1) || 0
      Valkyrie.score.pot += Number(RegExp.$2) || 0
    }
  })

})()
