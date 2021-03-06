# ValkyrieWorker

> 这个项目是《武神传说》脚本程序的一个前置库。

## WebSocket 相关

使用浏览器的 [Web Workers API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) 把 WebSocket 的请求任务移入后台线程。原 WebSocket 的 `onopen` / `onclose` / `onerror` / `onmessage` / `readyState` 等属性皆被嫁接至后台线程。
