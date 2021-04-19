import Valkyrie from "../Valkyrie"

Valkyrie.on(`login`, function(data) {
  const id = data.id
  if (!id) return

  const name = this.roles[id].name
  const title = this.roles[id].title
  const cookies = {
    u: this.getCookie(`u`),
    p: this.getCookie(`p`),
    s: this.getCookie(`s`),
  }
  const token = `${ cookies.u } ${ cookies.p }`
  const server = [`一区`, `二区`, `三区`, `四区`, `五区`, `六区`][cookies.s]

  this.role = { id, name, title, server, cookies, token }

  // 添加全局标识
  unsafeWindow.id = id

})
