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
      this.stateText = STATE_LIST.find(x => data.state.includes(x)) || data.state || ``
      // 修改状态
      data.state = this.stateText
      // 删除描述
      if (this.options.showStateDesc === false) {
        delete data.desc
      }
    })
  },
}
