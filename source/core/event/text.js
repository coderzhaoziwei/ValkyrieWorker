import Valkyrie from "../Valkyrie"

Valkyrie.on(`text`, function(data) {
  // <hig>你获得了5360点经验，200000点潜能，<wht>二十六两白银</wht><yel>八十个铜板</yel>。</hig>
  if (/你获得了(\d+)点经验，(\d+)点潜能/.test(data.text)) {
    this.score.exp += Number(RegExp.$1) || 0
    this.score.pot += Number(RegExp.$2) || 0
  }
  // 技能等级提升
  if (/^<hiy>你的[\s\S]+等级提升了！<\/hiy>$/.test(data.text)) {
    return delete data.type
  }
  // 获得经验潜能
  if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
    data.text = data.text.replace(/<\S+?>/g, ``)
    return
  }

})
