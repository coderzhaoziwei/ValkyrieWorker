import { name, version, author } from './package.json'
import { string } from 'rollup-plugin-string'
import cleanup from 'rollup-plugin-cleanup'
import clear from 'rollup-plugin-clear'

const metadata = `// ==UserScript==
// @name         ${ name }
// @namespace    https://greasyfork.org/scripts/422783-valkyrieworker
// @version      ${ version }
// @author       ${ author }
// @description  文字游戏《武神传说》的浏览器脚本程序的基础库
// @modified     ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString('en-DE')}
// @license      MIT
// @supportURL   https://github.com/coderzhaoziwei/ValkyrieWorker/issues
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/ValkyrieWorker/source/image/wakuang.png
// @require      https://greasyfork.org/scripts/422999/code/Vue@3.js?version=909260
// @require      https://cdn.jsdelivr.net/npm/element3@0.0.39/dist/element3-ui.global.min.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.6.0/dist/gsap.min.js
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// ==/UserScript==
`

export default {
  input: 'source/index.js',
  output: {
    file: 'bundle/ValkyrieWorker.user.js',
    format: 'iife',
    banner: metadata,
  },
  plugins: [
    /* 清理输出代码 */
    cleanup(),
    /* 导入为字符串 */
    string({ include: 'source/library/ValkyrieWorkerContent.js' }),
    /* 清理指定目录 */
    clear({ targets: ['bundle'] }),
  ],
}
