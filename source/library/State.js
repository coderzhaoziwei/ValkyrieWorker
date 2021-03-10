import StateList from './StateList'

class State {
  constructor() {
    this.value = 0
    this.text1 = ''
    this.text2 = ''
  }
  updateState(text1, text2) {
    const index = StateList.findIndex(state => text1 && text1.includes(state))
    this.value = index + 1
    this.text1 = StateList[index] || text1 || ''
    this.text2 = text2 || ''
  }
}

export default State
