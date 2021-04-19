import Valkyrie from "../Valkyrie"

Valkyrie.on(`room`, function(data) {
  const { name, path, desc, commands } = data
  this.room.name = name
  this.room.path = path
  this.room.desc = desc

  this.room.cmds.splice(0)
  this.room.cmds.push(...commands)

  const nameList = name.split(/-|\(|\)/)
  this.room.x = nameList[0]
  this.room.y = nameList[1]

})
