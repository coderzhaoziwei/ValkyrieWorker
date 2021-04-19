import Valkyrie from "../Valkyrie"

Valkyrie.on(`roles`, function(data) {
  if (data.roles instanceof Array) {
    data.roles.forEach(item => {
      const { id, name, title } = item
      this.roles[id] = { name, title }
    })
  }
})
