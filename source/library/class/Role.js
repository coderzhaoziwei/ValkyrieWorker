import Base from "./Base"

/** 角色类(玩家/NPC)
 * @param {string} id     - 标识
 * @param {string} name   - 名称
 * @param {string} hp     - 气血
 * @param {string} mp     - 内力
 * @param {string} max_hp - 最大气血
 * @param {string} max_mp - 最大内力
 * @param {array}  status - 状态
 * @param {number} p      - 1: 玩家对象
 */
export default class Role extends Base {
  constructor(data) {
    super(data)
    this.hp = data.hp || 0
    this.mp = data.mp || 0
    this.max_hp = data.max_hp || 0
    this.max_mp = data.max_mp || 0
    this.status = data.status || []
    this.p = data.p || 0
  }

  /** 是否玩家自己
   * @return {boolean}
   */
  get isSelf() {
    return this.id === unsafeWindow.id
  }
  /** 是否玩家
   * @return {boolean}
   */
  get isPlayer() {
    return this.p === 1
  }
  /** 是否NPC
   * @return {boolean}
   */
   get isNpc() {
    return !this.isPlayer
  }
  /** 是否掉线的玩家
   * @return {boolean}
   */
  get isOffline() {
    return this.name.includes(`<red>&lt;断线中&gt;</red>`)
  }

  /** 排序权重
   * @return {number}
   */
  get sort() {
    if (this.isSelf) return 0
    if (this.isNpc) return this.color
    return this.color + this.isOffline ? 2000 : 1000
  }
}
