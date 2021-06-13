// environment: [`production`, `development`][0],
// <link type="image/x-icon" rel="shortcut icon" href="http://47.102.126.255/wushen.ico">

GM_registerMenuCommand('GreasyFork Index', function() {
  window.open('https://greasyfork.org/scripts/422519')
})
GM_registerMenuCommand('Github Repo', function() {
  window.open('https://github.com/coderzhaoziwei/legend-of-valkyrie')
})
GM_setClipboard(data, `text`)
