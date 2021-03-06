import { version } from "../package.json"
import { string } from "rollup-plugin-string"
import cleanup from "rollup-plugin-cleanup"
import clear from "rollup-plugin-clear"
import json from "@rollup/plugin-json"
// import vuePlugin from 'rollup-plugin-vue'

const tamperMonkeyMetaData = `// ==UserScript==
// @name         Valkyrie
// @namespace    coderzhaoziwei@outlook.com
// @version      ${ version }
// @author       Coder Zhao
// @homepage     https://greasyfork.org/scripts/422783
// @description  文字游戏《武神传说》的浏览器脚本程序 | 自动流程 | 界面优化
// @modified     ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString("en-DE")}
// @license      MIT
// @supportURL   https://github.com/coderzhaoziwei/ValkyrieWorker/issues
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/Valkyrie/source/image/wakuang.png
// @require      https://greasyfork.org/scripts/422999/code/Vue@3.js
// @require      https://cdn.jsdelivr.net/npm/element3@0.0.39/dist/element3-ui.global.min.js
// @require      https://cdn.jsdelivr.net/npm/gsap@3.6.0/dist/gsap.min.js
// @match        http://*.wsmud.com/*
// @exclude      http://*.wsmud.com/news*
// @exclude      http://*.wsmud.com/pay*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// ==/UserScript==

/* eslint-env es6 */
/* global Vue:readonly */
/* global Element3:readonly */
/* global gsap:readonly */
`

export default {
  input: `source/index.js`,
  output: {
    file: `bundle/valkyrie.user.js`,
    format: `iife`,
    banner: tamperMonkeyMetaData,
  },
  plugins: [
    cleanup({
      comments: `all`, // 保留全部的注释
    }), // 格式化代码
    json(),
    string({
      include: [
        `source/mixin/ValkyrieWorkerContent.js`, // Web Worker
        `source/html/*.html`,
        `bundle/style.min.css`,
      ], // 作为字符串导入
    }),
    clear({
      targets: [`bundle/style.min.js`], // 清理文件
    }),
    // vuePlugin(),
  ],
}
