import Pack from "../class/Pack"

export default {
  data() {
    return {
      storeList: [],
      storeLimit: 0,
      seller: ``,
      sellList: [],
    }
  },
  mounted() {
    this.on(`list`, function(data) {
      // 仓库列表
      if (this.hasOwn(data, `stores`) && data.stores instanceof Array) {
        this.storeList.splice(0)
        data.stores.forEach(item => this.storeList.push(new Pack(item)))
        this.storeList.sort((a, b) => a.sortValue - b.sortValue)
        // 修改
        data.stores = this.storeList
      }
      // 仓库上限
      if (this.hasOwn(data, `max_store_count`)) {
        this.storeLimit = Number(data.max_store_count) || 0
      }

      // 商店
      if (this.hasOwn(data, `seller`)) {
        this.seller = data.seller
      }
      if (this.hasOwn(data, `selllist`) && data.selllist instanceof Array) {
        this.sellList.splice(0)
        data.selllist.forEach(x => this.sellList.push(new Pack(x)))
      }
    })
  },
}
