import { getColorSortByName } from './Common'

class SkillItem {
  constructor(data) {
    this.id = data.id
    this.name = data.name
    this.level = Number(data.level) || 0
    this.can_enables = data.can_enables || undefined
    this.enable_skill = data.enable_skill || ''
    this.exp = 0
    this.updateExp(data.exp)
  }
  updateExp(value) {
    value = Number(value) || 0
    this.exp = (value <= 10) ? 10 : parseInt(value / 5) * 5
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
        'lianyao',
      ].findIndex(item => item === this.id) + 1
    }
    return (100000 - this.level) + (10 - this.color) / 2
  }
}

export default SkillItem
