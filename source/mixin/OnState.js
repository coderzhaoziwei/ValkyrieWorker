import STATE_LIST from "../data/STATE_LIST.json"

export default {
  data() {
    return {
      stateText: ``,
    }
  },
  computed: {
    documentTitle() {
      if (this.name) {
        return `${this.name} ${this.stateText} ${this.serverText}`
      }
      return `武神传说`
    },
  },
  watch: {
    documentTitle(value) {
      document.title = value
    },
  },
  mounted() {
    this.on(`state`, function(data) {
      const stateText = STATE_LIST.find(x => (typeof data.state === `string`) && data.state.includes(x))
      this.stateText = stateText || data.state || ``
      // 修改状态
      data.state = this.stateText
      // 删除描述
      if (this.options.showStateDesc === false) {
        delete data.desc
      }
    })
    // 战斗状态
    this.on(`combat`, function(data) {
      if (data.start === 1) this.stateText = `战斗`
      if (data.end === 1) this.stateText = ``
    })
    // 死亡状态
    this.on(`die`, function(data) {
      if (data.relive === true) this.stateText = ``
      else this.stateText = `死亡`
    })
  },
}
