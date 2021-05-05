export default {
  data() {
    return {
      smCount: 20,
      smTotal: 99,
      smTarget: ``,
      ymCount: 20,
      ymTotal: 99,
      ymTarget: ``,
      ymTargetX: ``,
      ymTargetY: ``,
      ybCount: 20,
      ybTotal: 99,
      fbCount: 20,
      wdCount: 99,
      wdTotal: 99,
      wdComplete: true,
      qaComplete: true,
      xyComplete: true,
      mpComplete: true,
    }
  },
  mounted() {
    this.on(`tasks`, function(data) {
      if ((data.items instanceof Array) === false) return
      this.smTarget = ``
      this.ymTarget = ``
      this.ymTargetX = ``
      this.ymTargetY = ``
      data.items.forEach(x => {
        const { id, state, title, desc } = x
        switch (id) {
          case `signin`:
            // 副本：<hik>0/20</hik>
            // 副本：<hig>20/20</hig>
            if (/副本：<[\S]{3}>(\d+)\/20<[\S]{4}>/.test(desc)) {
              this.fbCount = Number(RegExp.$1) || 0
            }
            // <hig>武道塔可以重置，进度20/29</hig>，
            // <nor>武道塔已重置，进度99/99</nor>，
            if (/武道塔([\S]{1,2})重置，进度(\d+)\/(\d+)/.test(desc)) {
              this.wdComplete = (RegExp.$1 === `已`)
              this.wdCount = Number(RegExp.$2) || 0
              this.wdTotal = Number(RegExp.$3) || 0
            }
            // <hig>还没有给首席请安</hig>
            // 本周尚未协助襄阳守城，尚未挑战门派BOSS，还可以挑战武神BOSS5次。
            this.qaComplete = (/还没有给首席请安/.test(desc) === false)
            this.xyComplete = (/本周尚未协助襄阳守城/.test(desc) === false)
            this.mpComplete = (/尚未挑战门派BOSS/.test(desc) === false)
            // 自动签到
            if (state === 2) {
              this.onText(`[ ${title} ]`, `him`)
              this.sendCommands(`taskover signin`)
            }
            break
          case `sm`:
            // 你的师门委托目前完成0/20个，共连续完成16个。
            if (/目前完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
              this.smCount = Number(RegExp.$1) || 0
              this.smTotal = Number(RegExp.$2) || 0
            }
            // 你的师门委托你去寻找<wht>当归</wht>，你可以慢慢寻找，没有时间限制，目前完成0/20个，共连续完成16个。
            if (/你的师门委托你去寻找(\S+)，你可以慢慢寻找/.test(desc)) {
              this.smTarget = RegExp.$1
            }
            break
          case `yamen`:
            // 扬州知府委托你追杀逃犯：目前完成0/20个，共连续完成34个。
            if (/目前完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
              this.ymCount = Number(RegExp.$1) || 0
              this.ymTotal = Number(RegExp.$2) || 0
            }
            // 扬州知府委托你追杀逃犯：司空荔蓓，据说最近在峨眉派-走廊出现过，你还有9分57秒去寻找他，目前完成0/20个，共连续完成34个。
            if (/扬州知府委托你追杀逃犯：(\S+)，据说最近在(\S+)-(\S+)出现过/.test(desc)) {
              this.ymTarget = RegExp.$1
              this.ymTargetX = RegExp.$2
              this.ymTargetY = RegExp.$3
            }
            break
          case `yunbiao`:
            // 你目前没有接受到委托，本周完成0/20个，共连续完成0个。
            if (/本周完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
              this.ybCount = Number(RegExp.$1) || 0
              this.ybTotal = Number(RegExp.$2) || 0
            }
            break
          default:
            if (state === 2) {
              this.onText(`任务[${title}]已经可以领取奖励。`, `him`)
              // 2021-05-01 ~ 2021-05-05 节日礼包
              if (id === `zz1` && title === `<hic>节日礼包</hic>` && desc === `节日快乐，你尚未领取节日礼包。`) {
                this.sendCommands(`taskover ${id}`)
              }
            }
            break
        }
      })
    })
  },
}
