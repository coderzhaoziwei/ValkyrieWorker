import Base from "./Base"
import PACK_LIST from "../data/PACK_LIST"

/** 物品
 * @param {string} id          - 标识
 * @param {string} name        - 名称
 * @param {number} count       - 数量
 * @param {string} unit        - 单位: 块, 张, 本...
 * @param {number} value       - 价值
 * @param {number} can_eq      - 可装备: 0/1
 * @param {number} can_use     - 可使用: 0/1
 * @param {number} can_study   - 可学习: 0/1
 * @param {number} can_combine - 可合成: 0/1
 */
export default class Pack extends Base {
  constructor(data) {
    super(data)
    this.count = data.count
    this.unit = data.unit
    this.value = data.value || 0
    this.can_eq = data.can_eq || 0
    this.can_use = data.can_use || 0
    this.can_study = data.can_study || 0
    this.can_combine = data.can_combine || 0
  }
  get sort() {
    const index = PACK_LIST.findIndex(name => this.name.includes(name))
    return this.color + (index === -1 ? 10000 : (index * 10))
  }
  get isEquip() {
    return this.can_eq === 1
  }

  /** 物品价值文本
   * @todo 根据 value 显示文本
   * @example 2000 => "2银"
   */
  get valueText() {
    return this.value
  }
}
