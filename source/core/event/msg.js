import Valkyrie from "../Valkyrie"
import { Chat } from "../GameInstance"

Valkyrie.on(`msg`, function(data) {
  this.chatList.push(new Chat(data))

  if (this.chatList.length > 1100) {
    this.chatList.splice(0, 100)
  }
})
