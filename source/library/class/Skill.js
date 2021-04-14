import Base from './Base'

export default class Skill extends Base {
  constructor(data) {
    super(data)
    this.level = Number(data.level) || 0
    this.can_enables = data.can_enables || undefined
    this.enable_skill = data.enable_skill || ``
    this.exp = 0
    this.updateExp(data.exp)
  }

  /** 更新熟练度值
   * @param {number} exp - 数值
   * @return {number} 计算后的熟练度数值为 [10, 95] 区间中 5 的倍数
   */
  updateExp(value) {
    value = Number(value) || 0
    this.exp = (value <= 10) ? 10 : parseInt(value / 5) * 5
    return this.exp
  }

  /** 技能系数
   * @return {number} float
   * @explain 技能系数 = 技能颜色 * 2.5
   */
  get k() {
    return this.color * 2.5
  }

  /** 排序权重
   * @return {number}
   * @explain 基础技能 = [1: 内功, 2: 拳脚, 3: 轻功, 4: 招架, 5: 刀, 6: 剑, 7: 棍, 8: 杖, 9: 鞭, 10: 暗器]
   * @explain 特殊技能 = 等级权重 + 颜色权重
   */
  get sort() {
    // 基础技能
    if (this.color === 1) {
      return [
        `force`,
        `unarmed`,
        `dodge`,
        `parry`,
        `blade`,
        `sword`,
        `club`,
        `staff`,
        `whip`,
        `throwing`,
        `bite`,     // 11: 野兽扑咬
        `literate`, // 12: 读书识字
        `lianyao`,  // 13: 炼药术
      ].findIndex(item => item === this.id) + 1
    }

    // 技能等级权重
    const levelSort = 100000 - this.level
    // 技能颜色权重
    const colorSort = (10 - this.color) / 2

    return levelSort + colorSort
  }
}
