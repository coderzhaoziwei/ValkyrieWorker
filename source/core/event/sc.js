import Valkyrie from "../Valkyrie"

Valkyrie.on(`sc`, function(data) {
  const index = this.roleList.findIndex(item => item.id === data.id)
  if (index === -1) return

  if (this.hasOwn(data, `hp`)) this.roleList[index].hp = data.hp
  if (this.hasOwn(data, `mp`)) this.roleList[index].mp = data.mp
  if (this.hasOwn(data, `max_hp`)) this.roleList[index].max_hp = data.max_hp
  if (this.hasOwn(data, `max_mp`)) this.roleList[index].max_mp = data.max_mp
})
