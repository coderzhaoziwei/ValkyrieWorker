import { getColorSortByName } from './Common'

class SkillItem {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.level = Number(data.level) || 0
    this._exp = Number(data.exp) || 0
    this.can_enables = data.can_enables || []
    this.enable_skill = data.enable_skill || ''
  }
  set exp(value) {
    this._exp = value
  }
  get exp() {
    return this._exp <= 10 ? 10 : parseInt(this._exp/5)*5
  }

  get nameText() {
    return this.name.replace(/<.+?>/g, '')
  }
  get color() {
    return getColorSortByName(this.name)
  }
  get k() {
    return this.color * 2.5
  }
  get sort() {
    if (this.color === 1) {
      return [
        'force',
        'unarmed',
        'dodge',
        'parry',
        'sword',
        'blade',
        'club',
        'staff',
        'whip',
        'throwing',
        'literate',
      ].findIndex(item => item = this.id) + 1
    }
    return (100000 - this.level) + (10 - this.color) / 2
  }
}

export default SkillItem
