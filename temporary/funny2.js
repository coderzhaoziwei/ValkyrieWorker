const cmd = {
  '武当派': 'jh fam 1 start,go north,go south,go west,go west,go east,go northup,go north,go east,go west,go west,,go northup,go northup,go northup,go north,go north,go north,go north,go north,go north',
  '少林派': 'jh fam 2 start,go north,go west,go east,go east,go west,go north,go northup,go southdown,go northwest,go northeast,go southeast,go northwest,go north,go west,go east,go east,go west,go north,go west,go east,go east,go west,go north,go west,go east,go north,go north',
  '华山派': 'jh fam 3 start,go eastup,go southup,jumpdown,go southup,go south,go east,jh fam 3 start,go westup,go west,go east,go north,go east,go west,go north,go east,go west,go north,jh fam 3 start,go westup,go south,go southup,go southup,break bi,go enter,go westup,go westup,jumpup',
  '峨眉派': 'jh fam 4 start,go northup,go east,jh fam 4 start,go west,go south,go east,go south,go north,go east,go west,go west,go south,go north,go west,go north,go north,go south,go south,go west,go east,go south,go south',
  '逍遥派': 'jh fam 5 start,go north,go north,jh fam 5 start,go west,go south,jh fam 5 start,go south,go south,jh fam 5 start,go down,go down',
  '丐帮': 'jh fam 6 start,go down,go east,go east,go east,,go up,go down,go east,go east,go up',

  '无门无派首席': 'jh fam 0 start',


  '武当派广场': 'jh fam 1 start',
  '武当派三清殿': 'jh fam 1 start,go north',
  '武当派石阶': 'jh fam 1 start,go west',
  '武当派练功房': 'jh fam 1 start,go west,go west',
  '武当派太子岩': 'jh fam 1 start,go west,go northup',
  '武当派桃园小路': 'jh fam 1 start,go west,go northup,go north',
  '武当派舍身崖': 'jh fam 1 start,go west,go northup,go north,go east',
  '武当派南岩峰': 'jh fam 1 start,go west,go northup,go north,go west',
  '武当派乌鸦岭': 'jh fam 1 start,go west,go northup,go north,go west,go northup',
  '武当派五老峰': 'jh fam 1 start,go west,go northup,go north,go west,go northup,go northup',
  '武当派虎头岩': 'jh fam 1 start,go west,go northup,go north,go west,go northup,go northup,go northup',
  '武当派朝天宫': 'jh fam 1 start,go west,go northup,go north,go west,go northup,go northup,go northup,go north',
  '武当派三天门': 'jh fam 1 start,go west,go northup,go north,go west,go northup,go northup,go northup,go north,go north',
  '武当派紫金城': 'jh fam 1 start,go west,go northup,go north,go west,go northup,go northup,go northup,go north,go north,go north',
  '武当派林间小径': 'jh fam 1 start,go west,go northup,go north,go west,go northup,go northup,go northup,go north,go north,go north,go north,go north',
  '武当派后山小院': 'jh fam 1 start,go west,go northup,go north,go west,go northup,go northup,go northup,go north,go north,go north,go north,go north,go north',
  '少林派广场': 'jh fam 2 start',
  '少林派山门殿': 'jh fam 2 start,go north',
  '少林派东侧殿': 'jh fam 2 start,go north,go east',
  '少林派西侧殿': 'jh fam 2 start,go north,go west',
  '少林派天王殿': 'jh fam 2 start,go north,go north',
  '少林派大雄宝殿': 'jh fam 2 start,go north,go north,go northup',
  '少林派钟楼': 'jh fam 2 start,go north,go north,go northeast',
  '少林派鼓楼': 'jh fam 2 start,go north,go north,go northwest',
  '少林派后殿': 'jh fam 2 start,go north,go north,go northwest,go northeast',
  '少林派练武场': 'jh fam 2 start,go north,go north,go northwest,go northeast,go north',
  '少林派罗汉堂': 'jh fam 2 start,go north,go north,go northwest,go northeast,go north,go east',
  '少林派般若堂': 'jh fam 2 start,go north,go north,go northwest,go northeast,go north,go west',
  '少林派方丈楼': 'jh fam 2 start,go north,go north,go northwest,go northeast,go north,go north',
  '少林派戒律院': 'jh fam 2 start,go north,go north,go northwest,go northeast,go north,go north,go east',
  '少林派达摩院': 'jh fam 2 start,go north,go north,go northwest,go northeast,go north,go north,go west',
  '少林派竹林': 'jh fam 2 start,go north,go north,go northwest,go northeast,go north,go north,go north',
  '少林派藏经阁': 'jh fam 2 start,go north,go north,go northwest,go northeast,go north,go north,go north,go west',
  '少林派达摩洞': 'jh fam 2 start,go north,go north,go northwest,go northeast,go north,go north,go north,go north,go north',
  '华山派镇岳宫': 'jh fam 3 start',
  '华山派苍龙岭': 'jh fam 3 start,go eastup',
  '华山派舍身崖': 'jh fam 3 start,go eastup,go southup',
  '华山派峭壁': 'jh fam 3 start,go eastup,go southup,jumpdown',
  '华山派山谷': 'jh fam 3 start,go eastup,go southup,jumpdown,go southup',
  '华山派山间平地': 'jh fam 3 start,go eastup,go southup,jumpdown,go southup,go south',
  '华山派林间小屋': 'jh fam 3 start,go eastup,go southup,jumpdown,go southup,go south,go east',
  '华山派玉女峰': 'jh fam 3 start,go westup',
  '华山派玉女祠': 'jh fam 3 start,go westup,go west',
  '华山派练武场': 'jh fam 3 start,go westup,go north',
  '华山派练功房': 'jh fam 3 start,go westup,go north,go east',
  '华山派客厅': 'jh fam 3 start,go westup,go north,go north',
  '华山派偏厅': 'jh fam 3 start,go westup,go north,go north,go east',
  '华山派寝室': 'jh fam 3 start,go westup,go north,go north,go north',
  '华山派玉女峰山路': 'jh fam 3 start,go westup,go south',
  '华山派玉女峰小径': 'jh fam 3 start,go westup,go south,go southup',
  '华山派思过崖': 'jh fam 3 start,go westup,go south,go southup,go southup',
  '华山派山洞': 'jh fam 3 start,go westup,go south,go southup,go southup,break bi,go enter',
  '华山派长空栈道': 'jh fam 3 start,go westup,go south,go southup,go southup,break bi,go enter,go westup',
  '华山派落雁峰': 'jh fam 3 start,go westup,go south,go southup,go southup,break bi,go enter,go westup,go westup',
  '华山派华山绝顶': 'jh fam 3 start,go westup,go south,go southup,go southup,break bi,go enter,go westup,go westup,jumpup',

  '峨眉派金顶': 'jh fam 4 start',
  '峨眉派庙门': 'jh fam 4 start,go west',
  '峨眉派广场': 'jh fam 4 start,go west,go south',
  '峨眉派走廊': 'jh fam 4 start,go west,go south,go west',
  '峨眉派休息室': 'jh fam 4 start,go west,go south,go east,go south',
  '峨眉派厨房': 'jh fam 4 start,go west,go south,go east,go east',
  '峨眉派练功房': 'jh fam 4 start,go west,go south,go west,go west',
  '峨眉派小屋': 'jh fam 4 start,go west,go south,go west,go north,go north',
  '峨眉派清修洞': 'jh fam 4 start,go west,go south,go west,go south,go south',
  '峨眉派大殿': 'jh fam 4 start,go west,go south,go south',
  '峨眉派睹光台': 'jh fam 4 start,go northup',
  '峨眉派华藏庵': 'jh fam 4 start,go northup,go east',

  '逍遥派青草坪': 'jh fam 5 start',
  '逍遥派林间小道': 'jh fam 5 start,go east',
  '逍遥派练功房': 'jh fam 5 start,go east,go north',
  '逍遥派木板路': 'jh fam 5 start,go east,go south',
  '逍遥派工匠屋': 'jh fam 5 start,go east,go south,go south',
  '逍遥派休息室': 'jh fam 5 start,go west,go south',
  '逍遥派木屋': 'jh fam 5 start,go north,go north',
  '逍遥派地下石室': 'jh fam 5 start,go down,go down',

  '丐帮树洞内部': 'jh fam 6 start',
  '丐帮树洞下': 'jh fam 6 start,go down',
  // 丐帮暗道 4个
  '丐帮暗道': 'jh fam 6 start,go down,go east,go east,go east,go east,go east',
  '丐帮破庙密室': 'jh fam 6 start,go down,go east,go east,go east',
  '丐帮土地庙': 'jh fam 6 start,go down,go east,go east,go east,go up',
  '丐帮林间小屋': 'jh fam 6 start,go down,go east,go east,go east,go east,go east,go up',
}

