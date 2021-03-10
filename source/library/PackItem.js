import { getColorSortByName } from './Common'

class PackItem {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.count = data.count
  }
  get color() {
    return getColorSortByName(this.name)
  }
}

export default PackItem
