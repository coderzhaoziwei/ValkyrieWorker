class Score {
  constructor() {
  }
  updateScore(data) {
    if (data.id === unsafeWindow.ID) {
      Object.keys(data).forEach(key => (this[key] = data[key]))
    }
  }
}

export default Score
