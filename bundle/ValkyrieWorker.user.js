// ==UserScript==
// @name         ValkyrieWorker
// @namespace    https://greasyfork.org/scripts/422783-valkyrieworker
// @version      1.1.46
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @description  文字游戏《武神传说》的浏览器脚本程序的基础库
// @modified     2021/3/30 18:51:56
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

  class Map {
    constructor() {
      this.svg = '';
      this.width = 0;
      this.height = 0;
    }
    updateMap(items) {
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
              const line = `<line stroke="gray"`
              + ` x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"`
              + `${RegExp.$3 ? ' stroke-dasharray="5,5"' : ''}`
              + ` stroke-width="${RegExp.$3 === 'l' ? 10 : 1}"`
              + `></line >`;
              lines.push(line);
            }
          }
        });
        const text = `<text x="${l+30}" y="${t+14}" text-anchor="middle" style="font-size:12px;" fill="#232323">${map.n}</text>`;
        texts.push(text);
      });
      const width = (position.maxX + offsetX + 1) * unitX;
      const height = (position.maxY + offsetY + 1) * unitY;
      this.width = width;
      this.height = height;
      this.svg = `<svg viewBox="0,0,${width},${height}" preserveAspectRatio="xMidYMid meet">${rects.join('')}${lines.join('')}${texts.join('')}</svg>`;
    }
  }

  const setValue = function(key, value) {
    GM_setValue(key, value);
  };
  const getValue = function(key) {
    return GM_getValue(key)
  };
  const setElementAttributes = function(element, attributes) {
    Object.keys(attributes).forEach(key => {
      if (key === 'innerHTML') {
        element.innerHTML = attributes[key];
      } else if (key === 'innerText') {
        element.innerText = attributes[key];
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });
  };
  const setAttribute = function(selector, attributes) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => setElementAttributes(element, attributes));
  };
  const createElement = function(tagName, attributes) {
    const element = document.createElement(tagName);
    setElementAttributes(element, attributes);
    return element
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

  var common = /*#__PURE__*/Object.freeze({
    __proto__: null,
    setValue: setValue,
    getValue: getValue,
    setAttribute: setAttribute,
    createElement: createElement,
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
    get nameList() {
      return this.name.split(/-|\(|\)/)
    }
    get x() {
      return this.nameList[0]
    }
    get y() {
      return this.nameList[1]
    }
    get npcList() {
      return this.list.filter(item => item.isNpc)
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

  var PackList = [
    '神魂碎片',
    '<hio>武道</hio>',
    '<hio>武道残页</hio>',
    '元晶',
    '帝魄碎片',
    '玄晶',
    '周年庆徽章',
    '技能重置卡',
    '师门补给包',
    '背包扩充石',
    '随从礼包',
    '小箱子',
    '玫瑰花',
    '召唤令',
    '补签卡',
    '藏宝图',
    '鱼饵',
    '月饼',
    '朱果',
    '潜灵果',
    '顿悟丹',
    '养精丹',
    '培元丹',
    '聚气丹',
    '突破丹',
    '冰心丹',
    '玄灵丹',
    '扫荡符',
    '天师符',
    '叛师符',
    '洗髓丹',
    '变性丹',
    '喜宴',
    '师门令牌',
    '铁镐',
    '钓鱼竿',
    '药王神篇',
    '红宝石',
    '绿宝石',
    '蓝宝石',
    '黄宝石',
    '碎裂的破军',
    '碎裂的贪狼',
    '碎裂的七杀',
    '碎裂的紫薇',
    '破军',
    '贪狼',
    '七杀',
    '紫薇',
    '秘籍',
    '残页',
    '鲤鱼',
    '草鱼',
    '鲢鱼',
    '鲮鱼',
    '鳊鱼',
    '鲂鱼',
    '黄金鳉',
    '黄颡鱼',
    '太湖银鱼',
    '虹鳟',
    '孔雀鱼',
    '反天刀',
    '银龙鱼',
    '黑龙鱼',
    '罗汉鱼',
    '巨骨舌鱼',
    '七星刀鱼',
    '帝王老虎魟',
    '当归',
    '芦荟',
    '山楂叶',
    '柴胡',
    '金银花',
    '石楠叶',
    '茯苓',
    '沉香',
    '熟地黄',
    '九香虫',
    '络石藤',
    '冬虫夏草',
    '人参',
    '何首乌',
    '凌霄花',
    '灵芝',
    '天仙藤',
    '盘龙参',
    '四十二章经一',
    '四十二章经二',
    '四十二章经三',
    '四十二章经四',
    '四十二章经五',
    '四十二章经六',
    '四十二章经七',
    '四十二章经八',
    '★',
    '☆',
  ];

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
    get sort() {
      const index = PackList.findIndex(name => this.name.includes(name));
      return this.color + (index === -1 ? 10000 : (index * 10))
    }
    get isEquip() {
      return this.can_eq === 1
    }
  }

  class Pack {
    constructor() {
      this.packList = [];
      this.packLimit = 0;
      this.equipList = Array(11);
      this.storeList = [];
      this.storeLimit = 0;
      this.money = 0;
      this.shopId = '';
      this.shopList = [];
    }
    updatePack(data) {
      if (hasOwn(data, 'money')) this.money = parseInt(data.money) || 0;
      if (hasOwn(data, 'max_item_count')) this.packLimit = parseInt(data.max_item_count) || 0;
      if (hasOwn(data, 'eqs')) data.eqs.forEach((eq, index) => (this.equipList[index] = eq));
      if (hasOwn(data, 'items')) {
        this.packList.splice(0);
        data.items.forEach(item => this.packList.push(new PackItem(item)));
        this.packList.sort((a, b) => a.sort - b.sort);
      }
    }
    updateStore(data) {
      if (hasOwn(data, 'max_store_count')) {
        this.storeLimit = Number(data.max_store_count) || 0;
      }
      if (hasOwn(data, 'stores')) {
        this.storeList.splice(0);
        data.stores.forEach(item => this.storeList.push(new PackItem(item)));
        this.storeList.sort((a, b) => a.sort - b.sort);
      }
    }
    updateShop(data) {
      if (hasOwn(data, 'seller') && hasOwn(data, 'selllist')) {
        this.shopId = data.seller;
        this.shopList.splice(0);
        data.selllist.forEach(item => this.shopList.push(new PackItem(item)));
      }
    }
  }

  class Task {
    constructor() {
      this.smCount = 20;
      this.smTotal = 99;
      this.smTarget = '';
      this.ymCount = 20;
      this.ymTotal = 99;
      this.ymTarget = '';
      this.ymTargetX = '';
      this.ymTargetY = '';
      this.ybCount = 20;
      this.ybTotal = 99;
      this.fbCount = 20;
      this.wdCount = 99;
      this.wdTotal = 99;
      this.wdValue = true;
      this.qaValue = true;
      this.xyValue = true;
      this.mpValue = true;
      this.activity = {};
    }
    updateTask(items) {
      this.smTarget = '';
      this.ymTarget = '';
      this.ymTargetX = '';
      this.ymTargetY = '';
      this.activity = {};
      items.forEach(task => {
        const { id, state, title, desc } = task;
        switch (id) {
          case 'signin':
            desc.match(/副本：<[\S]{3}>(\d+)\/20<[\S]{4}>/);
            this.fbCount = Number(RegExp.$1) || 0;
            desc.match(/武道塔([\S]{1,2})重置，进度(\d+)\/(\d+)/);
            this.wdValue = (RegExp.$1 === '已');
            this.wdCount = Number(RegExp.$2) || 0;
            this.wdTotal = Number(RegExp.$3) || 0;
            this.qaValue = (/还没有给首席请安/.test(desc) === false);
            this.xyValue = (/本周尚未协助襄阳守城/.test(desc) === false);
            this.mpValue = (/尚未挑战门派BOSS/.test(desc) === false);
            break
          case 'sm':
            desc.match(/目前完成(\d+)\/20个，共连续完成(\d+)个/);
            this.smCount = Number(RegExp.$1) || 0;
            this.smTotal = Number(RegExp.$2) || 0;
            if (/你的师门委托你去寻找(\S+)，你可以慢慢寻找/.test(desc)) {
              this.smTarget = RegExp.$1;
            }
            break
          case 'yamen':
            desc.match(/目前完成(\d+)\/20个，共连续完成(\d+)个/);
            this.ymCount = Number(RegExp.$1) || 0;
            this.ymTotal = Number(RegExp.$2) || 0;
            if (/扬州知府委托你追杀逃犯：(\S+)，据说最近在(\S+)-(\S+)出现过/.test(desc)) {
              this.ymTarget = RegExp.$1;
              this.ymTargetX = RegExp.$2;
              this.ymTargetY = RegExp.$3;
            }
            break
          case 'yunbiao':
            desc.match(/本周完成(\d+)\/20个，共连续完成(\d+)个/);
            this.ybCount = Number(RegExp.$1) || 0;
            this.ybTotal = Number(RegExp.$2) || 0;
            break
          default:
            this.activity = { id, state, title, desc };
            if (state === 2)
            break
        }
      });
    }
  }

  class SkillItem {
    constructor(data) {
      this.id = data.id;
      this.name = data.name;
      this.level = Number(data.level) || 0;
      this.can_enables = data.can_enables || undefined;
      this.enable_skill = data.enable_skill || '';
      this.exp = 0;
      this.updateExp(data.exp);
    }
    updateExp(value) {
      value = Number(value) || 0;
      this.exp = (value <= 10) ? 10 : parseInt(value / 5) * 5;
    }
    get nameText() {
      return this.name.replace(/<.+?>/g, '')
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
          'lianyao',
        ].findIndex(item => item === this.id) + 1
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
        this.list.sort((a, b) => a.sort - b.sort);
      }
      if (hasOwn(data, 'limit')) this.limit = parseInt(data.limit) || 0;
      if (hasOwn(data, 'item')) this.list.push(new SkillItem(data.item));
      if (hasOwn(data, 'id')) {
        const index = this.list.findIndex(skill => skill.id === data.id);
        if (index !== -1 && hasOwn(data, 'level')) this.list[index].level = parseInt(data.level) || 0;
        if (index !== -1 && hasOwn(data, 'exp')) this.list[index].updateExp(data.exp);
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
    map: new Map(),
    room: new Room(),
    pack: new Pack(),
    state: new State(),
    score: new Score(),
    skill: new Skill(),
    storage: new Storage(),
    channel: new Channel(),
    task: new Task(),
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

  var ValkyrieWorkerContent = "const worker = {\n  websocket: undefined,\n  commands: [],\n  sendState: false,\n}\nconst handlers = {\n  createWebSocket(uri) {\n    worker.websocket = new WebSocket(uri)\n    worker.websocket.onopen = function() {\n      console.log('ValkyrieWorker: WebSocket.onopen')\n      postMessage({ type: 'setReadyState', args: [worker.websocket.readyState] })\n      postMessage({ type: 'websocketOnopen', args: [] })\n    }\n    worker.websocket.onclose = function() {\n      console.log('ValkyrieWorker: WebSocket.onclose')\n      postMessage({ type: 'setReadyState', args: [worker.websocket.readyState] })\n      postMessage({ type: 'websocketOnclose', args: [] })\n    }\n    worker.websocket.onerror = function() {\n      console.log('ValkyrieWorker: WebSocket.onerror')\n      postMessage({ type: 'setReadyState', args: [worker.websocket.readyState] })\n      postMessage({ type: 'websocketOnerror', args: [] })\n    }\n    worker.websocket.onmessage = function(event) {\n      postMessage({ type: 'websocketOnmessage', args: [{ data: event.data }] })\n    }\n  },\n  sendCommand(command) {\n    worker.websocket.send(command)\n  },\n  sendCommands(...args) {\n    args = args.flat(Infinity)\n    args.forEach((item, index) => (/,/.test(item)) && (args[index] = item.split(',')))\n    args = args.flat(Infinity)\n    worker.commands.push(...args)\n    if (worker.sendState === false) {\n      worker.sendState = true\n      sendLoop(0)\n    }\n  },\n}\nfunction sendLoop(ms = 256) {\n  const command = worker.commands.splice(0, 1)[0]\n  if (command === undefined) {\n    worker.sendState = false\n    return\n  }\n  if (isNaN(Number(command)) === false) {\n    sendLoop(Number(command))\n    return\n  }\n  if (typeof command === 'string' && command.includes('{') && command.includes('}')) {\n    setTimeout(() => {\n      const data = JSON.stringify({ type: 'custom-command', command })\n      postMessage({ type: 'websocketOnmessage', args: [{ data }] })\n      sendLoop()\n    }, ms)\n    return\n  }\n  if (typeof command === 'string') {\n    setTimeout(() => {\n      handlers.sendCommand(command)\n      sendLoop()\n    }, ms)\n  }\n}\nonmessage = function(event) {\n  try {\n    const type = event.data.type\n    const args = event.data.args\n    handlers[type](...args)\n  } catch (error) {\n    console.error(error)\n  }\n}\n";

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
  }

  (function() {
    if (unsafeWindow.Valkyrie) return
    unsafeWindow.Vue = Vue;
    unsafeWindow.Element3 = Element3;
    unsafeWindow.Valkyrie = Valkyrie;
    unsafeWindow.ValkyrieWorker = new ValkyrieWorker();
    unsafeWindow.gsap = gsap;
    unsafeWindow.common = common;
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
    on('pack', data => Valkyrie.pack.updatePack(data));
    on('list', data => Valkyrie.pack.updateStore(data));
    on('list', data => Valkyrie.pack.updateShop(data));
    on('msg', data => Valkyrie.channel.updateMessage(data));
    on('map', data => Valkyrie.map.updateMap(data.map));
    on('tasks', data => Valkyrie.task.updateTask(data.items));
    on('score', data => Valkyrie.score.updateScore(data));
    on('sc', data => Valkyrie.score.updateScore(data));
    on('login', data => {
      if (data.id) Valkyrie.score.id = data.id;
    });
    on('text', data => {
      if (/你获得了(\d+)点经验，(\d+)点潜能/.test(data.text)) {
        Valkyrie.score.exp += Number(RegExp.$1) || 0;
        Valkyrie.score.pot += Number(RegExp.$2) || 0;
      }
    });
    on('custom-command', data => {
      console.log(data.command);
      if (/{npc:([\s\S]+?)}/i.test(data.command)) {
        console.log(RegExp.$1);
        const npc = Valkyrie.room.npcList.find(npc => npc.name.includes(RegExp.$1));
        data.command = data.command.replace(/{npc:([\s\S]+?)}/i, npc ? npc.id : '[unkonw id]');
      }
      if (typeof data.command === 'string' && data.command.includes('{') && data.command.includes('}')) {
        const data = { type: 'custom-command', command: data.command };
        unsafeWindow.ValkyrieWorker.onData(data);
      } else {
        unsafeWindow.ValkyrieWorker.sendCommand(data.command);
      }
    });
  })();

}());
