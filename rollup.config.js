import { name, version, author } from './package.json'
import cleanup from 'rollup-plugin-cleanup'
import { string } from 'rollup-plugin-string'
import clear from 'rollup-plugin-clear'

const metadata = `// ==UserScript==
// @name         ${ name }
// @namespace    com.coderzhaoziwei.valkyrie
// @version      ${ version }
// @author       ${ author }
// @description  ValkyrieWorker
// @match        http://*.wsmud.com/*
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
    string({ include: '*/worker.js' }),
    /* 清理指定目录 */
    clear({ targets: ['bundle'] }),
  ],
}
