import Pack from "../class/Pack"

export default {
  data() {
    return {
      equipList: [],
      packList: [],
      packLimit: 0,
      moneyValue: 0,
    }
  },
  computed: {
    // 物品数量
    packCount() {
      return this.packList.length
    },
  },
  mounted() {
    this.on(`pack`, function(data) {
      if (this.hasOwn(data, `eqs`) && data.eqs instanceof Array) {
        data.eqs.forEach((x, i) => (this.equipList[i] = x))
      }
      if (this.hasOwn(data, `items`) && data.items instanceof Array) {
        this.packList.splice(0)
        data.items.forEach(x => this.packList.push(new Pack(x)))
        this.packList.sort((a, b) => a.sortValue - b.sortValue)
        // 修改
        data.items = this.packList
      }
      // 钱
      if (this.hasOwn(data, `money`)) {
        this.moneyValue = Number(data.money) || 0
      }
      // 物品上限
      if (this.hasOwn(data, `max_item_count`)) {
        this.packLimit = Number(data.max_item_count) || 0
      }
    })
  },
}
