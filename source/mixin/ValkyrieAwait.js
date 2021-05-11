export default {
  data() {
    return {

    }
  },
  methods: {
    await(timeout = 1000) {
      return new Promise(resolve => setTimeout(() => resolve(), timeout))
    },
    awaitTaskData(timeout = 30000) {
      return new Promise(resolve => {
        const id = setTimeout(() => [resolve(false), this.onText(`获取任务数据失败。`, `hir`)], timeout)
        const clearEvent = this.on(`tasks`, data => this.hasOwn(data, `items`) && [resolve(true), clearEvent(), clearTimeout(id)])
      })
    },
    awaitPackList(timeout = 30000) {
      return new Promise(resolve => {
        const id = setTimeout(() => [resolve(false), this.onText(`获取背包数据失败。`, `hir`)], timeout)
        const clearEvent = this.on(`pack`, data => this.hasOwn(data, `items`) && [resolve(true), clearEvent(), clearTimeout(id)])
      })
    },
    awaitStoreList(timeout = 30000) {
      return new Promise(resolve => {
        const id = setTimeout(() => [resolve(false), this.onText(`获取仓库数据失败。`, `hir`)], timeout)
        const clearEvent = this.on(`list`, data => this.hasOwn(data, `stores`) && [resolve(true), clearEvent(), clearTimeout(id)])
      })
    },
    awaitSellList(timeout = 30000) {
      return new Promise(resolve => {
        const id = setTimeout(() => [resolve(false), this.onText(`获取商店数据失败。`, `hir`)], timeout)
        const clearEvent = this.on(`list`, data => this.hasOwn(data, `selllist`) && [resolve(true), clearEvent(), clearTimeout(id)])
      })
    },
    // 等待指定的房间
    awaitRoomPath(path, timeout = 30000) {
      return new Promise(resolve => {
        const id = setTimeout(() => [resolve(false), this.onText(`前往指定房间失败。[${path}]`, `hir`)], timeout)
        const clearEvent = this.on(`room`, data => (data.path === path) && [resolve(true), clearEvent(), clearTimeout(id)])
      })
    },
    // 等待指定的角色
    awaitNpcName(name, timeout = 30000) {
      return new Promise(resolve => {
        const id = setTimeout(() => [resolve(false), this.onText(`寻找指定角色失败。[${name}]`, `hir`)], timeout)
        const clearEvent = this.on(`items`, () => {
          const npc = this.npcList.find(x => x.name.includes(name))
          if (npc) {
            [resolve(npc.id), clearEvent(), clearTimeout(id)]
          }
        })
      })
    },
    // 等待战斗的结束
    awaitCombatEnd(timeout = 300000) {
      return new Promise(resolve => {
        const id = setInterval(() => {
          if (this.stateState !== `战斗`) {
            resolve(false)
            clearInterval(id)
            this.onText(`战斗异常结束。`, `hir`)
          }
        }, timeout)
        const clearEvent = this.on(`combat`, data => {
          if (data.end === 1) {
            clearEvent()
            resolve(true)
            clearInterval(id)
          }
        })
      })
    },
  },
  mounted() {

  },
}
