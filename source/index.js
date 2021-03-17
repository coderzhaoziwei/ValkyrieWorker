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
  on('pack', data => Valkyrie.pack.updatePack(data))
  on('msg', data => Valkyrie.channel.updateMessage(data))
  on('map', data => Valkyrie.map.updateMap(data.map))
  on('task', data => Valkyrie.task.updateTask(data.items))

  // 属性
  on('score', data => Valkyrie.score.updateScore(data))
  on('sc', data => Valkyrie.score.updateScore(data))
  on('login', data => {
    if (data.id) Valkyrie.score.id = data.id
  })
  on('text', data => {
    if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
      Valkyrie.score.exp += Number(RegExp.$1) || 0
      Valkyrie.score.pot += Number(RegExp.$2) || 0
    }
  })

})()
