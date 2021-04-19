import Cache from "../class/Cache"

Cache.prototype.xiulian = async function() {
  const checkarea = await this.checkarea()
  if (checkarea === false) return Promise.resolve(false)

  this.sendCommands(`stopstate,jh fam 0 start,go west,go west,go north,go enter,go west`)
  return new Promise(resolve => {
    const id1 = this.on(`room`, () => {
      if (this.room.path === `home/liangong`) {
        this.off(id1)
        this.onText(`<hig>到达住宅练功房，开始修炼。</hig>`)
        this.sendCommand(`xiulian`)
        resolve(true)
      }
    })
  })
}
