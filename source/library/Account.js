const GetCookie = function(name) {
  const cookies = document.cookie.split(';').reduce((cookies, cookieString) => {
    const i = cookieString.indexOf('=')
    const name = cookieString.substr(0, i).trim()
    const value = cookieString.substr(i + 1)
    cookies[name] = value
    return cookies
  }, {})
  return cookies[name]
}

class Account {
  constructor() {
    this.id = ''
    this.container = GM_getValue('ValkyrieAccount') || {}
  }
  save() {
    GM_setValue('ValkyrieAccount', this.container)
  }
  updateRoles(roles) {
    roles.forEach(role => {
      const { name, title, id } = role
      this.container[id] = this.container[id] || {}
      this.container[id].name = name
      this.container[id].title = title
    })
    this.save()
  }
  updateId(id) {
    const cookies = { u: GetCookie('u'), p: GetCookie('p'), s: GetCookie('s') }
    this.container[id] = this.container[id] || {}
    this.container[id].cookies = cookies
    this.container[id].token = `${ cookies.u } ${ cookies.p }`
    this.container[id].server = ['一区', '二区', '三区', '四区', '测试'][cookies.s]
    this.save()
    this.id = id
    GM_setValue('ValkyrieId', id)
  }
}

export default Account
