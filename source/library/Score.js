class Score {
  constructor() {
  }
  updateScore(data) {
    if (data.id === GM_getValue('ValkyrieId')) {
      Object.keys(data).forEach(key => (this[key] = data[key]))
    }
  }
}

export default Score
