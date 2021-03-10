import { setValue, getValue, getCookie } from './Common'

class Storage {
  constructor() {
    this.roles = {}
  }
  set id(value) {
    unsafeWindow.ID = value

    const id = value
    const name = this.roles[id].name
    const title = this.roles[id].title
    const cookies = { u: getCookie('u'), p: getCookie('p'), s: getCookie('s') }
    const token = `${ cookies.u } ${ cookies.p }`
    const server = ['一区', '二区', '三区', '四区', '测试'][cookies.s]

    const role = getValue(id) || {}
    role.id = id
    role.name = name
    role.title = title
    role.cookies = cookies
    role.token = token
    role.server = server
    setValue(id, role)

    const roles = getValue('ids') || []
    const index = roles.findIndex(role => role.id === id)
    if (index === -1) roles.push({ id, name })
    setValue('ids', roles)
  }
  get id() {
    return unsafeWindow.ID
  }
  updateRoles(roles) {
    roles.forEach(role => (this.roles[role.id] = { name: role.name, title: role.title }))
  }
  updateId(id) {
    this.id = id
  }
}

export default Storage
