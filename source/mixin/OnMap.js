export default {
  data() {
    return {
      mapPath: ``,
      mapDataList: [],
      mapPosition: {},
      mapRectList: [],
      mapLineList: [],
      mapTextList: [],
    }
  },
  computed: {
    mapWidth() {
      const unitX = 100
      return (this.mapPosition.maxX + this.mapOffsetX + 1) * unitX
    },
    mapHeight() {
      const unitY = 50
      return (this.mapPosition.maxY + this.mapOffsetY + 1) * unitY
    },
    mapSVG() {
      const SVGList = []
      SVGList.push(`<svg`)
      SVGList.push(` viewBox="0,0,${this.mapWidth},${this.mapHeight}"`)
      SVGList.push(` preserveAspectRatio="xMidYMid meet">`)
      SVGList.push(this.mapRectList.join(``))
      SVGList.push(this.mapTextList.join(``))
      SVGList.push(this.mapLineList.join(``))
      SVGList.push(`</svg>`)
      return SVGList.join(``)
    },
    mapTitle() {
      return this.roomX
    },
    mapStyle() {
      return `max-width: ${this.mapWidth}px; max-height: ${this.mapHeight}px;`
    },
    mapWidthStyle() {
      return `${this.mapWidth}px`
    },
  },
  watch: {

  },
  methods: {
    updateMapDataList(datalist) {
      this.mapDataList = datalist
    },
    updateMapPosition() {
      this.mapPosition = { minX: 99999, minY: 99999, maxX: 0, maxY: 0 }
      this.mapDataList.forEach(data => {
        const [x, y] = data.p
        if (x < this.mapPosition.minX) this.mapPosition.minX = x
        if (x > this.mapPosition.maxX) this.mapPosition.maxX = x
        if (y < this.mapPosition.minY) this.mapPosition.minY = y
        if (y > this.mapPosition.maxY) this.mapPosition.maxY = y
      })
      // 偏移
      this.mapOffsetX = 0 - this.mapPosition.minX
      this.mapOffsetY = 0 - this.mapPosition.minY
    },
    updateMapSVG() {
      const [unitX, unitY, unitW, unitH] = [100, 50, 60, 20]
      this.mapRectList.splice(0)
      this.mapLineList.splice(0)
      this.mapTextList.splice(0)

      this.mapDataList.forEach(data => {
        const l = (data.p[0] + this.mapOffsetX) * unitX + 20
        const t = (data.p[1] + this.mapOffsetY) * unitY + 20
        // rect
        this.mapRectList.push(`<rect`)
        this.mapRectList.push(` x="${l}" y="${t}"`)
        this.mapRectList.push(` fill="dimgrey" stroke-width="1" stroke="gray"`)
        this.mapRectList.push(` width="${unitW}" height="${unitH}"`)
        this.mapRectList.push(`></rect>`)
        // text
        this.mapTextList.push(`<text`)
        this.mapTextList.push(` x="${l+30}" y="${t+14}"`)
        this.mapTextList.push(` text-anchor="middle" style="font-size: 12px;" fill="#232323"`)
        this.mapTextList.push(`>${data.n}</text>`)
        // line
        if ((data.exits instanceof Array) === false) return
        data.exits.forEach(exit => {
          const regexp = /^([a-z]{1,2})(\d)?([d|l])?$/
          if (regexp.test(exit)) {
            // 计算两个点的左边
            const points = {
              w: [
                [l - (unitX - unitW) - unitX * (length - 1), t + unitH / 2],
                [l, t + unitH / 2],
              ],
              e: [
                [l + unitW, t + unitH / 2],
                [l + unitX + unitX * (length - 1), t + unitH / 2],
              ],
              s: [
                [l + unitW / 2, t + unitH],
                [l + unitW / 2, t + unitY + unitY * (length - 1)],
              ],
              n: [
                [l + unitW / 2, t],
                [l + unitW / 2, t - (unitY - unitH) - unitY * (length - 1)],
              ],
              nw: [
                [l - length * unitX + unitW, t - length * unitY + unitH],
                [l, t],
              ],
              ne: [
                [l + unitW, t],
                [l + length * unitX, t - (unitY - unitH)],
              ],
              se: [
                [l + unitW, t + unitH],
                [l + length * unitX, t + length * unitY],
              ],
              sw: [
                [l, t + unitH],
                [l - (unitX - unitW) - unitX * (length - 1), t + length * unitY],
              ],
            }[RegExp.$1]
            const [a, b] = points
            if (a && b) {
              this.mapLineList.push(`<line`)
              this.mapLineList.push(` stroke="gray"`)
              this.mapLineList.push(` x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"`)
              if (RegExp.$3) {
                this.mapLineList.push(` stroke-dasharray="5,5"`)
              }
              if (RegExp.$3 === `l`) {
                this.mapLineList.push(` stroke-width="10"`)
              } else {
                this.mapLineList.push(` stroke-width="1"`)
              }
              this.mapLineList.push(`></line>`)
            }
          }
        })
      })
    },
  },
  mounted() {
    this.on(`map`, function(data) {
      if ((data.map instanceof Array) === false) return
      // 若区域改变 则更新数据
      if (data.path !== this.mapPath) {
        this.mapPath = data.path
        this.updateMapDataList(data.map)
        this.updateMapPosition()
        this.updateMapSVG()
      }
      // 屏蔽
      delete data.type
    })
  },
}
