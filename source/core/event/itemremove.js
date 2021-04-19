import Valkyrie from "../Valkyrie"

Valkyrie.on(`itemremove`, function(data) {
  const id = data.id
  if (!id) return

  const index = this.roleList.findIndex(item => item.id === id)
  if (index !== -1) this.roleList.splice(index, 1)
})