const funny = new Vue({

  methods: {
    getDateNumber() {
      // 前移 5 小时
      return new Date(Date.now() - 5*60*60*1000).getDate()
    },
    resolveCommand(cmd) {
      if (/{npc:(\S+)}/.test(cmd)) {
        const npc = this.roomNpcs.find(npc => npc.name.includes(RegExp.$1))
        return this.resolveCommand(cmd.replace(`{npc:${ RegExp.$1 }}`, npc ? npc.id : 'UnknownID'))
      } else if (/{item:(\S+)}/.test(cmd)) {
        const item = this.packs.find(item => item.name.includes(RegExp.$1))
        return this.resolveCommand(cmd.replace(`{item:${ RegExp.$1 }}`, item ? item.id : 'UnknownID'))
      } else {
        return cmd
      }
    },
    getTimeString(format) {
      const time = new Date()
      const numberToString = n => ('0' + String(n)).slice(-2)
      format = format.replace('YYYY', numberToString(time.getFullYear()))
      format = format.replace('MM', numberToString(time.getMonth() + 1))
      format = format.replace('DD', numberToString(time.getDate()))
      format = format.replace('hh', numberToString(time.getHours()))
      format = format.replace('mm', numberToString(time.getMinutes()))
      format = format.replace('ss', numberToString(time.getSeconds()))
      return format
    },


    performInc(index) {
      this.performs[index].sort ++
      this.setValue(`Sort${ this.performs[index].id }`, this.performs[index].sort)
    },
    performDec(index) {
      this.performs[index].sort --
      this.setValue(`Sort${ this.performs[index].id }`, this.performs[index].sort)
    },
    performRefresh() {
      this.performs.sort((a, b) => a.sort - b.sort)
      this.onData({ type: 'perform', skills: this.performs })
    },
    performAuto(index, value) {
      this.performs[index].auto = value
      this.setValue(`Auto${ this.performs[index].id }`, value)
    },
    performAllOn() {
      this.performs.forEach(pfm => pfm.auto = true)
    },
    performAllOff() {
      this.performs.forEach(pfm => pfm.auto = false)
    },
    performCopy() {
      const list = []
      this.performs.forEach(pfm => {
        if (pfm.auto) list.push(pfm.id)
      })
      this.copy(list.join(','))
    },

    onTaskCure(fn) {
      this.addMonitor('Cure', 'sc', data => {
        if (this.id === data.id && (this.mpPer >= this.CureMp || this.hpPer >= this.CureHp)) {
          this.removeMonitor('Cure')
          this.send(256, () => this.onTaskCure(fn))
        }
        return data
      })

      if (this.mpPer < this.CureMp && this.state !== '打坐') {
        this.send('stopstate')
        if (this.roomY !== '武庙') {
          this.send('jh fam 0 start,go north,go north,go west')
        }
        this.send('dazuo')
        // this.onData(`<hic>【当前状态】HP:${ this.hpPer }% MP:${ this.mpPer }%</hic>`)
      } else if (this.hpPer < this.CureHp && this.state !== '疗伤') {
        this.send('stopstate')
        if (this.roomY !== '武庙') {
          this.send('jh fam 0 start,go north,go north,go west')
        }
        this.send('liaoshang')
        // this.onData(`<hic>【当前状态】HP:${ this.hpPer }% MP:${ this.mpPer }%</hic>`)
      } else {
        this.removeMonitor('Cure')
        this.send('stopstate', () => fn())
      }
    },

    onTaskOver() {
      if (this.state) return
      if (/^<...>武[帝神]{1}<....>$/.test(this.level)) {
        this.send('jh fam 0 start,go west,go west,go north,go enter,go west,xiulian')
      } else {
        this.send('wakuang')
      }
    },
    onTaskSuiCong() {
      let count = 0
      let work = {}
      this.send('stopstate,jh fam 0 start,go west,go west,go north,go enter,1000')
      this.send(() => {
        this.roomNpcs.forEach(npc => this.send(`team with ${ npc.id }`))
        this.addMonitor('ScPack', 'pack2', data => {
          data.items.forEach(item => {
            const regexp = /鲤鱼|草鱼|鲢鱼|鲮鱼|鳊鱼|鲂鱼|黄金鳉|黄颡鱼|太湖银鱼|虹鳟|孔雀鱼|反天刀|银龙鱼|黑龙鱼|罗汉鱼|巨骨舌鱼|七星刀鱼|帝王老虎魟|当归|芦荟|山楂叶|柴胡|金银花|石楠叶|茯苓|沉香|熟地黄|九香虫|络石藤|冬虫夏草|人参|何首乌|凌霄花|灵芝|天仙藤|盘龙参/
            if (regexp.test(item.name)) {
              // dc t6ch3b8ea24 give 8m3c3b8cfc0 568 1xau4269c7a
              this.send(`dc ${ data.id } give ${ this.id } ${ item.count } ${ item.id }`)
            }
          })
          this.send(`dc ${ data.id } ${ work[data.id] }`)
          count --
          if (count === 0) {
            this.removeMonitor('ScPack')
            this.send(() => this.onData('<hig>随从任务已完成。</hig>'))
          }
          return data
        })
        this.send(`go northeast,pack,team out ${ this.id },1000`, () => {
          const list = []
          this.roomNpcs.forEach(npc => {
            work[npc.id] = npc.name.includes('钓鱼') ? 'diao' : 'cai'
            list.push(`dc ${ npc.id } stopstate,pack ${ npc.id }`)
          })
          count = list.length
          this.send(list.join(','))
        })
      })
    },
    onHuaShanHong() {
      let completed = false

      this.addMonitor('HuaShanHongAdd', 'itemadd', data => {
        if (data.name.includes('独孤')) {
          this.send(`kill ${ data.id }`)
        }
        return data
      })
      this.addMonitor('HuaShanHongDie', 'die', data => {
        if (completed) {
          this.send('relive,jh fam 3 start,go westup,go north,go north')
          this.removeMonitor('HuaShanHongAdd')
          this.removeMonitor('HuaShanHongDie')
        } else if (!data.relive) {
          this.send('relive,2000,jh fam 3 start,go westup,go north,go north,500,kill {npc:独孤}')
        }
        return data
      })

      this.addMonitor('HuaShanHongOver', 'text', data => {
        // 你从独孤败天的尸体里拿出来一块<ord>神魂碎片</ord>。
        if (/^你从独孤败天的尸体里拿出来一块<ord>神魂碎片<\/ord>。$/.test(data.text)) {
          this.state = ''
          if (/^<...>武[帝神]{1}<....>$/.test(this.level)) {
            this.send('jh fam 0 start,go west,go west,go north,go enter,go west,xiulian')
          } else {
            this.send('wakuang')
          }
        }
        return data
      })

      this.performs.forEach(pfm => pfm.auto = false)
      this.send('setting auto_pfm force.cui')
      this.send('stopstate,jh fam 3 start,go westup,go north,go north')
    },

    goAlchemyRoomOfParty() {
      this.send('stopstate,jh fam 0 start,go south,go south,go east,go east,go east,go south')
      this.send('lianyao')
    },
    joinPartyWithName() {
      const name = prompt('请输入你要加入的帮派名称：', '')
      if (name) {
        this.send('stopstate,jh fam 0 start,go south,go south,go east')
        this.send(`party join ${ name } ok`)
      }
    },
  },
})

