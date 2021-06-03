export default {
  data() {
    return {
      performList: [],
    }
  },
  computed: {

  },
  watch: {
    performList(value) {
      this.setValue(`performs`, value)
    },
  },
  methods: {
    updatePerform(pfm) {
      const index = this.performList.findIndex(x => x.id === pfm.id)
      if (index === -1) {
        this.performList.push(pfm)
      } else {
        this.performList.splice(index, 1, pfm)
      }
    },
  },
  mounted() {
    // 登录加载本地记录
    this.on(`login`, function() {
      if (this.id) {
        const performs = this.getValue(`performs`)
        if (performs instanceof Array) {
          this.performList.push(...performs)
        }
      }
    })
    /** skills: Array(10)
0: {id: "blade.shi", name: "嗜血", distime: 43821}
1: {id: "blade.xue", name: "血海魔刀", distime: 13421}
2: {id: "force.zhui", name: "追魂", distime: 9621}
3: {id: "force.cui", name: "逆转九阴", distime: 43821}
4: {id: "unarmed.duo", name: "夺魄", distime: 11901}
5: {id: "unarmed.juan", name: "风卷残云", distime: 11901}
6: {id: "dodge.fo", name: "比翼", distime: 43821}
7: {id: "parry.yi", name: "移花", distime: 17221}
8: {id: "throwing.luo", name: "血滴子", distime: 10381}
9: {id: "throwing.wu", name: "天网", distime: 43821}
length: 10 */
    this.on(`perform`, function(data) {
      const list = data.skills
      if (list instanceof Array) {
        // 清空原数据
        this.performList.forEach(x => x.enable = true)
        list.forEach(x => {
          const { id, name, distime } = x
          this.performList.push({ id, name, distime })
        })
      }
    })

  },
}
