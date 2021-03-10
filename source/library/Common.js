export const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)

export const getColorSortByName = function(name) {
  const index = [
    /* 0: 无法判断 */
    /^<(hiw|wht)>/i, /* 1: 白 */
    /^<hig>/i,       /* 2: 绿 */
    /^<hic>/i,       /* 3: 蓝 */
    /^<hiy>/i,       /* 4: 黄 */
    /^<hiz>/i,       /* 5: 紫 */
    /^<hio>/i,       /* 6: 橙 */
    /^<(hir|ord)>/i, /* 7: 红 */
  ].findIndex(regexp => regexp.test(name))
  if (index === -1 && /^<...>/i.test(name)) console.error(name)
  return index + 1
}
