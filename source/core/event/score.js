import Valkyrie from "../Valkyrie"

function updateScore(data) {
  // 判断是否当前角色的属性
  if (data.id === unsafeWindow.id) {
    Object.keys(data).forEach(key => {
      const ignore = [`type`, `dialog`, `id`] // 忽略
      if (ignore.includes(key)) return
      this.score[key] = data[key]
    })
  }
}

Valkyrie.on(`sc`, updateScore)
Valkyrie.on(`score`, updateScore)
