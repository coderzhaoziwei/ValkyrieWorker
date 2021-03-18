import { hasOwn } from './Common'
import PackItem from './PackItem'

class Pack {
  constructor() {
    this.packList = []
    this.packLimit = 0
    this.equipList = Array(11)
    this.storeList = []
    this.storeLimit = 0
    this.money = 0
  }
  updatePack(data) {
    if (hasOwn(data, 'money')) this.money = parseInt(data.money) || 0
    if (hasOwn(data, 'max_item_count')) this.packLimit = parseInt(data.max_item_count) || 0
    if (hasOwn(data, 'eqs')) data.eqs.forEach((eq, index) => (this.equipList[index] = eq))
    if (hasOwn(data, 'items')) {
      this.packList.splice(0)
      data.items.forEach(item => this.packList.push(new PackItem(item)))
      this.packList.sort((a, b) => a.sort - b.sort)
    }
  }
  updateStore(data) {
    if (hasOwn(data, 'max_store_count')) {
      this.storeLimit = Number(data.max_store_count) || 0
    }
    if (hasOwn(data, 'stores')) {
      this.storeList.splice(0)
      data.stores.forEach(item => this.storeList.push(new PackItem(item)))
      this.storeList.sort((a, b) => a.sort - b.sort)
    }
  }
}

export default Pack

// {type: "dialog", dialog: "pack", id: "c7mj3f552d3", eq: 3}
