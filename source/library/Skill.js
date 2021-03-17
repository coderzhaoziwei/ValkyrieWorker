import SkillItem from './SkillItem'

class Skill {
  constructor() {
    this.list = []
    this.limit = 0
    this.wx1 = 0
    this.wx2 = 0
    this.xxxl = 0
    this.lxxl = 0
    this.qn = 0
  }
  updateSkills(data) {
    const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
    if (hasOwn(data, 'items')) {
      this.list.splice(0)
      data.items.forEach(item => this.list.push(new SkillItem(item)))
      this.list.sort((a, b) => a.sort - b.sort)
    }
    if (hasOwn(data, 'limit')) this.limit = parseInt(data.limit) || 0
    if (hasOwn(data, 'item')) this.list.push(new SkillItem(data.item))
    if (hasOwn(data, 'id')) {
      const index = this.list.findIndex(skill => skill.id === data.id)
      if (index !== -1 && hasOwn(data, 'level')) this.list[index].level = parseInt(data.level) || 0
      if (index !== -1 && hasOwn(data, 'exp')) this.list[index].updateExp(data.exp)
    }
    if (hasOwn(data, 'pot')) this.qn = parseInt(data.pot) || 0
  }
}

export default Skill
