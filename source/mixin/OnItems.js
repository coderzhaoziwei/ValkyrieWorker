import Role from "../class/Role"

export default {
  data() {
    return {
      roleList: [],
    }
  },
  computed: {
    // 当前 NPC 列表
    npcList() {
      return this.roleList.filter(x => x.isNpc)
    },
  },
  mounted() {
    this.on(`items`, function(data) {
      if (data.items instanceof Array) {
        this.roleList.splice(0)
        data.items.forEach(x => x && this.roleList.push(new Role(x)))
        this.roleList.sort((a, b) => a.sortValue - b.sortValue)
        // 修改
        data.items = this.roleList
      }
    })
    this.on(`itemadd`, function(data) {
      const role = new Role(data)
      const index = this.roleList.findIndex(x => x.id === role.id)
      if (index !== -1) {
        this.roleList.splice(index, 1, role)
      } else {
        this.roleList.push(role)
      }
      this.roleList.sort((a, b) => a.sortValue - b.sortValue)
      // 修改
      data.type = `items`
      data.items = this.roleList
    })
    this.on(`itemremove`, function(data) {
      if (typeof data.id === `string`) {
        const index = this.roleList.findIndex(x => x.id === data.id)
        if (index !== -1) {
          this.roleList.splice(index, 1)
        }
      }
    })

    this.on(`sc`, function(data) {
      const role = this.roleList.find(x => x.id === data.id)
      if (role === undefined) return

      if (this.hasOwn(data, `hp`)) this.roleList[index].hp = data.hp
      if (this.hasOwn(data, `mp`)) this.roleList[index].mp = data.mp
      if (this.hasOwn(data, `max_hp`)) this.roleList[index].max_hp = data.max_hp
      if (this.hasOwn(data, `max_mp`)) this.roleList[index].max_mp = data.max_mp

    })
  },
}