// greet master 自动请安师傅

addMonitor('FightState', 'combat', function(data) {
  if (data.start === 1) {
    this.state = '战斗'
    if (this.fightTimer) clearInterval(this.fightTimer)
    this.fightTimer = setInterval(() => {
      const now = Date.now()
      this.performs.find(pfm => {
        if (pfm.auto && (pfm.time < now)) {
          this.send(`perform ${pfm.id}`)
          return true
        }
      })
    }, 256)
  } else if (data.end === 1) {
    this.state = ''
    clearInterval(this.fightTimer)
  }
  return data
})
addMonitor('DieState', 'die', function(data) {
  if (data.relive) {
    this.state = ''
  } else {
    this.state = '死亡'
    // 自动武庙复活
    if (this.CanReliveWuMiao && !this.roomName.includes('副本')) {
      this.send('relive')
    }
  }
  return data
})

addMonitor('RoomInfo', 'room', function(data) {
  this.roomName = data.name
  this.roomPath = data.path

  // console.log(`Room: ${ this.roomX } ${ this.roomY } [${ this.roomPath }]`)

  if (/cmd/.test(data.desc)) {
    // 统一使用双引号
    data.desc = data.desc.replace(/'/g, '"')
    // 去除英文括号和里面的英文单词
    data.desc = data.desc.replace(/\([A-Za-z]+?\)/g, '')
    // 新手教程中的椅子
    data.desc = data.desc.replace('<hig>椅子</hig>', '椅子')
    // 兵营副本中的门
    data.desc = data.desc.replace(`<CMD cmd='look men'>门(men)<CMD>`, `<cmd cmd='look men'>门</cmd>`);
    // 古墓副本中的画和古琴
    data.desc = data.desc.replace(/span/g, 'cmd')

    console.log(data.desc)
    const htmls = data.desc.match(/<cmd cmd="[^"]+?">[^<]+?<\/cmd>/g)
    htmls.forEach(html => {
      if (/<cmd cmd="([^"]+?)">([^<]+?)<\/cmd>/.test(html)) {
        data.commands.unshift({ cmd: RegExp.$1, name: `<hic>${ RegExp.$2 }</hic>` })
      }
    })
  }
  this.roomDesc = data.desc

  data.revised = true
  return data
})

