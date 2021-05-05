export default {
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {

  },
  methods: {

  },
  mounted() {
    this.on(`custom-command`, function(data) {
      // {npc:*****}
      while (/{npc:([\s\S]+?)}/i.test(data.command)) {
        const string = RegExp.$1
        const regexp = new RegExp(string)
        const npc = this.npcList.find(x => regexp.test(x.name))
        if (npc) {
          data.command = data.command.replace(/{npc:([\s\S]+?)}/i, npc.id)
        } else {
          data.command = data.command.replace(/{npc:([\s\S]+?)}/i, key)
          this.onText(`[ ${key} ]`, `hir`)
        }
      }
      this.sendCommand(data.command)
    })
  },
}
