import ChannelItem from './ChannelItem'

class Channel {
  constructor() {
    this.list = []
  }
  updateMessage(data) {
    this.list.push(new ChannelItem(data))
    // if (this.list.length > 1000) this.list.splice(0, 2)
  }
}

export default Channel
