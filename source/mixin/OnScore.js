export default {
  data() {
    return {
      score: {},
      jyValue: 0,
      qnValue: 0,
    }
  },
  computed: {
    // 经验
    jyCache() {
      return Number(this.score.exp) || 0
    },
    jyText() {
      return Number(this.jyValue.toFixed()).toLocaleString()
    },
    // 潜能
    qnCache() {
      return Number(this.score.pot) || 0
    },
    qnText() {
      return Number(this.qnValue.toFixed()).toLocaleString()
    },
    // 先天悟性
    wx1() {
      return Number(this.score.int) || 0
    },
    // 后天悟性
    wx2() {
      return Number(this.score.int_add) || 0
    },
    // 学习效率
    xxxl() {
      return parseInt(this.score.study_per ) || 0
    },
    // 练习效率
    lxxl() {
      return parseInt(this.score.lianxi_per) || 0
    },
    // 练习每一跳消耗＝(先天悟性＋后天悟性)×(1＋练习效率%－先天悟性%)
    lxCost() {
      return parseInt((this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100))
    },
    // 学习每一跳消耗＝(先天悟性＋后天悟性)×(1＋学习效率%－先天悟性%)×3
    xxCost() {
      return parseInt((this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3)
    },
    // 气血百分比
    hpPercentage() {
      return parseInt((this.score.hp / this.score.max_hp) * 100) || 0
    },
    // 内力百分比
    mpPercentage() {
      return parseInt((this.score.mp / this.score.max_mp) * 100) || 0
    },
    // 门派
    familyText() {
      return this.score.family || ``
    },
    // 性别
    genderText() {
      return this.score.gender || ``
    },
    // 精力
    energy() {
      if (typeof this.score.jingli === `string` && /^(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+$/.test(this.score.jingli)) {
        const value = Number(RegExp.$1) || 0
        const limit = Number(RegExp.$2) || 0
        const today = Number(RegExp.$3) || 0
        return { value, limit, today }
      }
      return { value: 0, limit: 0, today: 0 }
    },
    energyValue() {
      return this.energy.value
    },
    energyLimit() {
      return this.energy.limit
    },
  },
  watch: {
    // 数字动态递增：经验、潜能
    jyCache(value) {
      if (document && document.hidden) {
        this.jyValue = value
      } else {
        gsap.to(this.$data, { duration: 0.5, jyValue: value })
      }
    },
    qnCache(value) {
      if (document && document.hidden) {
        this.qnValue = value
      } else {
        gsap.to(this.$data, { duration: 0.5, qnValue: value })
      }
    },
  },
  mounted() {
    const update = function(data) {
      if (data.id === this.id) {
        Object.keys(data).forEach(key => {
          this.score[key] = data[key]
        })
      }
    }
    this.on(`score`, update)
    this.on(`sc`, update)
  },
}