addMonitor('JY/QN/MP', 'text', function(data) {
  console.log(data.text)

  if (/^<hig>你的最大内力增加了(\d+)点。<\/hig>$/.test(data.text)) {
    // <hig>你的最大内力增加了18点。</hig>
    const time = (this.mpLimit - this.mpMax) / (RegExp.$1 * 6) // minutes
    const timeString = time <  60 ? `${ parseInt(time) }分钟` : `${ parseInt(time / 60) }小时${ parseInt(time % 60) }分钟`
    this.onData(`你的最大内力从${ this.mpMax }提高到${ this.mpLimit }还需${ timeString }。`)
    data.abandoned = true
  } else if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
    // <hig>你获得了60点经验，60点潜能。</hig>
    this.onData(`你获得了${ RegExp.$1 }点经验，${ RegExp.$2 }点潜能。`)
    this.jy += RegExp.$1
    this.qn += RegExp.$2
    data.abandoned = true
  } else if (/^<hiy>你的(\S+)等级提升了！<\/hiy>$/.test(data.text)) {
    // <hiy>你的<wht>基本杖法</wht>等级提升了！</hiy>
    data.abandoned = true
  } else if (/^(你将手上的药材分门别类，按照次序一个个丢进炼药炉。|<hig>你催动内力，小心翼翼的将炼药炉里的药材炼化。<\/hig>|<hic>药炉里的药材慢慢融化，聚在一起。<\/hic>|<hic>你继续催动内力，专心致志地控制着火候。<\/hic>|<hic>药炉里的药材慢慢融化，聚在一起。<\/hic>|<hiy>药炉里的丹药渐渐凝聚，加油，就差一步就成丹了。<\/hiy>)$/.test(data.text)){
    data.abandoned = true
  } else if (/<hig>恭喜你领悟到武道秘技：【(\S+)】。<\/hig>/.test(data.text)) {
    // <hig>恭喜你领悟到武道秘技：【防守之道】。</hig>
    document.getElementById('beep').play()
  }
  return data
})


