const setElementAttributes = function(element, attributes) {
  Object.keys(attributes).forEach(key => {
    if (key === 'innerHTML') {
      element.innerHTML = attributes[key]
    } else if (key === 'innerText') {
      element.innerText = attributes[key]
    } else {
      element.setAttribute(key, attributes[key])
    }
  })
}
export const setAttribute = function(selector, attributes) {
  const elements = document.querySelectorAll(selector)
  elements.forEach(element => setElementAttributes(element, attributes))
}
export const createElement = function(tagName, attributes) {
  const element = document.createElement(tagName)
  setElementAttributes(element, attributes)
  return element
}
export const appendElement = function(parentNode, tagName, attributes) {
  const element = createElement(tagName, attributes)
  parentNode.appendChild(element)
}
export const insertElement = function(parentNode, nextNode, tagName, attributes) {
  const element = createElement(tagName, attributes)
  parentNode.insertBefore(element, nextNode)
}
export const removeElement = function(parentNode, childNode) {
  parentNode.removeChild(childNode)
}

