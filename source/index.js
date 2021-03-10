import Valkyrie from './library/Valkyrie'
import ValkyrieWorker from './library/ValkyrieWorker'

(function() {
  if (unsafeWindow.Valkyrie) return

  unsafeWindow.console.log = _=>_
  unsafeWindow.Valkyrie = Valkyrie
  unsafeWindow.ValkyrieWorker = new ValkyrieWorker()

  const on = (type, handler) => unsafeWindow.ValkyrieWorker.on(type, handler)

  on('roles', data => Valkyrie.account.updateRoles(data.roles))
  on('login', data => Valkyrie.account.updateId(data.id))
  on('state', data => Valkyrie.state.updateState(data.state))
  on('room', data => Valkyrie.room.updateRoom(data))
  on('exits', data => Valkyrie.room.updateExit(data.items))
  on('items', data => Valkyrie.room.updateItems(data.items))
  on('itemadd', data => Valkyrie.room.updateItemadd(data))
  on('itemremove', data => Valkyrie.room.updateItemremove(data.id))
  on('sc', data => Valkyrie.room.updateSc(data))
  on('skills', data => Valkyrie.skill.updateSkills(data))
  on('score', data => Valkyrie.score.updateScore(data))
  on('pack', data => Valkyrie.pack.updatePack(data))

})()