addMonitor('SkillInfo', 'skills', function(data) {
  if (data.items) {
    // 技能列表
    this.qn = data.pot
    this.skillLimit = data.limit
    this.skills.splice(0)

    data.items.forEach(item => this.skills.push(new Skill(item)))
    this.skills.sort((a, b) => a.sort - b.sort)

    data.items = this.skills
    data.revised = true
  } else if (data.item) {
    // 学会新技能
    const skill = new Skill(data.item)
    this.skills.push(skill)
  } else if (data.enable) {
    // 装备技能
    const skill = this.skills.find(skill => skill.id === data.id)
    if (skill) {
      skill.enable_skill = data.enable
    }
  } else if (data.hasOwnProperty('exp')) {
    // 单个技能经验变动
    const skill = this.skills.find(skill => skill.id === data.id)
    if (!skill) {
      return
    } else if (data.level) {
      skill.level = parseInt(data.level)
      this.onData(`你的技能${ skill.name }提升到了<hiw>${ skill.level }</hiw>级！`)
    }
    skill.exp = data.exp

    const k = skill.color * 2.5 // 系数 白=2.5 橙=15 红=17.5
    const qn = (Math.pow(this.skillLimit, 2) - Math.pow(skill.level, 2)) * k // 需要的总潜能

    if (this.state === '练习') {
      // 练习每一跳的消耗公式＝（先天悟性＋后天悟性）×（1＋练习效率%－先天悟性%）
      const cost = (this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100)

      const time = qn / cost / (60 / 5) // 需要的总时间
      const timeString = time < 60 ? `${parseInt( time )}分钟` : `${ parseInt(time / 60) }小时${ parseInt(time % 60) }分钟`

      this.onData(`你练习${ skill.name }消耗了${ parseInt(cost) }点潜能。${ skill.exp }%`)
      // 还需要${ timeString }消耗${ qn }点潜能到${ this.skillLimit }级。
    } else if (this.state === '学习') {
      // 学习每一跳的消耗公式＝（先天悟性＋后天悟性）×（1＋学习效率%－先天悟性%）× 3
      const cost = (this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3
      this.onData(`你学习${ skill.name }消耗了${ parseInt(cost) }点潜能。${ skill.exp }%`)
    } else if (this.state === '炼药') {
      this.onData(`你获得了炼药经验，${ skill.name }当前<hiw>${ skill.level }</hiw>级。${ skill.exp }%`)
    }
  }
  return data
})

addMonitor('PerformList', 'perform', function(data) {
  if (!data.skills) return
  this.performs.splice(0)
  data.skills.forEach((pfm, index) => {
    const time = 0
    const sort = this.getValue(`Sort${ pfm.id }`) || (index + 1)
    const auto = this.getValue(`Auto${ pfm.id }`) || false
    this.performs.push({
      id: pfm.id, name: pfm.name,
      cd: pfm.distime, time, sort, auto,
    })
  })
  this.performs.sort((a, b) => a.sort - b.sort)
  data.skills = this.performs
  data.revised = true
  console.log(this.performs)
  return data
})
addMonitor('PerformTime', 'dispfm', function(data) {
  this.performs.forEach(pfm =>  {
    if (pfm.id === data.id) {
      pfm.cd = data.distime
      pfm.time = Date.now() + data.distime
    }
    if (data.rtime) {
      const time = Date.now() + data.rtime
      pfm.time = (time > pfm.time) ? time : pfm.time
    }
  })
  return data
})

addMonitor('DamageAttackingBoss', 'sc', function(data) {
  // {type: "sc", id: "sh9r6513b31", hp: 16921955, damage: 795172}
  if (data.damage && data.id && data.hp) {
    console.log(data)

    const id = data.id
    const npc = this.roomNpcs.find(npc => npc.id === id)

    let per = 0
    if (npc && data.damage === -1) {
      per = Math.floor((npc.max_hp - data.hp) / npc.max_hp * 1000) / 10
    } else if (npc) {
      per = Math.floor(data.damage / npc.max_hp * 1000) / 10
    }
    console.log(data)

    this.damage[id] = this.damage[id] || {temp: 0, value: 0}
    const temp = this.damage[id].temp
    if (per - temp > 3 || (temp < 10 && per >= 10)) {
      this.damage[id].temp = per
      this.send(`pty [${ per }%]${ npc.name.replace(/<\S+?>| /ig, '') }`)
    }
    if (per >= 10) {
      completed = true
    }
    this.damage[id].value = per
  }
  return data
})

addMonitor('clearDistime', 'clearDistime', function(data) {
  this.performs.forEach(pfm => pfm.time = 0)
  return data
})
// perform force.busi
addMonitor('status', 'status', function(data) {
  if (data.id === this.id && data.action === 'remove') {
    if (data.sid === 'hundun') this.send('perform force.busi')
    if (data.sid === 'weapon') this.send('perform blade.shi')
    if (data.sid === 'wangu') this.send('perform parry.wan')
    // force.busi,blade.shi,parry.wan
  }
  return data
})

$(document).ready(function() {
  $('<audio id="beep" preload="auto"></audio>').append('<source src="http://47.102.126.255/src/beep.mp3">').appendTo('body')
})

$(document).ready(function() {
  // 样式优化
  GM_addStyle(`.mypanel .content { background-color: #222222; }`)
  GM_addStyle(`.dialog-skills > .skill-item>.skill-level { font-family: monospace; }`)
  GM_addStyle(`.content-message { padding-right: 3.5em; word-break: break-all; }`)
  GM_addStyle(`.room-commands > .act-item { min-width: 1em; margin: 0 0 0 0.4em; }`)
  // .unselectable 文本不可被选中
  $('.content-bottom, .tool-bar').addClass('unselectable')
  GM_addStyle(`.unselectable { -webkit-user-select: none; -moz-user-select: none;  -ms-user-select: none; user-select: none; }`)

})

`<span class="funny-button" @click="onHuaShanHong()">反伤独孤求败</span>`
`<span class="funny-button" @click="joinPartyWithName()">加入帮派</span>`

// CDN jsdelivr
// https://cdn.jsdelivr.net/gh/username/repository@version/file
// https://cdn.jsdelivr.net/gh/emeisuqing/emeisuqing.github.io



// if (/你从武道秘籍中领悟到了/.test(message.text)) {
// Beep();//武道书读完的提示音
// }

// const a = (function (event, message) {
//   function autoUse(item) {
//     if (/养精丹|朱果|潜灵果|背包扩充石|随从礼包/.test(item.name)) {
//       let cmd = ["stopstate"];
//       let count = item.count;
//       let zl = "use";
//       if (/<hig>养精丹<\/hig>/.test(item.name)) count = count > 10 ? 10 : count;
//       if (/小箱子|师门补给包|随从礼包/.test(item.name)) zl = "open";
//       for (let i = 0; i < count; i++) {
//         cmd.push(zl + " " + item.id);
//         cmd.push(250);
//       }
//       AddContent(
//         $(`<span class="span-btn">使用 ${item.name} ${count}次</span>`).click(() => SendCommand(cmd)),
//   if (message.type === "pack") {
//     if (message.remove) { //失去物品
//       let id = message.id;
//       let item = pack.items.find(item => {
//         return item.id === id;
//       });
//       if (item) item.count -= message.remove;
//     }
//     if (!isMoblie && message.name && !message.name.includes("<wht>")) {//获得物品
//       let id = message.id;
//       let add = 0;
//       let count = message.count;
//       let item = pack.items.find(item => {
//         return item.id === id;
//       });
//       if (item) {
//         if (pack[id]) {
//           add = count - item.count + pack[id];
//           item.count = count;
//           pack[id] = add;
//         } else add = count - item.count;
//       } else {
//         add = count;
//         pack[id] = add;
//         pack.items.push(message);
//       }
//       let str = `共有${count}${message.unit}`;
//       if (message.can_eq === 1) str = "";
//       $(`.remove_${message.id}`).remove();
//       $(".content-pickup").append(
//         $(`<div class="remove_${message.id} pickup-row"></div>`).append(
//           $(`<span class="pickup-add"></span>`).append(`获得${add}${message.unit}${message.name}`),
//           $(`<span class="pickup-count"></span>`).append(str),
//         )
//       );
//       AutoScroll(".content-pickup");
//       autoUse(message);
//   return true;
// }); // pack
