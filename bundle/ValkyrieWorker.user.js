// ==UserScript==
// @name         ValkyrieWorker
// @namespace    https://greasyfork.org/scripts/422783-valkyrieworker
// @version      1.0.22
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @description  《武神传说》脚本程序的前置库
// @match        http://*.wsmud.com/*
// @modified     2021/3/8 16:42:11
// @license      MIT
// @icon         https://cdn.jsdelivr.net/gh/coderzhaoziwei/ValkyrieWorker/source/image/wakuang.png
// @require      https://cdn.jsdelivr.net/gh/coderzhaoziwei/ValkyrieWorker/source/package/vue@3.0.7.global.js
// @require      https://cdn.jsdelivr.net/gh/coderzhaoziwei/ValkyrieWorker/source/package/element3@0.0.38.global.js
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

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

  var ValkyrieWorkerContent = "var websocket\nconst handlers = {\n  createWebSocket(uri) {\n    websocket = new WebSocket(uri)\n    websocket.onopen = function(event) {\n      console.log('ValkyrieWorker: WebSocket.onopen', event)\n      postMessage({ type: 'setReadyState', args: [websocket.readyState] })\n      postMessage({ type: 'websocketOnopen', args: [] })\n    }\n    websocket.onclose = function(event) {\n      console.log('ValkyrieWorker: WebSocket.onclose', event)\n      postMessage({ type: 'setReadyState', args: [websocket.readyState] })\n      postMessage({ type: 'websocketOnclose', args: [] })\n    }\n    websocket.onerror = function(event) {\n      console.log('ValkyrieWorker: WebSocket.onerror', event)\n      postMessage({ type: 'setReadyState', args: [websocket.readyState] })\n      postMessage({ type: 'websocketOnerror', args: [] })\n    }\n    websocket.onmessage = function(event) {\n      postMessage({ type: 'websocketOnmessage', args: [{ data: event.data }] })\n    }\n  },\n  sendCommand(command) {\n    websocket.send(command)\n  },\n}\nonmessage = function(event) {\n  try {\n    const type = event.data.type\n    const args = event.data.args\n    handlers[type](...args)\n  } catch (error) {\n    console.error(error)\n  }\n}\n";

  const workerBlob = new Blob([ValkyrieWorkerContent]);
  const workerURL = URL.createObjectURL(workerBlob);
  class ValkyrieWorker {
    constructor() {
      this.Vue = Vue;
      this.Element3 = Element3;
      this.websocket = {
        readyState: 0,
        onopen: () => {},
        onclose: () => {},
        onerror: () => {},
        onmessage: () => {},
      };
      this.eventEmitter = new EventEmitter();
      this.worker = new Worker(workerURL);
      const self = this;
      const handlers = {
        setReadyState(value) {
          console.log('ValkyrieWorker: websocket.readyState =', value);
          self.websocket.readyState = value;
        },
        websocketOnopen() {
          self.websocket.onopen();
        },
        websocketOnclose() {
          self.websocket.onclose();
        },
        websocketOnerror(event) {
          self.websocket.onerror(event);
        },
        websocketOnmessage(event) {
          const data = self.eventToData(event);
          self.ondata(data);
        },
      };
      self.worker.onmessage = function(event) {
        try {
          const type = event.data.type;
          const args = event.data.args;
          handlers[type](...args);
        } catch (error) {
          console.log(event.data);
          console.error(error);
        }
      };
      unsafeWindow.WebSocket = function(uri) {
        self.worker.postMessage({ type: 'createWebSocket', args: [uri] });
      };
      unsafeWindow.WebSocket.prototype = {
        set onopen(fn)    { self.websocket.onopen    = fn;    },
        set onclose(fn)   { self.websocket.onclose   = fn;    },
        set onerror(fn)   { self.websocket.onerror   = fn;    },
        set onmessage(fn) { self.websocket.onmessage = fn;    },
        get readyState()  { return self.websocket.readyState },
        send(command) {
          self.worker.postMessage({ type: 'sendCommand', args: [command] });
        },
      };
    }
    ondata(data) {
      const type = data.dialog || data.type;
      this.eventEmitter.emit(type, data);
      const event = this.dataToEvent(data);
      this.websocket.onmessage(event);
    }
    ontext(text) {
      this.ondata({ type: 'text', text });
    }
    on(type, handler) {
      this.eventEmitter.on(type, handler);
    }
    once(type, handler) {
      this.eventEmitter.once(type, handler);
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
    eventToData(event) {
      const data = event.data;
      return data[0] === '{' ? new Function(`return ${ data };`)() : { 'type': 'text', 'text': data }
    }
    dataToEvent(data) {
      return data.type === 'text' ? { data: data.text } : { data: JSON.stringify(data) }
    }
    getColorIdByName(name) {
      const index = [
        /^<wht>/i,
        /^<hig>/i,
        /^<hiy>/i,
        /^<hic>/i,
        /^<hiz>/i,
        /^<hio>/i,
        /^<(hir|ord)>/i,
      ].findIndex(regexp => regexp.test(name));
      if (index === -1 && /^<...>/i.test(name)) {
        console.error(name);
      }
      return index + 1
    }
  }

  (function() {
    if (unsafeWindow.ValkyrieWorker) return
    unsafeWindow.ValkyrieWorker = new ValkyrieWorker();
  })();

}());
