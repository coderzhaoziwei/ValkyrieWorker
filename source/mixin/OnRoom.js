export default {
  data() {
    return {
      roomName: ``,
      roomPath: ``,
      roomDesc: ``,
      roomCmds: [],
      roomX: ``,
      roomY: ``,
    }
  },
  computed: {
    roomTitle() {
      return `${this.roomX} ${this.roomY}`
    },
  },
  mounted() {
    this.on(`room`, function(data) {
      const { name, path, desc, commands } = data

      this.roomName = name
      this.roomPath = path
      this.roomDesc = desc
      this.roomCmds.splice(0)
      this.roomCmds.push(...commands)

      const names = name.split(/-|\(|\)/)
      this.roomX = names[0]
      this.roomY = names[1]
    })
  },
}
