// ==UserScript==
// @name         ValkyrieWorker
// @namespace    com.coderzhaoziwei.valkyrie
// @version      1.0.5
// @author       Coder Zhao <coderzhaoziwei@outlook.com>
// @description  ValkyrieWorker
// @match        http://*.wsmud.com/*
// @run-at       document-start
// @grant        unsafeWindow
// ==/UserScript==

(function () {
  'use strict';

  var WorkerContent = "var websocket\nconst handlers = {\n  createWebSocket(uri) {\n    websocket = new WebSocket(uri)\n    websocket.onopen = function(event) {\n      console.log('ValkyrieWorker: WebSocket.onopen', event)\n      postMessage({ type: 'setReadyState', args: [websocket.readyState] })\n      postMessage({ type: 'websocketOnopen', args: [] })\n    }\n    websocket.onclose = function(event) {\n      console.log('ValkyrieWorker: WebSocket.onclose', event)\n      postMessage({ type: 'setReadyState', args: [websocket.readyState] })\n      postMessage({ type: 'websocketOnclose', args: [] })\n    }\n    websocket.onerror = function(event) {\n      console.log('ValkyrieWorker: WebSocket.onerror', event)\n      postMessage({ type: 'setReadyState', args: [websocket.readyState] })\n      postMessage({ type: 'websocketOnerror', args: [] })\n    }\n    websocket.onmessage = function(event) {\n      postMessage({ type: 'websocketOnmessage', args: [{ data: event.data }] })\n    }\n  },\n  sendCommand(command) {\n    websocket.send(command)\n  },\n}\nonmessage = function(event) {\n  try {\n    const type = event.data.type\n    const args = event.data.args\n    handlers[type](...args)\n  } catch (error) {\n    console.error(error)\n  }\n}\n";

  (function() {
    if (unsafeWindow.ValkyrieWorkerTag === true) return
    unsafeWindow.ValkyrieWorkerTag = true;
    console.log(GM_info.script.name, GM_info.script.version);
    const workerBlob = new Blob([WorkerContent]);
    const workerURL = URL.createObjectURL(workerBlob);
    const worker = new Worker(workerURL);
    const postMessage = function(data) {
      worker.postMessage(data);
    };
    const websocket = {
      readyState: 0,
      onopen: () => {},
      onclose: () => {},
      onerror: () => {},
      onmessage: () => {},
    };
    const handlers = {
      setReadyState(value) {
        console.log('set websocket.readyState: ', value);
        websocket.readyState = value;
      },
      websocketOnopen() {
        websocket.onopen();
      },
      websocketOnclose() {
        websocket.onclose();
      },
      websocketOnerror(event) {
        websocket.onerror(event);
      },
      websocketOnmessage(event) {
        websocket.onmessage(event);
      },
    };
    worker.onmessage = function(event) {
      try {
        const type = event.data.type;
        const args = event.data.args;
        handlers[type](...args);
      } catch (error) {
        console.error(data);
        console.error(error);
      }
    };
    unsafeWindow.WebSocket = function(uri) {
      postMessage({ type: 'createWebSocket', args: [uri] });
    };
    unsafeWindow.WebSocket.prototype = {
      set onopen(fn) {
        console.log('set websocket.onopen');
        websocket.onopen = fn;
      },
      set onclose(fn) {
        console.log('set websocket.onclose');
        websocket.onclose = fn;
      },
      set onerror(fn) {
        console.log('set websocket.onerror');
        websocket.onerror = fn;
      },
      set onmessage(fn) {
        console.log('set websocket.onmessage');
        websocket.onmessage = fn;
      },
      get readyState() {
        return websocket.readyState
      },
      send(command) {
        postMessage({ type: 'sendCommand', args: [command] });
      },
    };
  })();

}());
