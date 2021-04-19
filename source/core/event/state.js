import Valkyrie from "../Valkyrie"
import { STATE_LIST } from "../GameData"

Valkyrie.on(`state`, function(data) {
  const index = STATE_LIST.findIndex(state => data.state && data.state.includes(state))
  this.state.value = index + 1
  this.state.text = STATE_LIST[index] || data.state || ``
  this.state.detail = ``
  // 修改状态文本
  data.state = this.state.text
  // 删除状态描述
  delete data.desc
})
