import FUBEN_LIST from "../data/FUBEN_LIST.json"

export default {
  data() {
    return {
      options: Vue.reactive({
        showStateDesc: false,

        showPanelRoom: true, // 房间面板
        showPanelScore: true,
        showPanelTask: true,

        showMapDialog: false, // 地图弹窗
        showTaskDialog: false,

        canTaskFb: false,
        canTaskFbId: `yz/lw/shangu`,
        canTaskFbType: 0,
        canTaskGzm: false,

        canTaskQa: false,
        canTaskSm: false,
        canTaskSmCard: false,
        canTaskSmStore: false,
        canTaskSmGiveup: false,
        canTaskYm: false,
        canTaskYmSweep: false,
        canTaskYmGiveup: false,
        canTaskWd: false,
        canTaskEndWk: false,
        canTaskEndBg: false,
        canTaskEndDz: false,
      }),
    }
  },
  computed: {
    FUBEN_LIST() {
      return FUBEN_LIST
    },
  },
  mounted() {
    // 深度监听即时保存
    this.$watch(`options`, value => this.setValue(`options`, value), { deep: true })
    // 登录加载本地配置
    this.on(`login`, function() {
      if (this.id) {
        const options = this.getValue(`options`)
        Object.keys(options).forEach(key => {
          this.options[key] = options[key]
        })
        // 默认关闭弹窗
        this.options.showMapDialog = false
        this.options.showTaskDialog = false

      }
    })
  },
}
