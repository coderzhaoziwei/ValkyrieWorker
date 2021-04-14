/* 工具函数类 */
export default class Util {
  static setAccounts(value) {
    localStorage.setItem(`_accounts`, JSON.stringify(value))
  }
  static getAccounts() {
    return JSON.parse(localStorage.getItem(`_accounts`) || `[]`)
  }
  static updateAccount(account) {
    const accounts = Util.getAccounts()
    const index = accounts.findIndex(item => item.id === account.id)

    if (index === -1)
      accounts.push(account)
    else
      accounts[index] = account

    Util.setAccounts(accounts)
  }

  static setValue(key, value) {
    const id = unsafeWindow.id
    if (typeof id === 'string') {
      const account = JSON.parse(localStorage.getItem(id) || `{}`)
      account[key] = value
      localStorage.setItem(id, JSON.stringify(account))
      return account
    }
    return false
  }
  static getValue(key) {
    const id = unsafeWindow.id
    if (typeof id === 'string') {
      const account = JSON.parse(localStorage.getItem(id) || `{}`)
      return (typeof key === 'string') ? (account[key] || {}) : account
    }
    return false
  }

  static getCookie(name) {
    const cookies = document.cookie.split(`;`).reduce((cookies, cookieString) => {
      const i = cookieString.indexOf(`=`)
      const name = cookieString.substr(0, i).trim()
      const value = cookieString.substr(i + 1)
      cookies[name] = value
      return cookies
    }, {})
    return cookies[name]
  }
  static setCookie(name, value) {
    document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`
    return true
  }

  static hasOwn(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  }

  static eventToData(event) {
    const data = event.data
    return data[0] === '{' ? new Function(`return ${ data };`)() : { 'type': 'text', 'text': data }
  }
  static dataToEvent(data) {
    return data.type === `text` ? { data: data.text } : { data: JSON.stringify(data) }
  }
}
