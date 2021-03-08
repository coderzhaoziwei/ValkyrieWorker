import { name, version, author } from './package.json'
import { string } from 'rollup-plugin-string'
import cleanup from 'rollup-plugin-cleanup'
import clear from 'rollup-plugin-clear'

const metadata = `// ==UserScript==
// @name         ${ name }
// @namespace    https://greasyfork.org/scripts/422783-valkyrieworker
// @version      ${ version }
// @author       ${ author }
// @description  《武神传说》脚本程序的前置库
// @match        http://*.wsmud.com/*
// @modified     ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString('en-DE')}
// @license      MIT
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/ValkyrieWorker/source/image/wakuang.png
// @require      https://cdn.jsdelivr.net/gh/coderzhaoziwei/ValkyrieWorker/source/package/vue@3.0.7.global.js
// @require      https://cdn.jsdelivr.net/gh/coderzhaoziwei/ValkyrieWorker/source/package/element3@0.0.38.global.js
// @run-at       document-start
// @grant        unsafeWindow
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
    string({ include: '*/ValkyrieWorkerContent.js' }),
    /* 清理指定目录 */
    clear({ targets: ['bundle'] }),
  ],
}
