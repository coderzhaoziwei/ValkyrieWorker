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
    if (index === -1) {
      accounts.push(account)
    } else {
      accounts[index] = account
    }
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

  // static
  // static

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

  static setElementAttribute(element, attribute) {
    Object.keys(attribute).forEach(key => {
      if (key === 'innerHTML') {
        element.innerHTML = attribute[key]
      } else if (key === 'innerText') {
        element.innerText = attribute[key]
      } else {
        element.setAttribute(key, attribute[key])
      }
    })
  }
  static setAttribute(selector, attribute) {
    const elements = document.querySelectorAll(selector)
    elements.forEach(element => Util.setElementAttribute(element, attribute))
  }
  static appendElement(parentNode, tagName, attribute) {
    const element = document.createElement(tagName)
    Util.setElementAttribute(element, attribute)
    parentNode.appendChild(element)
  }
}
