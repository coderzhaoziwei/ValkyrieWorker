export default {
  data() {
    return {
      options: {
        showStateDesc: false,

        showPanelRoom: true, // 房间面板

        showMapDialog: false, // 地图弹窗
      },
    }
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
      }
    })
    // 默认关闭弹窗
    this.options.showMapDialog = false
  },
}
