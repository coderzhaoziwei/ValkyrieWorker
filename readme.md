# Valkyrie

这个项目是 MUD 游戏《武神传说》的一个浏览器脚本程序。

## WebSocket 相关

使用浏览器的 [Web Workers API](https://developer.mozilla.org/docs/Web/API/Web_Workers_API) 把 WebSocket 的请求任务移入后台线程。原 WebSocket 的 `onopen` / `onclose` / `onerror` / `onmessage` / `readyState` 等属性皆被嫁接至后台 Web Worker 线程。
