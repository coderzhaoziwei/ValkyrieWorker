import Cache from "../class/Cache"

Cache.prototype.checkarea = function() {
  const regexp = /副本区域/
  if (regexp.test(this.room.name)) {
    this.onText(`<hir>请离开<hiy>[${this.room.name}]</hiy>后再尝试。</hir>`)
    return Promise.resolve(false)
  }
  return Promise.resolve(true)
}
