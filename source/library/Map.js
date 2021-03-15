class Map {
  constructor() {
    this.svg = ''
  }
  updateMap(items) {
    const position = { minX: 99999, minY: 99999, maxX: 0, maxY: 0 }
    items.forEach(item => {
      const [x, y] = item.p
      if (x < position.minX) position.minX = x
      if (x > position.maxX) position.maxX = x
      if (y < position.minY) position.minY = y
      if (y > position.maxY) position.maxY = y
    })
    const [offsetX, offsetY] = [0 - position.minX, 0 - position.minY]
    const [unitX, unitY, unitW, unitH] = [100, 50, 60, 20]

    const rects = []
    const lines = []
    const texts = []

    items.forEach(map => {
      const l = (map.p[0] + offsetX) * unitX + 20
      const t = (map.p[1] + offsetY) * unitY + 20
      const rect = `<rect x="${l}" y="${t}" fill="dimgrey" stroke-width="1" stroke="gray" width="${unitW}" height="${unitH}"></rect>`
      rects.push(rect)
      map.exits && map.exits.forEach(exit => {
        const regexp = /^([a-z]{1,2})(\d)?([d|l])?$/
        if (regexp.test(exit)) {
          const length = RegExp.$2 ? parseInt(RegExp.$2) : 1
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
          if (a) {
            const line = `<line stroke="gray"`
            + ` x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"`
            + `${RegExp.$3 ? ' stroke-dasharray="5,5"' : ''}`
            + ` stroke-width="${RegExp.$3 === 'l' ? 10 : 1}"`
            + `></line >`
            lines.push(line)
          }
        }
      })
      const text = `<text x="${l+30}" y="${t+14}" text-anchor="middle" style="font-size:12px;" fill="#232323">${map.n}</text>`
      texts.push(text)
    })

    const width = (position.maxX + offsetX + 1) * unitX
    const height = (position.maxY + offsetY + 1) * unitY
    this.svg = `<svg width="${width}" height="${height}">${rects.join('')}${lines.join('')}${texts.join('')}</svg>`
  }
}

export default Map
