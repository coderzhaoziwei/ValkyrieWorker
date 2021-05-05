export default {
  mounted() {
    this.on(`text`, function(data) {
      // 获得经验潜能 更新数值
      if (/你获得了(\d+)点经验，(\d+)点潜能/.test(data.text)) {
        this.score.exp += Number(RegExp.$1) || 0
        this.score.pot += Number(RegExp.$2) || 0
      }
      // 技能等级提升
      if (/^<hiy>你的[\s\S]+等级提升了！<\/hiy>$/.test(data.text)) {
        delete data.type
      }
      // 获得经验潜能 删除标签
      if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
        data.text = data.text.replace(/<\S+?>/g, ``)
      }
    })
  },
}
