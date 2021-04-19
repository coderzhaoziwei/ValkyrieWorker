import Valkyrie from "../Valkyrie"
import { Pack } from "../GameInstance"

Valkyrie.on(`list`, function(data) {
  // 仓库
  if (this.hasOwn(data, `max_store_count`)) {
    this.storeLimit = Number(data.max_store_count) || 0
  }
  if (this.hasOwn(data, `stores`)) {
    this.storeList.splice(0)
    data.stores.forEach(item => this.storeList.push(new Pack(item)))
    this.storeList.sort((a, b) => a.sortValue - b.sortValue)
    // 修改仓库列表
    data.stores = this.storeList
  }

  // 售卖
  if (this.hasOwn(data, `seller`) && this.hasOwn(data, `selllist`)) {
    this.seller = data.seller
    this.sellList.splice(0)
    data.selllist.forEach(item => this.sellList.push(new Pack(item)))
  }
})
