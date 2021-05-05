// ==UserScript==
// @name         Valkyrie
// @namespace    https://greasyfork.org/scripts/422783
// @homepage     https://greasyfork.org/scripts/422783
// @version      1.2.176
// @description  文字游戏《武神传说》的浏览器脚本程序
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @modified     2021/5/5 22:36:08
// @license      MIT
// @supportURL   https://github.com/coderzhaoziwei/ValkyrieWorker/issues
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/Valkyrie/source/image/wakuang.png
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

/* eslint-env es6 */
/* global Vue:readonly */
/* global Element3:readonly */
/* global gsap:readonly */

(function () {
  'use strict';

  class Emitter {
    constructor() {
      this.id = 0; // 累计 +1
      this.types = {}; // { type1: [id1, id2, ...], ... }
      this.handlers = {}; // { id1: { id1, type1, handler1 }, ... }
    }
    on(type, handler) {
      const id = ++ this.id;
      if ((this.types[type] instanceof Array) === false) this.types[type] = [];
      this.types[type].push(id);
      this.handlers[id] = { id, type, handler };
      // 返回一个注销自身的方法
      const off = () => this.off(id);
      return off
    }
    off(id) {
      const handler = this.handlers[id];
      delete this.handlers[id];
      const type = handler.type;
      const index = this.types[type].findIndex(item => item === id);
      delete this.types[type][index];
    }
    emit(type, data) {
      const ids = this.types[type];
      // 检查
      if ((ids instanceof Array) === false || ids.length === 0) return
      // 遍历
      ids.forEach(id => {
        if (id === undefined) return
        const off = () => this.off(id); // 注销
        const { handler } = this.handlers[id];
        if (typeof handler === `function`) handler(data, off); // 第二个参数为注销自身的方法
      });
    }
  }

  var ValkyrieWorkerContent = "// 此文件为 Worker 线程中执行的代码\nclass Worker {\n  constructor() {\n    this.websocket = undefined\n    this.commands = []\n    this.senderState = false\n  }\n  // 发送事件至主线程\n  post(type, ...args) {\n    postMessage({ type, args })\n  }\n  // 创建 WebSocket 对象\n  create(uri) {\n    this.websocket = new WebSocket(uri)\n    this.websocket.onopen = () => {\n      this.post(`readyState`, this.websocket.readyState)\n      console.log(`WebSocket.readyState: ${this.websocket.readyState}`)\n      this.post(`onopen`)\n      console.log(`WebSocket.onopen`)\n    }\n    this.websocket.onclose = () => {\n      this.post(`readyState`, this.websocket.readyState)\n      console.log(`WebSocket.readyState: ${this.websocket.readyState}`)\n      this.post(`onclose`)\n      console.log(`WebSocket.onclose`)\n    }\n    this.websocket.onerror = () =>  {\n      this.post(`readyState`, this.websocket.readyState)\n      console.log(`WebSocket.readyState: ${this.websocket.readyState}`)\n      this.post(`onerror`)\n      console.log(`WebSocket.onerror`)\n    }\n    this.websocket.onmessage = event => {\n      this.post(`onmessage`, { data: event.data })\n    }\n  }\n  // 发送单个指令\n  sendCommand(command) {\n    this.websocket.send(command)\n  }\n  // 发送指令队列\n  sendCommands(...args) {\n    args = args.flat(Infinity)\n    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(`,`)))\n    args = args.flat(Infinity)\n    this.commands.push(...args)\n    if (this.senderState === false) {\n      this.senderState = true\n      this.sender()\n    }\n  }\n  // 停止指令队列\n  stopCommands() {\n    this.commands.splice(0)\n    this.senderState = false\n  }\n  // 循环指令队列\n  sender(ms = 256) {\n    const command = this.commands.splice(0, 1)[0] // 取首位\n    // 1. undefined\n    if (command === undefined) return (this.senderState = false)\n    // 2. number\n    const number = Number(command)\n    if (isNaN(number) === false) return this.sender(number)\n    // 3. string && custom-command\n    if (typeof command === `string` && command.includes(`{`) && command.includes(`}`)) {\n      return setTimeout(() => {\n        const data = JSON.stringify({ type: `custom-command`, command })\n        postMessage({ type: `websocketOnmessage`, args: [{ data }] })\n        this.sender()\n      }, ms)\n    }\n    // 4. string\n    if (typeof command === `string`) {\n      setTimeout(() => {\n        this.sendCommand(command)\n        this.sender()\n      }, ms)\n    }\n  }\n}\nconst worker = new Worker()\n// 接收主线程事件\nonmessage = function(event) {\n  const type = event.data.type\n  const args = event.data.args\n  try {\n    worker[type](...args)\n  } catch (error) {\n    console.error(error)\n  }\n}\n";

  function eventToData(event) {
    const data = event.data;
    if (typeof data === `string` && data[0] === `{`) {
      try { return new Function(`return ${ data };`)() } catch (error) {}
    }
    return { type: `text`, text: data }
  }
  function dataToEvent(data) {
    if (data.type === `text`) return { data: data.text }
    return { data: JSON.stringify(data) }
  }
  // String => Blob
  const WebWorkerContentBlob = new Blob([ValkyrieWorkerContent]);
  // Blob => URL
  const WebWorkerContentURL = URL.createObjectURL(WebWorkerContentBlob);
  // 子线程 Worker 对象
  const ValkyrieWebWorker = new Worker(WebWorkerContentURL);
  // 伪 WebSocket 中间件
  const ValkyrieWebSocket = {
    readyState: 0,
    onopen: () => {},
    onclose: () => {},
    onerror: () => {},
    onmessage: () => {},
  };
  // 重写全局 WebSocket 类
  unsafeWindow.WebSocket = function(uri) {
    ValkyrieWebWorker.postMessage({ type: `create`, args: [uri] });
  };
  unsafeWindow.WebSocket.prototype = {
    set onopen(fn) {
      ValkyrieWebSocket.onopen = fn;
    },
    set onclose(fn) {
      ValkyrieWebSocket.onclose = fn;
    },
    set onerror(fn) {
      ValkyrieWebSocket.onerror = fn;
    },
    set onmessage(fn) {
      ValkyrieWebSocket.onmessage = fn;
    },
    get readyState() {
      return ValkyrieWebSocket.readyState
    },
    send(command) {
      sendCommand(command);
    },
  };
  // Worker 线程事件
  ValkyrieWebWorker.onmessage = event => {
    const type = event.data.type;
    const args = event.data.args;
    // 处理函数集合
    const handlers = {
      onopen: event => {
        ValkyrieWebSocket.onopen(event);
      },
      onclose: event => {
        ValkyrieWebSocket.onclose(event);
      },
      onerror: event => {
        ValkyrieWebSocket.onerror(event);
      },
      onmessage: event => {
        onData(eventToData(event));
      },
      readyState: value => {
        ValkyrieWebSocket.readyState = value;
      },
    };
    try {
      handlers[type](...args);
    } catch (error) {
      console.log(type);
      console.log(...args);
      console.error(error);
    }
  };
  // 监听器
  const ValkyrieEmitter = new Emitter();
  // 接收 Worker 线程中的 WebSocket 的 data 数据
  function onData(data) {
    // 输出数据
    console.log(data);
    // 触发事件
    const type = data.dialog || data.type;
    ValkyrieEmitter.emit(type, data);
    // 返回至 WebSocket.onmessage 中处理
    ValkyrieWebSocket.onmessage(dataToEvent(data));
  }
  // data.type === `text`
  function onText(text, tag) {
    if (tag) {
      text = `<${tag}>${text}</${tag}>`;
    }
    onData({ type: `text`, text });
  }
  function sendCommand(command) {
    ValkyrieWebWorker.postMessage({ type: `sendCommand`, args: [command] });
    onData({ type: `sendCommand`, command });
  }
  function sendCommands(...args) {
    ValkyrieWebWorker.postMessage({ type: `sendCommands`, args });
    onData({ type: `sendCommands`, args });
  }
  function stopCommands() {
    ValkyrieWebWorker.postMessage({ type: `stopCommands`, args });
    onData({ type: `stopCommands` });
  }
  var ValkyrieWorker = {
    data() {
      return {
        id: ``,
        name: ``,
        serverText: ``,
        idListCache: [],
        documentWidth: 0,
      }
    },
    methods: {
      onData,
      onText,
      sendCommand,
      sendCommands,
      stopCommands,
      send: sendCommands,
      // 注册监听事件
      on(type, handler) {
        // 绑定 this 便于调用自身属性和方法
        return ValkyrieEmitter.on(type, handler.bind(this))
      },
      setCookie(name, value) {
        document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
        return true
      },
      getCookie(name) {
        const cookies = document.cookie.split(`;`).reduce((cookies, cookieString) => {
          const i = cookieString.indexOf(`=`);
          const name = cookieString.substr(0, i).trim();
          const value = cookieString.substr(i + 1);
          cookies[name] = value;
          return cookies
        }, {});
        return cookies[name]
      },
      setIdList(value) {
        if (value instanceof Array) {
          localStorage.setItem(`__roles__`, JSON.stringify(value));
        }
      },
      getIdList() {
        const string = localStorage.getItem(`__roles__`) || `[]`;
        return JSON.parse(string)
      },
      getValue(key) {
        if (this.id) {
          const object = JSON.parse(localStorage.getItem(this.id) || `{}`);
          return object[key] || {}
        }
      },
      setValue(key, value) {
        if (this.id) {
          const object = JSON.parse(localStorage.getItem(this.id) || `{}`);
          object[key] = value;
          localStorage.setItem(this.id, JSON.stringify(object));
          return object
        }
      },
      hasOwn(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop)
      },
    },
    mounted() {
      // 角色列表
      this.on(`roles`, function(data) {
        if (data.roles instanceof Array) {
          data.roles.forEach(item => this.idListCache.push(item));
        }
      });
      // 监听 id 值
      this.on(`login`, function(data) {
        const item = this.idListCache.find(x => x.id === data.id);
        if (item) {
          const { id, name, title } = item;
          const cookies = {
            u: this.getCookie(`u`),
            p: this.getCookie(`p`),
            s: this.getCookie(`s`),
          };
          const token = `${ cookies.u } ${ cookies.p }`;
          const server = [`一区`, `二区`, `三区`, `四区`, `五区`, `六区`][cookies.s];
          // 获取本地 idList
          const idList = this.getIdList();
          const index = idList.findIndex(x => x.id === id);
          if (index !== -1) {
            idList.splice(index, 1); // 找到就删
          }
          // 插入至首位
          idList.unshift({ id, name, title, server, cookies, token });
          // 保存
          this.setIdList(idList);
          this.id = id;
          this.name = name;
          this.serverText = server;
          unsafeWindow.id = id; // 全局标识
        }
      });
      // 监听窗口的宽度
      if (document && document.body && document.body.clientWidth) {
        this.documentWidth = document.body.clientWidth;
      }
      // 此处必须使用箭头函数使 this 指向 Vue 实例
      unsafeWindow.addEventListener(`resize`, () => {
        this.documentWidth = document.body.clientWidth;
      });
    },
  };

  var ValkyrieAwait = {
    data() {
      return {
      }
    },
    methods: {
      await(timeout = 1000) {
        return new Promise(resolve => setTimeout(() => resolve(), timeout))
      },
      awaitPack(timeout = 30000) {
        return new Promise(resolve => {
          this.on(`pack`, function(data, off) {
            if (this.hasOwn(data, `eqs`) && this.hasOwn(data, `items`)) {
              resolve(true);
              off();
            }
          });
          setTimeout(() => resolve(false), timeout);
        })
      },
    },
    mounted() {
    },
  };

  var ValkyrieOptions = {
    data() {
      return {
        options: {
          showStateDesc: false,
          showPanelRoom: true, // 房间面板
          showMapDialog: false, // 地图弹窗
        },
      }
    },
    mounted() {
      // 深度监听即时保存
      this.$watch(`options`, value => this.setValue(`options`, value), { deep: true });
      // 登录加载本地配置
      this.on(`login`, function() {
        if (this.id) {
          const options = this.getValue(`options`);
          Object.keys(options).forEach(key => {
            this.options[key] = options[key];
          });
        }
      });
      // 默认关闭弹窗
      this.options.showMapDialog = false;
    },
  };

  var OnLogin = {
    data() {
      return {
      }
    },
    methods: {
      // 更新工具栏位置
      updateToolBarPosition() {
        if (document.querySelector(`.content-bottom`).offsetHeight === 0) {
          document.querySelector(`[command=showcombat]`).click();
        }
        if (document.querySelector(`.right-bar`).offsetWidth === 0) {
          document.querySelector(`[command=showtool]`).click();
        }
        setTimeout(() => {
          const h1 = document.querySelector(`.content-bottom`).clientHeight;
          const h2 = document.querySelector(`.tool-bar.bottom-bar`).clientHeight;
          document.querySelector(`.right-bar`).style.bottom = h1 + h2 + `px`;
        }, 1000);
      },
    },
    mounted() {
      // 获取数据
      this.on(`login`, async function(data) {
        this.sendCommands(`pack,score2,score`);
        await this.await(1000);
        document.querySelector(`[command=skills]`).click();
        await this.await(1000);
        document.querySelector(`[command=tasks]`).click();
        await this.await(1000);
        document.querySelector(`.dialog-close`).click();
        this.updateToolBarPosition();
      });
      // 窗口尺寸变动时 触发工具位置变动
      unsafeWindow.addEventListener(`resize`, function() {
        this.updateToolBarPosition();
      });
    },
  };

  var OnRoom = {
    data() {
      return {
        roomName: ``,
        roomPath: ``,
        roomDesc: ``,
        roomCmds: [],
        roomX: ``,
        roomY: ``,
      }
    },
    computed: {
      roomNameText() {
        return `${this.roomX} ${this.roomY}`
      },
    },
    mounted() {
      this.on(`room`, function(data) {
        const { name, path, desc, commands } = data;
        this.roomName = name;
        this.roomPath = path;
        this.roomDesc = desc;
        this.roomCmds.splice(0);
        this.roomCmds.push(...commands);
        const names = name.split(/-|\(|\)/);
        this.roomX = names[0];
        this.roomY = names[1];
      });
    },
  };

  var OnMap = {
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
        const unitX = 100;
        return (this.mapPosition.maxX + this.mapOffsetX + 1) * unitX
      },
      mapHeight() {
        const unitY = 50;
        return (this.mapPosition.maxY + this.mapOffsetY + 1) * unitY
      },
      mapSVG() {
        const SVGList = [];
        SVGList.push(`<svg`);
        SVGList.push(` viewBox="0,0,${this.mapWidth},${this.mapHeight}"`);
        SVGList.push(` preserveAspectRatio="xMidYMid meet">`);
        SVGList.push(this.mapRectList.join(``));
        SVGList.push(this.mapTextList.join(``));
        SVGList.push(this.mapLineList.join(``));
        SVGList.push(`</svg>`);
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
        this.mapDataList = datalist;
      },
      updateMapPosition() {
        this.mapPosition = { minX: 99999, minY: 99999, maxX: 0, maxY: 0 };
        this.mapDataList.forEach(data => {
          const [x, y] = data.p;
          if (x < this.mapPosition.minX) this.mapPosition.minX = x;
          if (x > this.mapPosition.maxX) this.mapPosition.maxX = x;
          if (y < this.mapPosition.minY) this.mapPosition.minY = y;
          if (y > this.mapPosition.maxY) this.mapPosition.maxY = y;
        });
        // 偏移
        this.mapOffsetX = 0 - this.mapPosition.minX;
        this.mapOffsetY = 0 - this.mapPosition.minY;
      },
      updateMapSVG() {
        const [unitX, unitY, unitW, unitH] = [100, 50, 60, 20];
        this.mapRectList.splice(0);
        this.mapLineList.splice(0);
        this.mapTextList.splice(0);
        this.mapDataList.forEach(data => {
          const l = (data.p[0] + this.mapOffsetX) * unitX + 20;
          const t = (data.p[1] + this.mapOffsetY) * unitY + 20;
          // rect
          this.mapRectList.push(`<rect`);
          this.mapRectList.push(` x="${l}" y="${t}"`);
          this.mapRectList.push(` fill="dimgrey" stroke-width="1" stroke="gray"`);
          this.mapRectList.push(` width="${unitW}" height="${unitH}"`);
          this.mapRectList.push(`></rect>`);
          // text
          this.mapTextList.push(`<text`);
          this.mapTextList.push(` x="${l+30}" y="${t+14}"`);
          this.mapTextList.push(` text-anchor="middle" style="font-size: 12px;" fill="#232323"`);
          this.mapTextList.push(`>${data.n}</text>`);
          // line
          if ((data.exits instanceof Array) === false) return
          data.exits.forEach(exit => {
            const regexp = /^([a-z]{1,2})(\d)?([d|l])?$/;
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
              }[RegExp.$1];
              const [a, b] = points;
              if (a && b) {
                this.mapLineList.push(`<line`);
                this.mapLineList.push(` stroke="gray"`);
                this.mapLineList.push(` x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"`);
                if (RegExp.$3) {
                  this.mapLineList.push(` stroke-dasharray="5,5"`);
                }
                if (RegExp.$3 === `l`) {
                  this.mapLineList.push(` stroke-width="10"`);
                } else {
                  this.mapLineList.push(` stroke-width="1"`);
                }
                this.mapLineList.push(`></line>`);
              }
            }
          });
        });
      },
    },
    mounted() {
      this.on(`map`, function(data) {
        if ((data.map instanceof Array) === false) return
        // 若区域改变 则更新数据
        if (data.path !== this.mapPath) {
          this.mapPath = data.path;
          this.updateMapDataList(data.map);
          this.updateMapPosition();
          this.updateMapSVG();
        }
        // 屏蔽
        delete data.type;
      });
    },
  };

  var OnExits = {
    data() {
      return {
        exitList: [],
      }
    },
    mounted() {
      this.on(`exits`, function(data) {
        if (data.items instanceof Array) {
          this.exitList.splice(0);
          Object.keys(data.items).forEach(x => {
            const name = data.items[x];
            const command = `go ${x}`;
            this.exitList.push({ name, command });
          });
        }
      });
    },
  };

  class Base {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
    }
    get nameText() {
      // 删除标签后的格式化文本
      return this.name.replace(/<\S+?>/g, ``)
    }
    get colorValue() {
      // 颜色 [1-7]
      const index = [        // 0: 无法判断
        /^<(hiw|wht)>/i,     // 1: 白
        /^<hig>/i,           // 2: 绿
        /^<hic>/i,           // 3: 蓝
        /^<hiy>/i,           // 4: 黄
        /^<hiz>/i,           // 5: 紫
        /^<hio>/i,           // 6: 橙
        /^<(hir|ord|red)>/i, // 7: 红
        /^<\S\S\S>/,         // 8: 未知
      ].findIndex(regexp => regexp.test(this.name)) + 1;
      // 打印未知标签
      if (index === 8) {
        console.warn(this.name);
      }
      return index
    }
  }

  class Role extends Base {
    constructor(data) {
      super(data);
      this.hp = data.hp || 0;
      this.mp = data.mp || 0;
      this.max_hp = data.max_hp || 0;
      this.max_mp = data.max_mp || 0;
      this.status = data.status || [];
      // 1: 玩家对象, 0: ？
      this.p = data.p || 0;
    }
    get isSelf() {
      // 是否玩家自己
      return this.id === unsafeWindow.id
    }
    get isPlayer() {
      // 是否玩家
      return this.p === 1
    }
    get isOffline() {
      // 是否掉线的玩家
      return this.name.includes(`<red>&lt;断线中&gt;</red>`)
    }
    get isNpc() {
      // 是否NPC
      return !this.isPlayer
    }
    get sortValue() {
      // 排序权重
      if (this.isSelf) return 0
      if (this.isNpc) return this.colorValue
      return this.colorValue + (this.isOffline ? 2000 : 1000)
    }
  }

  var OnItems = {
    data() {
      return {
        roleList: [],
      }
    },
    computed: {
      // 当前 NPC 列表
      npcList() {
        return this.roleList.filter(x => x.isNpc)
      },
    },
    mounted() {
      this.on(`items`, function(data) {
        if (data.items instanceof Array) {
          this.roleList.splice(0);
          data.items.forEach(x => x && this.roleList.push(new Role(x)));
          this.roleList.sort((a, b) => a.sortValue - b.sortValue);
          // 修改
          data.items = this.roleList;
        }
      });
      this.on(`itemadd`, function(data) {
        const role = new Role(data);
        const index = this.roleList.findIndex(x => x.id === role.id);
        if (index !== -1) {
          this.roleList.splice(index, 1, role);
        } else {
          this.roleList.push(role);
        }
        this.roleList.sort((a, b) => a.sortValue - b.sortValue);
        // 修改
        data.type = `items`;
        data.items = this.roleList;
      });
      this.on(`itemremove`, function(data) {
        if (typeof data.id === `string`) {
          const index = this.roleList.findIndex(x => x.id === data.id);
          if (index !== -1) {
            this.roleList.splice(index, 1);
          }
        }
      });
      this.on(`sc`, function(data) {
        const role = this.roleList.find(x => x.id === data.id);
        if (role === undefined) return
        if (this.hasOwn(data, `hp`)) this.roleList[index].hp = data.hp;
        if (this.hasOwn(data, `mp`)) this.roleList[index].mp = data.mp;
        if (this.hasOwn(data, `max_hp`)) this.roleList[index].max_hp = data.max_hp;
        if (this.hasOwn(data, `max_mp`)) this.roleList[index].max_mp = data.max_mp;
      });
    },
  };

  var STATE_LIST = [
  	"打坐",
  	"疗伤",
  	"读书",
  	"学习",
  	"练习",
  	"修炼",
  	"工作",
  	"挖矿",
  	"采药",
  	"钓鱼",
  	"炼药",
  	"闭关",
  	"领悟",
  	"聚魂",
  	"推演"
  ];

  var OnState = {
    data() {
      return {
        stateText: ``,
      }
    },
    computed: {
      documentTitle() {
        if (this.name) {
          return `${this.name} ${this.stateText} ${this.serverText}`
        }
        return `武神传说`
      },
    },
    watch: {
      documentTitle(value) {
        document.title = value;
      },
    },
    mounted() {
      this.on(`state`, function(data) {
        this.stateText = STATE_LIST.find(x => data.state.includes(x)) || data.state || ``;
        // 修改状态
        data.state = this.stateText;
        // 删除描述
        if (this.options.showStateDesc === false) {
          delete data.desc;
        }
      });
    },
  };

  var OnScore = {
    data() {
      return {
        score: {},
        jyValue: 0,
        qnValue: 0,
      }
    },
    computed: {
      // 经验
      jyCache() {
        return Number(this.score.exp) || 0
      },
      jyText() {
        return Number(this.jyValue.toFixed()).toLocaleString()
      },
      // 潜能
      qnCache() {
        return Number(this.score.pot) || 0
      },
      qnText() {
        return Number(this.qnValue.toFixed()).toLocaleString()
      },
      // 先天悟性
      wx1() {
        return Number(this.score.int) || 0
      },
      // 后天悟性
      wx2() {
        return Number(this.score.int_add) || 0
      },
      // 学习效率
      xxxl() {
        return parseInt(this.score.study_per ) || 0
      },
      // 练习效率
      lxxl() {
        return parseInt(this.score.lianxi_per) || 0
      },
      // 练习每一跳消耗＝(先天悟性＋后天悟性)×(1＋练习效率%－先天悟性%)
      lxCost() {
        return parseInt((this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100))
      },
      // 学习每一跳消耗＝(先天悟性＋后天悟性)×(1＋学习效率%－先天悟性%)×3
      xxCost() {
        return parseInt((this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3)
      },
      // 气血百分比
      hpPercentage() {
        return parseInt((this.score.hp / this.score.max_hp) * 100) || 0
      },
      // 内力百分比
      mpPercentage() {
        return parseInt((this.score.mp / this.score.max_mp) * 100) || 0
      },
      // 门派
      familyText() {
        return this.score.family || ``
      },
      // 性别
      genderText() {
        return this.score.gender || ``
      },
      // 精力
      energy() {
        if (typeof this.score.jingli === `string` && /^(\d+)[^\d]+(\d+)[^\d]+(\d+)[^\d]+$/.test(this.score.jingli)) {
          const value = Number(RegExp.$1) || 0;
          const limit = Number(RegExp.$2) || 0;
          const today = Number(RegExp.$3) || 0;
          return { value, limit, today }
        }
        return { value, limit, today }
      },
      energyValue() {
        return this.energy.value
      },
      energyLimit() {
        return this.energy.limit
      },
    },
    watch: {
      // 数字动态递增：经验、潜能
      jyCache(value) {
        if (document && document.hidden) {
          this.jyValue = value;
        } else {
          gsap.to(this.$data, { duration: 0.5, jyValue: value });
        }
      },
      qnCache(value) {
        if (document && document.hidden) {
          this.qnValue = value;
        } else {
          gsap.to(this.$data, { duration: 0.5, qnValue: value });
        }
      },
    },
    mounted() {
      const update = function(data) {
        if (data.id === this.id) {
          Object.keys(data).forEach(key => {
            this.score[key] = data[key];
          });
        }
      };
      this.on(`score`, update);
      this.on(`sc`, update);
    },
  };

  var PackSortList = [
  	"神魂碎片",
  	"武道残页",
  	"武道",
  	"帝魄碎片",
  	"元晶",
  	"玄晶",
  	"周年庆徽章",
  	"技能重置卡",
  	"师门补给包",
  	"背包扩充石",
  	"随从礼包",
  	"小箱子",
  	"玫瑰花",
  	"召唤令",
  	"补签卡",
  	"藏宝图",
  	"鱼饵",
  	"月饼",
  	"朱果",
  	"潜灵果",
  	"顿悟丹",
  	"养精丹",
  	"闭元丹",
  	"培元丹",
  	"聚气丹",
  	"突破丹",
  	"冰心丹",
  	"玄灵丹",
  	"扫荡符",
  	"天师符",
  	"叛师符",
  	"洗髓丹",
  	"变性丹",
  	"喜宴",
  	"师门令牌",
  	"挖矿指南",
  	"铁镐",
  	"钓鱼竿",
  	"药王神篇",
  	"红宝石",
  	"绿宝石",
  	"蓝宝石",
  	"黄宝石",
  	"碎裂的破军",
  	"碎裂的贪狼",
  	"碎裂的七杀",
  	"碎裂的紫薇",
  	"破军",
  	"贪狼",
  	"七杀",
  	"紫薇",
  	"进阶秘籍",
  	"秘籍",
  	"残页",
  	"鲤鱼",
  	"草鱼",
  	"鲢鱼",
  	"鲮鱼",
  	"鳊鱼",
  	"鲂鱼",
  	"黄金鳉",
  	"黄颡鱼",
  	"太湖银鱼",
  	"虹鳟",
  	"孔雀鱼",
  	"反天刀",
  	"银龙鱼",
  	"黑龙鱼",
  	"罗汉鱼",
  	"巨骨舌鱼",
  	"七星刀鱼",
  	"帝王老虎魟",
  	"当归",
  	"山楂叶",
  	"柴胡",
  	"金银花",
  	"石楠叶",
  	"茯苓",
  	"沉香",
  	"熟地黄",
  	"九香虫",
  	"络石藤",
  	"冬虫夏草",
  	"人参",
  	"何首乌",
  	"凌霄花",
  	"灵芝",
  	"天仙藤",
  	"盘龙参",
  	"四十二章经一",
  	"四十二章经二",
  	"四十二章经三",
  	"四十二章经四",
  	"四十二章经五",
  	"四十二章经六",
  	"四十二章经七",
  	"四十二章经八",
  	"★",
  	"☆",
  	""
  ];

  class Pack extends Base {
    constructor(data) {
      super(data);
      this.count = data.count;
      this.unit = data.unit;
      this.value = data.value || 0;
      // 可装备: 0/1
      this.can_eq = data.can_eq || 0;
      // 可使用: 0/1
      this.can_use = data.can_use || 0;
      // 可学习: 0/1
      this.can_study = data.can_study || 0;
      // 可合成: 0/1
      this.can_combine = data.can_combine || 0;
    }
    get isEquip() {
      return this.can_eq === 1
    }
    get sortValue() {
      const index = PackSortList.findIndex(name => this.name.includes(name)) + 1;
      return this.colorValue + (index * 10)
    }
    get valueText() {
      // 物品价值文本
      return this.value
    }
  }

  var OnPack = {
    data() {
      return {
        equipList: [],
        packList: [],
        packLimit: 0,
        moneyValue: 0,
      }
    },
    computed: {
      // 物品数量
      packCount() {
        return this.packList.length
      },
    },
    mounted() {
      this.on(`pack`, function(data) {
        if (this.hasOwn(data, `eqs`) && data.eqs instanceof Array) {
          data.eqs.forEach((x, i) => (this.equipList[i] = x));
        }
        if (this.hasOwn(data, `items`) && data.items instanceof Array) {
          this.packList.splice(0);
          data.items.forEach(x => this.packList.push(new Pack(x)));
          this.packList.sort((a, b) => a.sortValue - b.sortValue);
          // 修改
          data.items = this.packList;
        }
        // 钱
        if (this.hasOwn(data, `money`)) {
          this.moneyValue = Number(data.money) || 0;
        }
        // 物品上限
        if (this.hasOwn(data, `max_item_count`)) {
          this.packLimit = Number(data.max_item_count) || 0;
        }
      });
    },
  };

  class Skill extends Base {
    constructor(data) {
      super(data);
      this.level = Number(data.level) || 0;
      this.can_enables = data.can_enables || undefined;
      this.enable_skill = data.enable_skill || ``;
      this.exp = 0;
      this._exp = data.exp;
    }
    set _exp(value) {
      value = Number(value) || 0;
      // 计算后的熟练度数值为 [10, 95] 区间中 5 的倍数
      this.exp = (value <= 10) ? 10 : parseInt(value / 5) * 5;
    }
    get _exp() {
      return this.exp
    }
    get k() {
      // 技能系数 = 技能颜色 * 2.5
      return this.colorValue * 2.5
    }
    get sortValue() {
      // 基础技能
      if (this.colorValue === 1) {
        return [
          `force`, // 1: 内功
          `unarmed`, // 2: 拳脚
          `dodge`, // 3: 轻功
          `parry`, // 4: 招架
          `blade`, // 5: 刀
          `sword`, // 6: 剑
          `club`, // 7: 棍
          `staff`, // 8: 杖
          `whip`, // 9: 鞭
          `throwing`, // 10: 暗器
          `bite`, // 11: 野兽扑咬
          `literate`, // 12: 读书识字
          `lianyao`, // 13: 炼药术
        ].findIndex(item => item === this.id) + 1
      }
      // 特殊技能 = 等级权重 + 颜色权重
      const levelSort = 100000 - this.level;
      const colorSort = (10 - this.colorValue) / 2;
      return levelSort + colorSort
    }
  }

  var OnSkills = {
    data() {
      return {
        skillList: [],
        skillLimit: 0,
      }
    },
    mounted() {
      this.on(`skills`, function(data) {
        // 技能列表
        if (this.hasOwn(data, `items`) && data.items instanceof Array) {
          this.skillList.splice(0);
          data.items.forEach(x => this.skillList.push(new Skill(x)));
          this.skillList.sort((a, b) => a.sortValue - b.sortValue);
          // 修改
          data.items = this.skillList;
        }
        // 技能等级上限
        if (this.hasOwn(data, `limit`)) {
          this.skillLimit = parseInt(data.limit) || 0;
        }
        // 学会新的技能
        if (this.hasOwn(data, `item`)) {
          this.skillList.push(new Skill(data.item));
        }
        // 更新潜能值
        if (this.hasOwn(data, `pot`)) {
          this.score.pot = Number(data.pot) || 0;
        }
        // 单个技能信息变动
        if (this.hasOwn(data, `id`)) {
          const skill = this.skillList.find(x => x.id === data.id);
          if (skill === null) return
          if (this.hasOwn(data, `level`)) {
            skill.level = Number(data.level) || 1;
            this.onText(`你的技能${ skill.name }提升到了<hiw>${ skill.level }</hiw>级！`);
          }
          // 技能经验
          if (this.hasOwn(data, `exp`)) {
            skill._exp = data.exp;
            switch (this.stateText) {
              case `练习`:
                this.onText(`你练习${ skill.name }消耗了${ this.lxCost }点潜能。${ data.exp }%`);
                this.state.detail = skill.nameText;
                this.score.pot -= this.lxCost;
                break
              case `学习`:
                this.onText(`你学习${ skill.name }消耗了${ this.xxCost }点潜能。${ data.exp }%`);
                this.state.detail = skill.nameText;
                this.score.pot -= this.xxCost;
                break
              case `炼药`:
                this.onText(`你获得了炼药经验，${ skill.name }当前<hiw>${ skill.level }</hiw>级。${ data.exp }%`);
                break
            }
          }
          // if (index !== -1) {
          //   const skill = this.skillList[index]
          //   /* 潜能消耗＝等级平方差×技能颜色系数 */
          //   const qnCost = (Math.pow(this.skillLimit, 2) - Math.pow(skill.level, 2)) * skill.k
          //   /* 秒数消耗＝潜能/每一跳的潜能/(每分钟秒数/每分钟五次) */
          //   const time = qnCost / this.lxCost / ( 60 / 5)
          //   const timeString = time < 60 ? `${parseInt(time)}分钟` : `${parseInt(time/60)}小时${parseInt(time%60)}分钟`
          //   // 还需要${ timeString }消耗${ qn }点潜能到${ this.skillLimit }级。
          // }
        }
      });
    },
  };

  var OnTasks = {
    data() {
      return {
        smCount: 20,
        smTotal: 99,
        smTarget: ``,
        ymCount: 20,
        ymTotal: 99,
        ymTarget: ``,
        ymTargetX: ``,
        ymTargetY: ``,
        ybCount: 20,
        ybTotal: 99,
        fbCount: 20,
        wdCount: 99,
        wdTotal: 99,
        wdComplete: true,
        qaComplete: true,
        xyComplete: true,
        mpComplete: true,
      }
    },
    mounted() {
      this.on(`tasks`, function(data) {
        if ((data.items instanceof Array) === false) return
        this.smTarget = ``;
        this.ymTarget = ``;
        this.ymTargetX = ``;
        this.ymTargetY = ``;
        data.items.forEach(x => {
          const { id, state, title, desc } = x;
          switch (id) {
            case `signin`:
              // 副本：<hik>0/20</hik>
              // 副本：<hig>20/20</hig>
              if (/副本：<[\S]{3}>(\d+)\/20<[\S]{4}>/.test(desc)) {
                this.fbCount = Number(RegExp.$1) || 0;
              }
              // <hig>武道塔可以重置，进度20/29</hig>，
              // <nor>武道塔已重置，进度99/99</nor>，
              if (/武道塔([\S]{1,2})重置，进度(\d+)\/(\d+)/.test(desc)) {
                this.wdComplete = (RegExp.$1 === `已`);
                this.wdCount = Number(RegExp.$2) || 0;
                this.wdTotal = Number(RegExp.$3) || 0;
              }
              // <hig>还没有给首席请安</hig>
              // 本周尚未协助襄阳守城，尚未挑战门派BOSS，还可以挑战武神BOSS5次。
              this.qaComplete = (/还没有给首席请安/.test(desc) === false);
              this.xyComplete = (/本周尚未协助襄阳守城/.test(desc) === false);
              this.mpComplete = (/尚未挑战门派BOSS/.test(desc) === false);
              // 自动签到
              if (state === 2) {
                this.onText(`[ ${title} ]`, `him`);
                this.sendCommands(`taskover signin`);
              }
              break
            case `sm`:
              // 你的师门委托目前完成0/20个，共连续完成16个。
              if (/目前完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
                this.smCount = Number(RegExp.$1) || 0;
                this.smTotal = Number(RegExp.$2) || 0;
              }
              // 你的师门委托你去寻找<wht>当归</wht>，你可以慢慢寻找，没有时间限制，目前完成0/20个，共连续完成16个。
              if (/你的师门委托你去寻找(\S+)，你可以慢慢寻找/.test(desc)) {
                this.smTarget = RegExp.$1;
              }
              break
            case `yamen`:
              // 扬州知府委托你追杀逃犯：目前完成0/20个，共连续完成34个。
              if (/目前完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
                this.ymCount = Number(RegExp.$1) || 0;
                this.ymTotal = Number(RegExp.$2) || 0;
              }
              // 扬州知府委托你追杀逃犯：司空荔蓓，据说最近在峨眉派-走廊出现过，你还有9分57秒去寻找他，目前完成0/20个，共连续完成34个。
              if (/扬州知府委托你追杀逃犯：(\S+)，据说最近在(\S+)-(\S+)出现过/.test(desc)) {
                this.ymTarget = RegExp.$1;
                this.ymTargetX = RegExp.$2;
                this.ymTargetY = RegExp.$3;
              }
              break
            case `yunbiao`:
              // 你目前没有接受到委托，本周完成0/20个，共连续完成0个。
              if (/本周完成(\d+)\/20个，共连续完成(\d+)个/.test(desc)) {
                this.ybCount = Number(RegExp.$1) || 0;
                this.ybTotal = Number(RegExp.$2) || 0;
              }
              break
            default:
              if (state === 2) {
                this.onText(`任务[${title}]已经可以领取奖励。`, `him`);
                // 2021-05-01 ~ 2021-05-05 节日礼包
                if (id === `zz1` && title === `<hic>节日礼包</hic>` && desc === `节日快乐，你尚未领取节日礼包。`) {
                  this.sendCommands(`taskover ${id}`);
                }
              }
              break
          }
        });
      });
    },
  };

  var OnList = {
    data() {
      return {
        storeList: [],
        storeLimit: 0,
        seller: ``,
        sellList: [],
      }
    },
    mounted() {
      this.on(`list`, function(data) {
        // 仓库列表
        if (this.hasOwn(data, `stores`) && data.stores instanceof Array) {
          this.storeList.splice(0);
          data.stores.forEach(item => this.storeList.push(new Pack(item)));
          this.storeList.sort((a, b) => a.sortValue - b.sortValue);
          // 修改
          data.stores = this.storeList;
        }
        // 仓库上限
        if (this.hasOwn(data, `max_store_count`)) {
          this.storeLimit = Number(data.max_store_count) || 0;
        }
        // 商店
        if (this.hasOwn(data, `seller`)) {
          this.seller = data.seller;
        }
        if (this.hasOwn(data, `selllist`) && data.selllist instanceof Array) {
          this.sellList.splice(0);
          data.selllist.forEach(x => this.sellList.push(new Pack(x)));
        }
      });
    },
  };

  class Chat {
    constructor(data) {
      this.id = data.uid || ``;
      // 聊天频道
      this.channel = data.ch;
      // 聊天内容
      this.content = data.content.trim().replace(/\n/g, `<br>`);
      this.name = data.name || ``;
      // 本地生成的时间
      this.time = new Date();
      // 世界频道专有：等级
      this.level = data.lv || 0;
      // 门派频道专有：门派
      this.family = data.fam || ``;
      // 全区频道专有：服务器
      this.server = data.server || ``;
    }
    get isSelf() {
      return this.id === unsafeWindow.id
    }
    get isTm() {
      return this.channel === `tm`
    }
    get isEs() {
      return this.channel === `es`
    }
    get isFa() {
      return this.channel === `fam`
    }
    get isSy() {
      return this.channel === `sys`
    }
    get isPt() {
      return this.channel === `pty`
    }
    get isCh() {
      return this.channel === `chat`
    }
    get isRu() {
      return this.channel === `rumor`
    }
    get commandText() {
      return `look3 ${this.id}`
    }
    get tag() {
      if (this.isTm) return `hig`
      if (this.isEs) return `hio`
      if (this.isFa) return `hiy`
      if (this.isSy) return `hir`
      if (this.isPt) return `hiz`
      if (this.isRu) return `him`
      if (this.isCh) return [0, 0, 0, `hiy`, `hiz`, `hio`, `hir`][this.level] || `hic`
      return `hiy`
    }
    get titleText() {
      if (this.isTm) return `队伍`
      if (this.isPt) return `帮派`
      if (this.isRu) return `谣言`
      if (this.isSy) return `系统`
      if (this.isFa) return `${this.family}`
      if (this.isEs) return `${this.server}`
      if (this.isCh) return [`百姓`, `武士`, `武师`, `宗师`, `武圣`, `武帝`, `武神`][this.level] || `闲聊`
      return `脚本`
    }
    get titleHtml() {
      return `<${this.tag}>【${this.titleText}】</${this.tag}>`
    }
    get timeText() {
      return new Date(this.time).toLocaleTimeString(`en-DE`)
    }
  }

  var OnMsg = {
    data() {
      return {
        chatList: [],
      }
    },
    mounted() {
      this.on(`msg`, function(data) {
        this.chatList.push(new Chat(data));
        if (this.chatList.length > 888) {
          this.chatList.splice(0, 88);
        }
      });
    },
  };

  var OnText = {
    mounted() {
      this.on(`text`, function(data) {
        // 获得经验潜能 更新数值
        if (/你获得了(\d+)点经验，(\d+)点潜能/.test(data.text)) {
          this.score.exp += Number(RegExp.$1) || 0;
          this.score.pot += Number(RegExp.$2) || 0;
        }
        // 技能等级提升
        if (/^<hiy>你的[\s\S]+等级提升了！<\/hiy>$/.test(data.text)) {
          delete data.type;
        }
        // 获得经验潜能 删除标签
        if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
          data.text = data.text.replace(/<\S+?>/g, ``);
        }
      });
    },
  };

  var OnCustomCommand = {
    data() {
      return {
      }
    },
    computed: {
    },
    watch: {
    },
    methods: {
    },
    mounted() {
      this.on(`custom-command`, function(data) {
        // {npc:*****}
        while (/{npc:([\s\S]+?)}/i.test(data.command)) {
          const string = RegExp.$1;
          const regexp = new RegExp(string);
          const npc = this.npcList.find(x => regexp.test(x.name));
          if (npc) {
            data.command = data.command.replace(/{npc:([\s\S]+?)}/i, npc.id);
          } else {
            data.command = data.command.replace(/{npc:([\s\S]+?)}/i, key);
            this.onText(`[ ${key} ]`, `hir`);
          }
        }
        this.sendCommand(data.command);
      });
    },
  };

  // 创建应用程序实例
  const app = Vue.createApp({});
  // 加载 Element3 UI 组件库
  app.use(Element3);
  // 禁止 Vue3 的开发模式警告信息
  app.config.warnHandler = function(msg, vm, trace) {}; // trace 是组件的继承关系追踪
  // Web Worker
  app.mixin(ValkyrieWorker);
  // 同步监听
  app.mixin(ValkyrieAwait);
  // 配置项
  app.mixin(ValkyrieOptions);
  // 数据处理
  app.mixin(OnLogin);
  app.mixin(OnRoom);
  app.mixin(OnMap);
  app.mixin(OnExits);
  app.mixin(OnItems); // items, itemadd, itemremove, sc
  app.mixin(OnState);
  app.mixin(OnScore);
  app.mixin(OnPack);
  app.mixin(OnSkills);
  app.mixin(OnTasks);
  app.mixin(OnList);
  app.mixin(OnMsg);
  app.mixin(OnText);
  app.mixin(OnCustomCommand); // 自定义指令模块
  // DOM 加载完毕
  document.addEventListener(`DOMContentLoaded`, function() {
    document.body.insertAdjacentHTML(`beforeend`, `<div id="app"></div>`);
    // 挂载 Valkyrie
    unsafeWindow.Valkyrie = app.mount(`#app`);
  });
  // 全局 Vue 对象
  unsafeWindow.Vue = Vue;

}());
