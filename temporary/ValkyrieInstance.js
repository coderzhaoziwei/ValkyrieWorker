export default class ValkyrieInstance {
  off(id) {
    this.eventEmitter.off(id)
  }

  // 默认保存角色信息
  get role() {
    return this._role
  }
  set role(value) {
    this._role = value
    const roles = this.getLocalRoles()
    const index = roles.findIndex(item => item.id === value.id)
    if (index === -1) {
      roles.push(value)
    } else {
      roles[index] = value
    }
    this.setLocalRoles(roles)
  }

  setAttribute(element, attribute) {
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
  appendElement(parentNode, tagName, attribute) {
    const element = document.createElement(tagName)
    this.setAttribute(element, attribute)
    parentNode.appendChild(element)
  }

  // 获取本地设置
  get options() {
    return this.getLocalValue(`options`)
  }


}
