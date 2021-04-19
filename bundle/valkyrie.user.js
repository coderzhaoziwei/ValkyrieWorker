// ==UserScript==
// @name         Valkyrie
// @namespace    https://greasyfork.org/scripts/422783
// @version      1.2.2
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @description  文字游戏《武神传说》的浏览器脚本程序的基础库
// @modified     2021/4/19 15:37:11
// @license      MIT
// @homepage     https://greasyfork.org/scripts/422783
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

/* eslint-env es6 */
/* global Vue:readonly */
/* global Element3:readonly */
/* global gsap:readonly */

(function () {
  'use strict';

  var WORKER_CONTENT = "const worker = {\n  websocket: undefined,\n  commands: [],\n  sendState: false,\n}\nconst handlers = {\n  createWebSocket(uri) {\n    worker.websocket = new WebSocket(uri)\n    worker.websocket.onopen = function() {\n      console.log(`ValkyrieWorker: WebSocket.onopen`)\n      postMessage({ type: `setReadyState`, args: [worker.websocket.readyState] })\n      postMessage({ type: `websocketOnopen`, args: [] })\n    }\n    worker.websocket.onclose = function() {\n      console.log(`ValkyrieWorker: WebSocket.onclose`)\n      postMessage({ type: `setReadyState`, args: [worker.websocket.readyState] })\n      postMessage({ type: `websocketOnclose`, args: [] })\n    }\n    worker.websocket.onerror = function() {\n      console.log(`ValkyrieWorker: WebSocket.onerror`)\n      postMessage({ type: `setReadyState`, args: [worker.websocket.readyState] })\n      postMessage({ type: `websocketOnerror`, args: [] })\n    }\n    worker.websocket.onmessage = function(event) {\n      postMessage({ type: `websocketOnmessage`, args: [{ data: event.data }] })\n    }\n  },\n  sendCommand(command) {\n    worker.websocket.send(command)\n  },\n  sendCommands(...args) {\n    args = args.flat(Infinity)\n    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(`,`)))\n    args = args.flat(Infinity)\n    worker.commands.push(...args)\n    if (worker.sendState === false) {\n      worker.sendState = true\n      sendLoop(0)\n    }\n  },\n}\nfunction sendLoop(ms = 256) {\n  const command = worker.commands.splice(0, 1)[0]\n  if (command === undefined) {\n    worker.sendState = false\n    return\n  }\n  if (isNaN(Number(command)) === false) {\n    sendLoop(Number(command))\n    return\n  }\n  if (typeof command === `string` && command.includes(`{`) && command.includes(`}`)) {\n    setTimeout(() => {\n      const data = JSON.stringify({ type: `custom-command`, command })\n      postMessage({ type: `websocketOnmessage`, args: [{ data }] })\n      sendLoop()\n    }, ms)\n    return\n  }\n  if (typeof command === `string`) {\n    setTimeout(() => {\n      handlers.sendCommand(command)\n      sendLoop()\n    }, ms)\n  }\n}\nonmessage = function(event) {\n  try {\n    const type = event.data.type\n    const args = event.data.args\n    handlers[type](...args)\n  } catch (error) {\n    console.error(error)\n  }\n}\n";

  const PACK_LIST = Vue.readonly([
    `神魂碎片`,
    `<hio>武道</hio>`,
    `<hio>武道残页</hio>`,
    `元晶`,
    `帝魄碎片`,
    `玄晶`,
    `周年庆徽章`,
    `技能重置卡`,
    `师门补给包`,
    `背包扩充石`,
    `随从礼包`,
    `小箱子`,
    `玫瑰花`,
    `召唤令`,
    `补签卡`,
    `藏宝图`,
    `鱼饵`,
    `月饼`,
    `朱果`,
    `潜灵果`,
    `顿悟丹`,
    `养精丹`,
    `闭元丹`,
    `培元丹`,
    `聚气丹`,
    `突破丹`,
    `冰心丹`,
    `玄灵丹`,
    `扫荡符`,
    `天师符`,
    `叛师符`,
    `洗髓丹`,
    `变性丹`,
    `喜宴`,
    `师门令牌`,
    `挖矿指南`,
    `铁镐`,
    `钓鱼竿`,
    `药王神篇`,
    `红宝石`,
    `绿宝石`,
    `蓝宝石`,
    `黄宝石`,
    `碎裂的破军`,
    `碎裂的贪狼`,
    `碎裂的七杀`,
    `碎裂的紫薇`,
    `破军`,
    `贪狼`,
    `七杀`,
    `紫薇`,
    `进阶秘籍`,
    `秘籍`,
    `残页`,
    `鲤鱼`,
    `草鱼`,
    `鲢鱼`,
    `鲮鱼`,
    `鳊鱼`,
    `鲂鱼`,
    `黄金鳉`,
    `黄颡鱼`,
    `太湖银鱼`,
    `虹鳟`,
    `孔雀鱼`,
    `反天刀`,
    `银龙鱼`,
    `黑龙鱼`,
    `罗汉鱼`,
    `巨骨舌鱼`,
    `七星刀鱼`,
    `帝王老虎魟`,
    `当归`,
    `芦荟`,
    `山楂叶`,
    `柴胡`,
    `金银花`,
    `石楠叶`,
    `茯苓`,
    `沉香`,
    `熟地黄`,
    `九香虫`,
    `络石藤`,
    `冬虫夏草`,
    `人参`,
    `何首乌`,
    `凌霄花`,
    `灵芝`,
    `天仙藤`,
    `盘龙参`,
    `四十二章经一`,
    `四十二章经二`,
    `四十二章经三`,
    `四十二章经四`,
    `四十二章经五`,
    `四十二章经六`,
    `四十二章经七`,
    `四十二章经八`,
    `★`,
    `☆`,
  ]);
  const STATE_LIST = Vue.readonly([
    `打坐`,
    `疗伤`,
    `读书`,
    `学习`,
    `练习`,
    `工作`,
    `挖矿`,
    `采药`,
    `钓鱼`,
    `炼药`,
    `闭关`,
    `领悟`,
    `聚魂`,
    `推演`,
  ]);

  class Base {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
    }
    get nameText() {
      return this.name.replace(/<\S+?>/g, ``)
    }
    get colorValue() {
      const index = [
        /^<(hiw|wht)>/i,
        /^<hig>/i,
        /^<hic>/i,
        /^<hiy>/i,
        /^<hiz>/i,
        /^<hio>/i,
        /^<(hir|ord|red)>/i,
        /^<\S\S\S>/,
      ].findIndex(regexp => regexp.test(this.name)) + 1;
      if (index === 8) console.warn(this.name);
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
      this.p = data.p || 0;
    }
    get isSelf() {
      return this.id === unsafeWindow.id
    }
    get isPlayer() {
      return this.p === 1
    }
    get isOffline() {
      return this.name.includes(`<red>&lt;断线中&gt;</red>`)
    }
    get isNpc() {
      return !this.isPlayer
    }
    get sortValue() {
      if (this.isSelf) return 0
      if (this.isNpc) return this.colorValue
      return this.colorValue + this.isOffline ? 2000 : 1000
    }
  }
  class Pack extends Base {
    constructor(data) {
      super(data);
      this.count = data.count;
      this.unit = data.unit;
      this.value = data.value || 0;
      this.can_eq = data.can_eq || 0;
      this.can_use = data.can_use || 0;
      this.can_study = data.can_study || 0;
      this.can_combine = data.can_combine || 0;
    }
    get isEquip() {
      return this.can_eq === 1
    }
    get sortValue() {
      const index = PACK_LIST.findIndex(name => this.name.includes(name));
      return this.colorValue + (index === -1 ? 10000 : (index * 10))
    }
    get valueText() {
      return this.value
    }
  }
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
      this.exp = (value <= 10) ? 10 : parseInt(value / 5) * 5;
    }
    get _exp() {
      return this.exp
    }
    get k() {
      return this.colorValue * 2.5
    }
    get sortValue() {
      if (this.colorValue === 1) {
        return [
          `force`,
          `unarmed`,
          `dodge`,
          `parry`,
          `blade`,
          `sword`,
          `club`,
          `staff`,
          `whip`,
          `throwing`,
          `bite`,
          `literate`,
          `lianyao`,
        ].findIndex(item => item === this.id) + 1
      }
      const levelSort = 100000 - this.level;
      const colorSort = (10 - this.colorValue) / 2;
      return levelSort + colorSort
    }
  }
  class Chat {
    constructor(data) {
      this.id = data.uid || ``;
      this.channel = data.ch;
      this.content = data.content.trim().replace(/\n/g, `<br>`);
      this.name = data.name || ``;
      this.time = new Date();
      this.level = data.lv || 0;
      this.family = data.fam || ``;
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
  class EventEmitter {
    constructor() {
      this.id = 0;
      this.types = {};
      this.handlers = {};
    }
    on(type, handler) {
      const id = ++ this.id;
      if (!this.types[type]) this.types[type] = [];
      this.types[type].push(id);
      this.handlers[id] = { id, type, handler };
      return id
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
      if (ids instanceof Array) {
        ids.forEach(id => {
          const { handler, once } = this.handlers[id];
          if (typeof handler === `function`) handler(data);
          if (once === true) this.off(id);
        });
      }
    }
  }

  class ValkyrieInstance {
    constructor() {
      this.websocket = this.createWebSocket();
      this.worker = this.createWebWorker();
      this.eventEmitter = new EventEmitter();
      this.isDeveloperMode = false;
      this.init();
      this.roles = {};
      this._role = {};
      this.room = { name: ``, path: ``, desc: ``, cmds: [], x: ``, y: `` };
      this.exitList = [];
      this.map = { svg: ``, width: 0, height: 0 };
      this.roleList = [];
      this.score = {};
      this.state = { value: 0, text: ``, detail: `` };
      this.skillList = [];
      this.skillLimit = 0;
      this.packList = [];
      this.equipList = [];
      this.packLimit = 0;
      this.moneyValue = 0;
      this.storeList = [];
      this.storeLimit = 0;
      this.seller = ``;
      this.sellList = [];
      this.chatList = [];
      this.smCount = 20;
      this.smTotal = 99;
      this.smTarget = ``;
      this.ymCount = 20;
      this.ymTotal = 99;
      this.ymTarget = ``;
      this.ymTargetX = ``;
      this.ymTargetY = ``;
      this.ybCount = 20;
      this.ybTotal = 99;
      this.fbCount = 20;
      this.wdCount = 99;
      this.wdTotal = 99;
      this.wdValue = true;
      this.qaValue = true;
      this.xyValue = true;
      this.mpValue = true;
    }
    createWebSocket() {
      return {
        readyState: 0,
        onopen: () => {},
        onclose: () => {},
        onerror: () => {},
        onmessage: () => {},
      }
    }
    createWebWorker() {
      const WORKER_BLOB = new Blob([WORKER_CONTENT]);
      const WORKER_URL = URL.createObjectURL(WORKER_BLOB);
      return new Worker(WORKER_URL)
    }
    init() {
      unsafeWindow.console.log = () => {};
      const handlers = {
        websocketOnopen: () => this.websocket.onopen(),
        websocketOnclose: () => this.websocket.onclose(),
        websocketOnerror: event => this.websocket.onerror(event),
        websocketOnmessage: event => this.onData(this.eventToData(event)),
        setReadyState: value => {
          console.log(`ValkyrieWorker: WebSocket.readyState`, value);
          this.websocket.readyState = value;
        },
      };
      this.worker.onmessage = function(event) {
        const type = event.data.type;
        const args = event.data.args;
        handlers[type](...args);
      };
      const self = this;
      unsafeWindow.WebSocket = function(uri) {
        self.worker.postMessage({ type: `createWebSocket`, args: [uri] });
      };
      unsafeWindow.WebSocket.prototype = {
        set onopen(fn) {
          self.websocket.onopen = fn;
        },
        set onclose(fn) {
          self.websocket.onclose = fn;
        },
        set onerror(fn) {
          self.websocket.onerror = fn;
        },
        set onmessage(fn) {
          self.websocket.onmessage = fn;
        },
        get readyState() {
          return self.websocket.readyState
        },
        send(command) {
          self.sendCommand(command);
        },
      };
    }
    eventToData(event) {
      const data = event.data;
      return data[0] === `{` ? new Function(`return ${ data };`)() : { type: `text`, text: data }
    }
    dataToEvent(data) {
      return data.type === `text` ? { data: data.text } : { data: JSON.stringify(data) }
    }
    onData(data) {
      if (this.isDeveloperMode === true) {
        console.info(JSON.parse(JSON.stringify(data)));
      }
      this.eventEmitter.emit(data.dialog || data.type, data);
      this.websocket.onmessage(this.dataToEvent(data));
    }
    onText(text) {
      this.onData({ type: `text`, text });
    }
    sendCommand(command) {
      this.worker.postMessage({ type: `sendCommand`, args: [command] });
      this.onData({ type: `sendCommand`, command });
    }
    sendCommands(...args) {
      this.worker.postMessage({ type: `sendCommands`, args });
      this.onData({ type: `sendCommands`, args });
    }
    on(type, handler) {
      return this.eventEmitter.on(type, handler.bind(this))
    }
    off(id) {
      this.eventEmitter.off(id);
    }
    hasOwn(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop)
    }
    getCookie(name) {
      const cookies = document.cookie.split(`;`).reduce((cookies, cookieString) => {
        const i = cookieString.indexOf(`=`);
        const name = cookieString.substr(0, i).trim();
        const value = cookieString.substr(i + 1);
        cookies[name] = value;
        return cookies
      }, {});
      return cookies[name]
    }
    setCookie(name, value) {
      document.cookie = `${name}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
      return true
    }
    setLocalRoles(value) {
      if (value instanceof Array) {
        localStorage.setItem(`__roles__`, JSON.stringify(value));
      }
    }
    getLocalRoles() {
      return JSON.parse(localStorage.getItem(`__roles__`) || `[]`)
    }
    get role() {
      return this._role
    }
    set role(value) {
      this._role = value;
      const roles = this.getLocalRoles();
      const index = roles.findIndex(item => item.id === value.id);
      if (index === -1) {
        roles.push(value);
      } else {
        roles[index] = value;
      }
      this.setLocalRoles(roles);
    }
    get wx1() {
      return Number(this.score.int) || 0
    }
    get wx2() {
      return Number(this.score.int_add) || 0
    }
    get xxxl() {
      return parseInt(this.score.study_per ) || 0
    }
    get lxxl() {
      return parseInt(this.score.lianxi_per) || 0
    }
    get lxCost() {
      return parseInt((this.wx1 + this.wx2) * (1 + this.lxxl / 100 - this.wx1 / 100))
    }
    get xxCost() {
      return parseInt((this.wx1 + this.wx2) * (1 + this.xxxl / 100 - this.wx1 / 100) * 3)
    }
    get npcList() {
      return this.roleList.filter(role => role.isNpc)
    }
    get hpPercentage() {
      return parseInt((this.score.hp / this.score.max_hp) * 100) || 0
    }
    get mpPercentage() {
      return parseInt((this.score.mp / this.score.max_mp) * 100) || 0
    }
    get genderValue() {
      return ['女', '男'].findIndex(item => item === this.score.gender)
    }
  }
  var Valkyrie = new ValkyrieInstance();

  Valkyrie.on(`roles`, function(data) {
    if (data.roles instanceof Array) {
      data.roles.forEach(item => {
        const { id, name, title } = item;
        this.roles[id] = { name, title };
      });
    }
  });

  Valkyrie.on(`login`, function(data) {
    const id = data.id;
    if (!id) return
    const name = this.roles[id].name;
    const title = this.roles[id].title;
    const cookies = {
      u: this.getCookie(`u`),
      p: this.getCookie(`p`),
      s: this.getCookie(`s`),
    };
    const token = `${ cookies.u } ${ cookies.p }`;
    const server = [`一区`, `二区`, `三区`, `四区`, `五区`, `六区`][cookies.s];
    this.role = { id, name, title, server, cookies, token };
    unsafeWindow.id = id;
  });

  Valkyrie.on(`room`, function(data) {
    const { name, path, desc, commands } = data;
    this.room.name = name;
    this.room.path = path;
    this.room.desc = desc;
    this.room.cmds.splice(0);
    this.room.cmds.push(...commands);
    const nameList = name.split(/-|\(|\)/);
    this.room.x = nameList[0];
    this.room.y = nameList[1];
  });

  Valkyrie.on(`exits`, function(data) {
    if (data.items instanceof Array) {
      this.exitList.splice(0);
      Object.keys(data.items).forEach(dir => {
        const name = data.items[dir];
        const cmd = `go ${dir}`;
        this.exitList.push({ dir, name, cmd });
      });
    }
  });

  Valkyrie.on(`map`, function(data) {
    const items = data.map;
    if (!data.map) return
    const position = { minX: 99999, minY: 99999, maxX: 0, maxY: 0 };
    items.forEach(item => {
      const [x, y] = item.p;
      if (x < position.minX) position.minX = x;
      if (x > position.maxX) position.maxX = x;
      if (y < position.minY) position.minY = y;
      if (y > position.maxY) position.maxY = y;
    });
    const [offsetX, offsetY] = [0 - position.minX, 0 - position.minY];
    const [unitX, unitY, unitW, unitH] = [100, 50, 60, 20];
    const rects = [];
    const lines = [];
    const texts = [];
    items.forEach(map => {
      const l = (map.p[0] + offsetX) * unitX + 20;
      const t = (map.p[1] + offsetY) * unitY + 20;
      const rect = `<rect x="${l}" y="${t}" fill="dimgrey" stroke-width="1" stroke="gray" width="${unitW}" height="${unitH}"></rect>`;
      rects.push(rect);
      map.exits && map.exits.forEach(exit => {
        const regexp = /^([a-z]{1,2})(\d)?([d|l])?$/;
        if (regexp.test(exit)) {
          const length = RegExp.$2 ? parseInt(RegExp.$2) : 1;
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
          if (a) {
            const line = `<line stroke="gray" x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"`
            + `${RegExp.$3 ? ` stroke-dasharray="5,5"` : ``} stroke-width="${RegExp.$3 === `l` ? 10 : 1}"></line >`;
            lines.push(line);
          }
        }
      });
      const text = `<text x="${l+30}" y="${t+14}" text-anchor="middle" style="font-size:12px;" fill="#232323">${map.n}</text>`;
      texts.push(text);
    });
    const width = (position.maxX + offsetX + 1) * unitX;
    const height = (position.maxY + offsetY + 1) * unitY;
    this.map.svg = `<svg viewBox="0,0,${width},${height}" preserveAspectRatio="xMidYMid meet">`
      + `${rects.join(``)}${lines.join(``)}${texts.join(``)}</svg>`;
    this.map.width = width;
    this.map.height = height;
  });

  Valkyrie.on(`items`, function(data) {
    if (data.items instanceof Array) {
      this.roleList.splice(0);
      data.items.forEach(item => item && this.roleList.push(new Role(item)));
      this.roleList.sort((a, b) => b.sortValue - a.sortValue);
    }
  });

  Valkyrie.on(`itemadd`, function(data) {
    this.roleList.push(new Role(data));
    this.roleList.sort((a, b) => b.sortValue - a.sortValue);
  });

  Valkyrie.on(`itemremove`, function(data) {
    const id = data.id;
    if (!id) return
    const index = this.roleList.findIndex(item => item.id === id);
    if (index !== -1) this.roleList.splice(index, 1);
  });

  Valkyrie.on(`sc`, function(data) {
    const index = this.roleList.findIndex(item => item.id === data.id);
    if (index === -1) return
    if (this.hasOwn(data, `hp`)) this.roleList[index].hp = data.hp;
    if (this.hasOwn(data, `mp`)) this.roleList[index].mp = data.mp;
    if (this.hasOwn(data, `max_hp`)) this.roleList[index].max_hp = data.max_hp;
    if (this.hasOwn(data, `max_mp`)) this.roleList[index].max_mp = data.max_mp;
  });

  function updateScore(data) {
    if (data.id === unsafeWindow.id) {
      Object.keys(data).forEach(key => {
        const ignore = [`type`, `dialog`, `id`];
        if (ignore.includes(key)) return
        this.score[key] = data[key];
      });
    }
  }
  Valkyrie.on(`sc`, updateScore);
  Valkyrie.on(`score`, updateScore);

  Valkyrie.on(`state`, function(data) {
    const index = STATE_LIST.findIndex(state => data.state && data.state.includes(state));
    this.state.value = index + 1;
    this.state.text = STATE_LIST[index] || data.state || ``;
    this.state.detail = ``;
    data.state = this.state.text;
    delete data.desc;
  });

  Valkyrie.on(`pack`, function(data) {
    if (this.hasOwn(data, `money`)) {
      this.moneyValue = Number(data.money) || 0;
    }
    if (this.hasOwn(data, `max_item_count`)) {
      this.packLimit = Number(data.max_item_count) || 0;
    }
    if (this.hasOwn(data, `eqs`)) {
      data.eqs.forEach((eq, index) => (this.equipList[index] = eq));
    }
    if (this.hasOwn(data, `items`) && data.items instanceof Array) {
      this.packList.splice(0);
      data.items.forEach(item => this.packList.push(new Pack(item)));
      this.packList.sort((a, b) => a.sortValue - b.sortValue);
      data.items = this.packList;
    }
  });

  Valkyrie.on(`skills`, function(data) {
    if (this.hasOwn(data, `items`)) {
      this.skillList.splice(0);
      data.items.forEach(item => this.skillList.push(new Skill(item)));
      this.skillList.sort((a, b) => a.sortValue - b.sortValue);
      data.items = this.skillList;
    }
    if (this.hasOwn(data, `limit`)) {
      this.skillLimit = parseInt(data.limit) || 0;
    }
    if (this.hasOwn(data, `item`)) {
      this.skillList.push(new Skill(data.item));
    }
    if (this.hasOwn(data, `id`)) {
      const index = this.skillList.findIndex(skill => skill.id === data.id);
      if (index !== -1) {
        const skill = this.skillList[index];
        if (this.hasOwn(data, `level`)) {
          skill.level = Number(data.level) || 1;
          this.onText(`你的技能${ skill.name }提升到了<hiw>${ skill.level }</hiw>级！`);
        }
        if (this.hasOwn(data, `exp`)) {
          skill._exp = data.exp;
          switch (this.state.text) {
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
        const qnCost = (Math.pow(this.skillLimit, 2) - Math.pow(skill.level, 2)) * skill.k;
        qnCost / this.lxCost / ( 60 / 5);
      }
    }
    if (this.hasOwn(data, `pot`)) {
      this.score.pot = Number(data.pot) || 0;
    }
  });

  Valkyrie.on(`tasks`, function(data) {
    const items = data.items;
    if (!(items instanceof Array)) return
    this.smTarget = ``;
    this.ymTarget = ``;
    this.ymTargetX = ``;
    this.ymTargetY = ``;
    items.forEach(task => {
      const { id, state, title, desc } = task;
      switch (id) {
        case `signin`:
          desc.match(/副本：<[\S]{3}>(\d+)\/20<[\S]{4}>/);
          this.fbCount = Number(RegExp.$1) || 0;
          desc.match(/武道塔([\S]{1,2})重置，进度(\d+)\/(\d+)/);
          this.wdValue = (RegExp.$1 === `已`);
          this.wdCount = Number(RegExp.$2) || 0;
          this.wdTotal = Number(RegExp.$3) || 0;
          this.qaValue = (/还没有给首席请安/.test(desc) === false);
          this.xyValue = (/本周尚未协助襄阳守城/.test(desc) === false);
          this.mpValue = (/尚未挑战门派BOSS/.test(desc) === false);
          break
        case `sm`:
          desc.match(/目前完成(\d+)\/20个，共连续完成(\d+)个/);
          this.smCount = Number(RegExp.$1) || 0;
          this.smTotal = Number(RegExp.$2) || 0;
          if (/你的师门委托你去寻找(\S+)，你可以慢慢寻找/.test(desc)) {
            this.smTarget = RegExp.$1;
          }
          break
        case `yamen`:
          desc.match(/目前完成(\d+)\/20个，共连续完成(\d+)个/);
          this.ymCount = Number(RegExp.$1) || 0;
          this.ymTotal = Number(RegExp.$2) || 0;
          if (/扬州知府委托你追杀逃犯：(\S+)，据说最近在(\S+)-(\S+)出现过/.test(desc)) {
            this.ymTarget = RegExp.$1;
            this.ymTargetX = RegExp.$2;
            this.ymTargetY = RegExp.$3;
          }
          break
        case `yunbiao`:
          desc.match(/本周完成(\d+)\/20个，共连续完成(\d+)个/);
          this.ybCount = Number(RegExp.$1) || 0;
          this.ybTotal = Number(RegExp.$2) || 0;
          break
      }
    });
  });

  Valkyrie.on(`text`, function(data) {
    if (/你获得了(\d+)点经验，(\d+)点潜能/.test(data.text)) {
      this.score.exp += Number(RegExp.$1) || 0;
      this.score.pot += Number(RegExp.$2) || 0;
    }
    if (/^<hiy>你的[\s\S]+等级提升了！<\/hiy>$/.test(data.text)) {
      return delete data.type
    }
    if (/^<hig>你获得了(\d+)点经验，(\d+)点潜能。<\/hig>$/.test(data.text)) {
      data.text = data.text.replace(/<\S+?>/g, ``);
      return
    }
  });

  Valkyrie.on(`list`, function(data) {
    if (this.hasOwn(data, `max_store_count`)) {
      this.storeLimit = Number(data.max_store_count) || 0;
    }
    if (this.hasOwn(data, `stores`)) {
      this.storeList.splice(0);
      data.stores.forEach(item => this.storeList.push(new Pack(item)));
      this.storeList.sort((a, b) => a.sortValue - b.sortValue);
      data.stores = this.storeList;
    }
    if (this.hasOwn(data, `seller`) && this.hasOwn(data, `selllist`)) {
      this.seller = data.seller;
      this.sellList.splice(0);
      data.selllist.forEach(item => this.sellList.push(new Pack(item)));
    }
  });

  Valkyrie.on(`msg`, function(data) {
    this.chatList.push(new Chat(data));
    if (this.chatList.length > 1100) {
      this.chatList.splice(0, 100);
    }
  });

  Valkyrie.on(`custom-command`, function(data) {
    while (/{npc:([\s\S]+?)}/i.test(data.command)) {
      const npc = this.npcList.find(npc => npc.name.includes(RegExp.$1));
      data.command = data.command.replace(/{npc:([\s\S]+?)}/i, npc ? npc.id : `[unkonw id]`);
    }
    this.sendCommand(data.command);
  });

  if (unsafeWindow.Valkyrie) {
    console.error(`Valkyrie is already existed.`);
  }
  unsafeWindow.Valkyrie = Valkyrie;
  unsafeWindow.Vue = Vue;
  unsafeWindow.Element3 = Element3;
  unsafeWindow.gsap = gsap;

}());
