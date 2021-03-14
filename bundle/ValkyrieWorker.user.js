// ==UserScript==
// @name         ValkyrieWorker
// @namespace    https://greasyfork.org/scripts/422783-valkyrieworker
// @version      1.1.2
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @description  文字游戏《武神传说》的浏览器脚本程序的基础库
// @modified     2021/3/14 14:17:51
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

/* eslint-env es6 */
/* global Vue:readonly Element3:readonly gsap:readonly */

(function () {
  'use strict';

  const setValue = function(key, value) {
    GM_setValue(key, value);
  };
  const getValue = function(key) {
    return GM_getValue(key)
  };
  const addStyle = function(style) {
    GM_addStyle(style);
  };
  const createElement = function(tagName, attributes) {
    const element = document.createElement(tagName);
    Object.keys(attributes).forEach(key => {
      if (key === 'textContent')
        element.innerText = attributes[key];
      else
        element.setAttribute(key, attributes[key]);
    });
    return element
  };
  const addStyleByURL = function(url) {
    const link = createElement('link', { href: url, rel: 'stylesheet' });
    document.head.appendChild(link);
  };
  const appendElement = function(parentNode, tagName, attributes) {
    const element = createElement(tagName, attributes);
    parentNode.appendChild(element);
  };
  const insertElement = function(parentNode, nextNode, tagName, attributes) {
    const element = createElement(tagName, attributes);
    parentNode.insertBefore(element, nextNode);
  };
  const removeElement = function(parentNode, childNode) {
    parentNode.removeChild(childNode);
  };
  const hasOwn = function(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop)
  };
  const getCookie = function(name) {
    const cookies = document.cookie.split(';').reduce((cookies, cookieString) => {
      const i = cookieString.indexOf('=');
      const name = cookieString.substr(0, i).trim();
      const value = cookieString.substr(i + 1);
      cookies[name] = value;
      return cookies
    }, {});
    return cookies[name]
  };
  const getColorSortByName = function(name) {
    const index = [
      /^<(hiw|wht)>/i,
      /^<hig>/i,
      /^<hic>/i,
      /^<hiy>/i,
      /^<hiz>/i,
      /^<hio>/i,
      /^<(hir|ord)>/i,
    ].findIndex(regexp => regexp.test(name));
    if (index === -1 && /^<...>/i.test(name)) console.error(name);
    return index + 1
  };

  var Common = /*#__PURE__*/Object.freeze({
    __proto__: null,
    setValue: setValue,
    getValue: getValue,
    addStyle: addStyle,
    createElement: createElement,
    addStyleByURL: addStyleByURL,
    appendElement: appendElement,
    insertElement: insertElement,
    removeElement: removeElement,
    hasOwn: hasOwn,
    getCookie: getCookie,
    getColorSortByName: getColorSortByName
  });

  class Role {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.hp = data.hp || 0;
      this.mp = data.mp || 0;
      this.max_hp = data.max_hp || 0;
      this.max_mp = data.max_mp || 0;
      this.status = data.status || [];
      this.p = data.p || 0;
    }
    get isSelf() {
      return this.id === unsafeWindow.ID
    }
    get isPlayer() {
      return this.p === 1
    }
    get isOffline() {
      return this.name.includes('<red>&lt;断线中&gt;</red>')
    }
    get isNpc() {
      return !this.isPlayer
    }
    get color() {
      return getColorSortByName(this.name)
    }
    get sort() {
      if (this.isSelf) return 0
      if (this.isNpc) return this.color
      return this.color + this.isOffline ? 2000 : 1000
    }
  }

  class Room {
    constructor() {
      this.name = '';
      this.path = '';
      this.desc = '';
      this.cmds = [];
      this.list = [];
      this.exit = {};
      this.dirs = {};
    }
    updateRoom(data) {
      const { name, path, desc, commands } = data;
      this.name = name;
      this.path = path;
      this.desc = desc;
      this.cmds.splice(0);
      this.cmds.push(...commands);
    }
    updateExit(items) {
      Object.keys(this.exit).forEach(key => delete this.exit[key]);
      Object.keys(this.dirs).forEach(key => delete this.dirs[key]);
      Object.keys(items).forEach(dir => {
        const name = items[dir];
        this.exit[name] = `go ${dir}`;
        this.dirs[dir] = name;
      });
    }
    updateItems(items) {
      this.list.splice(0);
      items.forEach(item => item && this.list.push(new Role(item)));
      this.list.sort((a, b) => b.sort - a.sort);
    }
    updateItemadd(item) {
      this.list.push(new Role(item));
      this.list.sort((a, b) => b.sort - a.sort);
    }
    updateItemremove(id) {
      const index = this.list.findIndex(item => item.id === id);
      if (index !== -1) this.list.splice(index, 1);
    }
    updateSc(data) {
      const index = this.list.findIndex(item => item.id === data.id);
      if (index === -1) return
      const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
      if (hasOwn(data, 'hp')) this.list[index].hp = data.hp;
      if (hasOwn(data, 'mp')) this.list[index].mp = data.mp;
      if (hasOwn(data, 'max_hp')) this.list[index].max_hp = data.max_hp;
      if (hasOwn(data, 'max_mp')) this.list[index].max_mp = data.max_mp;
    }
  }

  class PackItem {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.count = data.count;
      this.unit = data.unit;
      this.value = data.value || 0;
      this.can_eq = data.can_eq || 0;
      this.can_use = data.can_use || 0;
      this.can_study = data.can_study || 0;
      this.can_combine = data.can_combine || 0;
    }
    get color() {
      return getColorSortByName(this.name)
    }
    get isEquip() {
      return this.can_eq === 1
    }
  }

  class Pack {
    constructor() {
      this.packList = [];
      this.equipList = [];
      this.limit = 0;
      this.money = 0;
    }
    updatePack(data) {
      if (hasOwn(data, 'money')) this.money = parseInt(data.money) || 0;
      if (hasOwn(data, 'max_item_count')) this.limit = parseInt(data.max_item_count) || 0;
      if (hasOwn(data, 'eqs')) data.eqs.forEach((eq, index) => (this.equipList[index] = eq));
      if (hasOwn(data, 'items')) {
        this.packList.splice(0);
        data.items.forEach(item => this.packList.push(new PackItem(item)));
        this.packList.sort((a, b) => b.sort - a.sort);
      }
    }
  }

  class SkillItem {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.level = Number(data.level) || 0;
      this.exp = Number(data.exp) || 0;
      this.can_enables = data.can_enables || [];
      this.enable_skill = data.enable_skill || '';
    }
    get color() {
      return getColorSortByName(this.name)
    }
    get k() {
      return this.color * 2.5
    }
    get sort() {
      if (this.color === 1) {
        return [
          'force',
          'unarmed',
          'dodge',
          'parry',
          'sword',
          'blade',
          'club',
          'staff',
          'whip',
          'throwing',
          'literate',
        ].findIndex(item => this.id) + 1
      }
      return (100000 - this.level) + (10 - this.color) / 2
    }
  }

  class Skill {
    constructor() {
      this.list = [];
      this.limit = 0;
      this.wx1 = 0;
      this.wx2 = 0;
      this.xxxl = 0;
      this.lxxl = 0;
      this.qn = 0;
    }
    updateSkills(data) {
      const hasOwn = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
      if (hasOwn(data, 'items')) {
        this.list.splice(0);
        data.items.forEach(item => this.list.push(new SkillItem(item)));
        this.list.sort((a, b) => b.sort - a.sort);
      }
      if (hasOwn(data, 'limit')) this.limit = parseInt(data.limit) || 0;
      if (hasOwn(data, 'item')) this.list.push(new SkillItem(data.item));
      if (hasOwn(data, 'id')) {
        const index = this.list.findIndex(skill => skill.id === data.id);
        if (index !== -1 && hasOwn(data, 'level')) this.list[index].level = parseInt(data.level) || 0;
        if (index !== -1 && hasOwn(data, 'exp')) this.list[index].exp = parseInt(data.exp) || 0;
      }
      if (hasOwn(data, 'pot')) this.qn = parseInt(data.pot) || 0;
    }
  }

  const StateList = [
    '打坐',
    '疗伤',
    '读书',
    '学习',
    '练习',
    '工作',
    '挖矿',
    '采药',
    '钓鱼',
    '炼药',
    '闭关',
    '领悟',
    '聚魂',
    '推演',
  ];

  class State {
    constructor() {
      this.value = 0;
      this.text1 = '';
      this.text2 = '';
    }
    updateState(text1, text2) {
      const index = StateList.findIndex(state => text1 && text1.includes(state));
      this.value = index + 1;
      this.text1 = StateList[index] || text1 || '';
      this.text2 = text2 || '';
    }
  }

  class Score {
    constructor() {
    }
    updateScore(data) {
      if (data.id === unsafeWindow.ID) {
        Object.keys(data).forEach(key => (this[key] = data[key]));
      }
    }
  }

  class Storage {
    constructor() {
      this.roles = {};
    }
    set id(value) {
      unsafeWindow.ID = value;
      const id = value;
      const name = this.roles[id].name;
      const title = this.roles[id].title;
      const cookies = { u: getCookie('u'), p: getCookie('p'), s: getCookie('s') };
      const token = `${ cookies.u } ${ cookies.p }`;
      const server = ['一区', '二区', '三区', '四区', '测试'][cookies.s];
      const role = getValue(id) || {};
      role.id = id;
      role.name = name;
      role.title = title;
      role.cookies = cookies;
      role.token = token;
      role.server = server;
      setValue(id, role);
      const roles = getValue('ids') || [];
      const index = roles.findIndex(role => role.id === id);
      if (index === -1) roles.push({ id, name });
      setValue('ids', roles);
    }
    get id() {
      return unsafeWindow.ID
    }
    updateRoles(roles) {
      roles.forEach(role => (this.roles[role.id] = { name: role.name, title: role.title }));
    }
    updateId(id) {
      this.id = id;
    }
  }

  class ChannelItem {
    constructor(data) {
      this.id = data.uid || '';
      this.channel = data.ch;
      this.content = data.content.trim().replace(/\n/g, '<br>');
      this.name = data.name || '';
      this.time = new Date();
      this.level = data.lv || 0;
      this.family = data.fam || '';
      this.server = data.server || '';
    }
    get isSelf() { return this.id === unsafeWindow.ID}
    get isTm() { return this.channel === 'tm' }
    get isEs() { return this.channel === 'es' }
    get isFa() { return this.channel === 'fam' }
    get isSy() { return this.channel === 'sys' }
    get isPt() { return this.channel === 'pty' }
    get isCh() { return this.channel === 'chat' }
    get isRu() { return this.channel === 'rumor' }
    get cmd() { return `look3 ${this.id}` }
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
    get timeText() {
      return new Date(this.time).toLocaleTimeString('en-DE')
    }
  }

  class Channel {
    constructor() {
      this.list = [];
    }
    updateMessage(data) {
      this.list.push(new ChannelItem(data));
    }
  }

  const Valkyrie = Vue.reactive({
    room: new Room(),
    pack: new Pack(),
    state: new State(),
    score: new Score(),
    skill: new Skill(),
    storage: new Storage(),
    channel: new Channel(),
  });

  class EventEmitter {
    constructor() {
      this.id = 0;
      this.types = {};
      this.handlers = {};
    }
    on(type, handler, once = false) {
      const id = ++ this.id;
      if (!this.types[type]) this.types[type] = [];
      this.types[type].push(id);
      this.handlers[id] = { id, type, handler, once };
      return id
    }
    once(type, handler) {
      return this.on(type, handler, true)
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
          if (typeof handler === 'function') handler(data);
          if (once === true) this.off(id);
        });
      }
    }
  }

  var ValkyrieWorkerContent = "const worker = {\n  websocket: undefined,\n  commands: [],\n}\nconst handlers = {\n  createWebSocket(uri) {\n    worker.websocket = new WebSocket(uri)\n    worker.websocket.onopen = function() {\n      console.log('ValkyrieWorker: WebSocket.onopen')\n      postMessage({ type: 'setReadyState', args: [worker.websocket.readyState] })\n      postMessage({ type: 'websocketOnopen', args: [] })\n    }\n    worker.websocket.onclose = function() {\n      console.log('ValkyrieWorker: WebSocket.onclose')\n      postMessage({ type: 'setReadyState', args: [worker.websocket.readyState] })\n      postMessage({ type: 'websocketOnclose', args: [] })\n    }\n    worker.websocket.onerror = function() {\n      console.log('ValkyrieWorker: WebSocket.onerror')\n      postMessage({ type: 'setReadyState', args: [worker.websocket.readyState] })\n      postMessage({ type: 'websocketOnerror', args: [] })\n    }\n    worker.websocket.onmessage = function(event) {\n      postMessage({ type: 'websocketOnmessage', args: [{ data: event.data }] })\n    }\n  },\n  sendCommand(command) {\n    worker.websocket.send(command)\n  },\n  sendCommands(...args) {\n    args = args.flat(Infinity)\n    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(',')))\n    args = args.flat(Infinity)\n    worker.commands.push(...args)\n    if (worker.commands.length === args.length) sendLoop(0)\n  },\n}\nfunction sendLoop(ms = 256) {\n  const command = worker.commands.splice(0, 1)[0]\n  if (command === undefined) return\n  if (isNaN(Number(command)) === false) {\n    sendLoop(Number(command))\n    return\n  }\n  if (typeof command === 'string') {\n    setTimeout(() => {\n      handlers.sendCommand(command)\n      sendLoop()\n    }, ms)\n  }\n}\nonmessage = function(event) {\n  try {\n    const type = event.data.type\n    const args = event.data.args\n    handlers[type](...args)\n  } catch (error) {\n    console.error(error)\n  }\n}\n";

  const workerBlob = new Blob([ValkyrieWorkerContent]);
  const workerURL = URL.createObjectURL(workerBlob);
  const eventToData = function(event) {
    const data = event.data;
    return data[0] === '{' ? new Function(`return ${ data };`)() : { 'type': 'text', 'text': data }
  };
  const dataToEvent = function(data) {
    return data.type === 'text' ? { data: data.text } : { data: JSON.stringify(data) }
  };
  class ValkyrieWorker {
    constructor() {
      this.websocket = {
        readyState: 0,
        onopen: () => {},
        onclose: () => {},
        onerror: () => {},
        onmessage: () => {},
      };
      this.eventEmitter = new EventEmitter();
      this.worker = new Worker(workerURL);
      this.debugMode = false;
      const handlers = {
        websocketOnopen: () => this.websocket.onopen(),
        websocketOnclose: () => this.websocket.onclose(),
        websocketOnerror: event => this.websocket.onerror(event),
        websocketOnmessage: event => {
          const data = eventToData(event);
          this.onData(data);
        },
        setReadyState: value => {
          console.log('ValkyrieWorker: WebSocket.readyState', value);
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
        self.worker.postMessage({ type: 'createWebSocket', args: [uri] });
      };
      unsafeWindow.WebSocket.prototype = {
        set onopen(fn) { self.websocket.onopen = fn; },
        set onclose(fn) { self.websocket.onclose = fn; },
        set onerror(fn) { self.websocket.onerror = fn; },
        set onmessage(fn) { self.websocket.onmessage = fn; },
        get readyState() { return self.websocket.readyState },
        send(command) { self.sendCommand(command); },
      };
    }
    onData(data) {
      if (this.debugMode === true) console.info(JSON.parse(JSON.stringify(data)));
      const type = data.dialog || data.type;
      this.eventEmitter.emit(type, data);
      const event = dataToEvent(data);
      this.websocket.onmessage(event);
    }
    onText(text) {
      this.onData({ type: 'text', text });
    }
    sendCommand(command) {
      this.worker.postMessage({ type: 'sendCommand', args: [command] });
      this.onData({ type: 'sendCommand', command });
    }
    sendCommands(...args) {
      this.worker.postMessage({ type: 'sendCommands', args });
      this.onData({ type: 'sendCommands', args });
    }
    on(type, handler) {
      return this.eventEmitter.on(type, handler)
    }
    once(type, handler) {
      return this.eventEmitter.once(type, handler)
    }
    off(id) {
      this.eventEmitter.off(id);
    }
    hasOwn(any, name) {
      return Object.prototype.hasOwnProperty.call(any, name)
    }
    isArray(any) {
      return any instanceof Array
    }
    isString(any) {
      return typeof any === 'string'
    }
    setCookie(name, value) {
      document.cookie = name + '=' + value;
    }
    getCookie(name) {
      const cookies = document.cookie.split(';').reduce((cookies, cookieString) => {
        const i = cookieString.indexOf('=');
        const name = cookieString.substr(0, i).trim();
        const value = cookieString.substr(i + 1);
        cookies[name] = value;
        return cookies
      }, {});
      return cookies[name]
    }
    deleteCookie(name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    createElement(tag, options) {
      const element = document.createElement(tag);
      Object.keys(options).forEach(name => element.setAttribute(name, options[name]));
      return element
    }
    setValue(key, value) {
      GM_setValue(key, value);
    }
    getValue(key) {
      GM_getValue(key);
    }
    copyToClipboard(data) {
      GM_setClipboard(data, 'text');
    }
    downloadByURL(url, filename) {
      GM_download(url, filename);
    }
    httpRequest(options) {
      GM_xmlhttpRequest(options);
    }
  }

  (function() {
    if (unsafeWindow.Valkyrie) return
    unsafeWindow.Vue = Vue;
    unsafeWindow.Element3 = Element3;
    unsafeWindow.Valkyrie = Valkyrie;
    unsafeWindow.ValkyrieWorker = new ValkyrieWorker();
    unsafeWindow.gsap = gsap;
    unsafeWindow.common = Common;
    unsafeWindow.console.log = _=>_;
    const on = (type, handler) => unsafeWindow.ValkyrieWorker.on(type, handler);
    on('roles', data => Valkyrie.storage.updateRoles(data.roles));
    on('login', data => Valkyrie.storage.updateId(data.id));
    on('state', data => Valkyrie.state.updateState(data.state));
    on('room', data => Valkyrie.room.updateRoom(data));
    on('exits', data => Valkyrie.room.updateExit(data.items));
    on('items', data => Valkyrie.room.updateItems(data.items));
    on('itemadd', data => Valkyrie.room.updateItemadd(data));
    on('itemremove', data => Valkyrie.room.updateItemremove(data.id));
    on('sc', data => Valkyrie.room.updateSc(data));
    on('skills', data => Valkyrie.skill.updateSkills(data));
    on('score', data => Valkyrie.score.updateScore(data));
    on('pack', data => Valkyrie.pack.updatePack(data));
    on('msg', data => Valkyrie.channel.updateMessage(data));
  })();

}());
