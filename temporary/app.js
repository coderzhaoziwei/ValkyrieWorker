const app = Vue.createApp({
  data() {
    return {
      // 弹窗
      showChannelDialog: false,
      showMapDialog: false,
      showTaskDialog: false,
    }
  },
  computed: {
    // 宽度自适应
    isMobile() {
      return this.width <= 768
    },
    showSidebarLeft() {
      return this.id && (!this.isMobile || this.showLeft)
    },
    showSidebarRight() {
      return this.id && (!this.isMobile || this.showRight)
    },
  },
})
