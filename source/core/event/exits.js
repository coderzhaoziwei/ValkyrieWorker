import Valkyrie from "../Valkyrie"

Valkyrie.on(`exits`, function(data) {
  if (data.items instanceof Array) {
    this.exitList.splice(0)
    Object.keys(data.items).forEach(dir => {
      const name = data.items[dir]
      const cmd = `go ${dir}`
      this.exitList.push({ dir, name, cmd })
    })
  }
})
