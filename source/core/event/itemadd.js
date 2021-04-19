import Valkyrie from "../Valkyrie"
import { Role } from "../GameInstance"

Valkyrie.on(`itemadd`, function(data) {
  this.roleList.push(new Role(data))
  this.roleList.sort((a, b) => b.sortValue - a.sortValue)
})
