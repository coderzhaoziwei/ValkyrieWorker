import Chat from "../class/Chat"

export default {
  data() {
    return {
      chatListCache: [],

      channelValue: `chat`,
      channelList: [
        { label: `世界`, value: `chat` },
        { label: `队伍`, value: `tm` },
        { label: `帮派`, value: `pty` },
        { label: `门派`, value: `fam` },
        { label: `全区`, value: `es` },
      ],
      chatValue: ``,
    }
  },
  computed: {
    chatList() {
      const list = this.chatListCache.filter(x =>
        (x.isCh && this.options.showChannelCh) ||
        (x.isTm && this.options.showChannelTm) ||
        (x.isFa && this.options.showChannelFa) ||
        (x.isPt && this.options.showChannelPt) ||
        (x.isEs && this.options.showChannelEs) ||
        (x.isSy && this.options.showChannelSy) ||
        (x.isRu && this.options.showChannelRu))
      return list.slice(-1000)
    },
  },
  watch: {
    // 聊天滚动到底部
    async chatList() {
      await Vue.nextTick()
      document.getElementById(`app-channel-bottom`).scrollIntoView({ behavior: `smooth` })
    },
  },
  methods: {
    sendChat() {
      const channelValue = this.channelValue
      const chatValue = this.chatValue.trim()
      if (chatValue) {
        this.send(`${channelValue} ${chatValue}`)
      }
      this.chatValue = ``
    },
  },
  mounted() {
    this.on(`msg`, function(data) {
      // 添加新消息
      this.chatListCache.push(new Chat(data))
      // 控制消息总数量在 2000 - 3000 之间
      if (this.chatListCache.length > 3000) {
        this.chatListCache.splice(0, 1000)
      }
    })
  },
}
