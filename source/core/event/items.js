import Valkyrie from "../Valkyrie"
import { Role } from "../GameInstance"

Valkyrie.on(`items`, function(data) {
  if (data.items instanceof Array) {
    this.roleList.splice(0)
    data.items.forEach(item => item && this.roleList.push(new Role(item)))
    this.roleList.sort((a, b) => b.sortValue - a.sortValue)
  }
})
