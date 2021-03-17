class Task {
  constructor() {
    this.smCount = 20
    this.smTotal = 99
    this.smTarget = ''
    this.ymCount = 20
    this.ymTotal = 99
    this.ymTarget = ''
    this.ymTargetX = ''
    this.ymTargetY = ''
    this.ybCount = 20
    this.ybTotal = 99
    this.fbCount = 20
    this.wdCount = 99
    this.wdTotal = 99
    this.wdValue = true
    this.qaValue = true
    this.xyValue = true
    this.mpValue = true // true 表示任务完成
    this.activity = {}
  }
  updateTask(items) {
    this.smTarget = ''
    this.ymTarget = ''
    this.ymTargetX = ''
    this.ymTargetY = ''
    this.activity = {}
    items.forEach(task => {
      const { id, state, title, desc } = task
      switch (id) {
        case 'signin':
          // 副本：<hik>0/20</hik>
          // 副本：<hig>20/20</hig>
          desc.match(/副本：<[\S]{3}>(\d+)\/20<[\S]{4}>/)
          this.fbCount = Number(RegExp.$1) || 0
          // <hig>武道塔可以重置，进度20/29</hig>，
          // <nor>武道塔已重置，进度99/99</nor>，
          desc.match(/武道塔([\S]{1,2})重置，进度(\d+)\/(\d+)/)
          this.wdValue = (RegExp.$1 === '已')
          this.wdCount = Number(RegExp.$2) || 0
          this.wdTotal = Number(RegExp.$3) || 0
          // <hig>还没有给首席请安</hig>
          // 本周尚未协助襄阳守城，尚未挑战门派BOSS，还可以挑战武神BOSS5次。
          this.qaValue = (/还没有给首席请安/.test(desc) === false)
          this.xyValue = (/本周尚未协助襄阳守城/.test(desc) === false)
          this.mpValue = (/尚未挑战门派BOSS/.test(desc) === false)
          break
        case 'sm':
          // 你的师门委托目前完成0/20个，共连续完成16个。
          desc.match(/目前完成(\d+)\/20个，共连续完成(\d+)个/)
          this.smCount = Number(RegExp.$1) || 0
          this.smTotal = Number(RegExp.$2) || 0
          // 你的师门委托你去寻找<wht>当归</wht>，你可以慢慢寻找，没有时间限制，目前完成0/20个，共连续完成16个。
          if (/你的师门委托你去寻找(\S+)，你可以慢慢寻找/.test(desc)) {
            this.smTarget = RegExp.$1
          }
          break
        case 'yamen':
          // 扬州知府委托你追杀逃犯：目前完成0/20个，共连续完成34个。
          desc.match(/目前完成(\d+)\/20个，共连续完成(\d+)个/)
          this.ymCount = Number(RegExp.$1) || 0
          this.ymTotal = Number(RegExp.$2) || 0
          // 扬州知府委托你追杀逃犯：司空荔蓓，据说最近在峨眉派-走廊出现过，你还有9分57秒去寻找他，目前完成0/20个，共连续完成34个。
          if (/扬州知府委托你追杀逃犯：(\S+)，据说最近在(\S+)-(\S+)出现过/.test(desc)) {
            this.ymTarget = RegExp.$1
            this.ymTargetX = RegExp.$2
            this.ymTargetY = RegExp.$3
          }
          break
        case 'yunbiao':
          // 你目前没有接受到委托，本周完成0/20个，共连续完成0个。
          desc.match(/本周完成(\d+)\/20个，共连续完成(\d+)个/)
          this.ybCount = Number(RegExp.$1) || 0
          this.ybTotal = Number(RegExp.$2) || 0
          break
        default:
          this.activity = { id, state, title, desc }
          if (state === 2) // 可领取
          break
      }
    })
  }
}

export default Task
