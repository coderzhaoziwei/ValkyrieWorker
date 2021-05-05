export default {
  data() {
    return {
    }
  },
  methods: {
    // 更新工具栏位置
    updateToolBarPosition() {
      if (document.querySelector(`.content-bottom`).offsetHeight === 0) {
        document.querySelector(`[command=showcombat]`).click()
      }
      if (document.querySelector(`.right-bar`).offsetWidth === 0) {
        document.querySelector(`[command=showtool]`).click()
      }
      setTimeout(() => {
        const h1 = document.querySelector(`.content-bottom`).clientHeight
        const h2 = document.querySelector(`.tool-bar.bottom-bar`).clientHeight
        document.querySelector(`.right-bar`).style.bottom = h1 + h2 + `px`
      }, 1000)
    },
  },
  mounted() {
    // 获取数据
    this.on(`login`, async function(data) {
      this.sendCommands(`pack,score2,score`)
      await this.await(1000)
      document.querySelector(`[command=skills]`).click()
      await this.await(1000)
      document.querySelector(`[command=tasks]`).click()
      await this.await(1000)
      document.querySelector(`.dialog-close`).click()

      this.updateToolBarPosition()
    })
    // 窗口尺寸变动时 触发工具位置变动
    unsafeWindow.addEventListener(`resize`, function() {
      this.updateToolBarPosition()
    })
  },
}
