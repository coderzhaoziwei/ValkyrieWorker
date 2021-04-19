import Valkyrie from "../Valkyrie"
import { Pack } from "../GameInstance"

Valkyrie.on(`pack`, function(data) {
  if (this.hasOwn(data, `money`)) {
    this.moneyValue = Number(data.money) || 0
  }
  if (this.hasOwn(data, `max_item_count`)) {
    this.packLimit = Number(data.max_item_count) || 0
  }
  if (this.hasOwn(data, `eqs`)) {
    data.eqs.forEach((eq, index) => (this.equipList[index] = eq))
  }
  if (this.hasOwn(data, `items`) && data.items instanceof Array) {
    this.packList.splice(0)
    data.items.forEach(item => this.packList.push(new Pack(item)))
    this.packList.sort((a, b) => a.sortValue - b.sortValue)
    // 修改物品列表
    data.items = this.packList
  }
})
