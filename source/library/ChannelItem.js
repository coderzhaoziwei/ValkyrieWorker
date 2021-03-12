class ChannelItem {
  constructor(data) {
    this.id = data.uid || ''
    this.channel = data.ch
    this.content = data.content.trim().replace(/\n/g, '<br>')
    this.name = data.name || ''
    this.time = new Date()

    this.level = data.lv || 0
    this.family = data.fam || ''
    this.server = data.server || ''
  }
  get isSelf() { return this.id === unsafeWindow.ID}

  get isTm() { return this.channel === 'tm'    }
  get isEs() { return this.channel === 'es'    }
  get isFa() { return this.channel === 'fam'   }
  get isSy() { return this.channel === 'sys'   }
  get isPt() { return this.channel === 'pty'   }
  get isCh() { return this.channel === 'chat'  }
  get isRu() { return this.channel === 'rumor' }

  get cmd() { return `look3 ${this.id}` }

  get tag() {
    if (this.isTm) return `hig`
    if (this.isEs) return `hio`
    if (this.isFa) return `hiy`
    if (this.isSy) return `hir`
    if (this.isPt) return `hiz`
    if (this.isRu) return `him`
    if (this.isCh) return [0, 0, 0, `hiy`, `hiz`, `hio`, `hir`][this.level] || `hic`
    return `hiy`
  }
  get titleText() {
    if (this.isTm) return `队伍`
    if (this.isPt) return `帮派`
    if (this.isRu) return `谣言`
    if (this.isSy) return `系统`
    if (this.isFa) return `${this.family}`
    if (this.isEs) return `${this.server}`
    if (this.isCh) return [`百姓`, `武士`, `武师`, `宗师`, `武圣`, `武帝`, `武神`][this.level] || `闲聊`
    return `脚本`
  }
  get timeText() {
    return new Date(this.time).toLocaleTimeString('en-DE')
  }
}

export default ChannelItem
