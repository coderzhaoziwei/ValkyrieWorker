import { getColorSortByName } from './Common'
import PackList from './PackList'

class PackItem {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.count = data.count
    this.unit = data.unit
    this.value = data.value || 0
    this.can_eq = data.can_eq || 0
    this.can_use = data.can_use || 0
    this.can_study = data.can_study || 0
    this.can_combine = data.can_combine || 0
  }
  get color() {
    return getColorSortByName(this.name)
  }
  get sort() {
    const index = PackList.findIndex(name => this.name.includes(name))
    return this.color + (index === -1 ? 10000 : (index * 10))
  }
  get isEquip() {
    return this.can_eq === 1
  }
}

export default PackItem

/**
 *
unit: "块"
value: 1000 : 1
count: 1
id: "lw692a7d37b"
name: "<hic>★★★神龙冠</hic>"
unit: "件"
value: 2000
 */
