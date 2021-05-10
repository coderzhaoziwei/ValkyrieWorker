function toCheck() {
  return new Promise(async resolve => {
    const regexp = /副本区域/
    if (regexp.test(this.roomName)) {
      this.onText(`请离开[<hiy>${this.roomName}</hiy>]后再尝试。`, `him`)
      resolve(false)
    } else {
      resolve(true)
    }
  })
}

export default {
  methods: { toCheck },
}
