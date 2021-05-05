import Chat from "../class/Chat"

export default {
  data() {
    return {
      chatList: [],
    }
  },
  mounted() {
    this.on(`msg`, function(data) {
      this.chatList.push(new Chat(data))
      if (this.chatList.length > 888) {
        this.chatList.splice(0, 88)
      }
    })
  },
}
