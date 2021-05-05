import ValkyrieWorker from "./mixin/ValkyrieWorker"
import ValkyrieAwait from "./mixin/ValkyrieAwait"
import ValkyrieOptions from "./mixin/ValkyrieOptions"

import OnLogin from "./mixin/OnLogin"
import OnRoom from "./mixin/OnRoom"
import OnMap from "./mixin/OnMap"
import OnExits from "./mixin/OnExits"
import OnItems from "./mixin/OnItems"
import OnState from "./mixin/OnState"
import OnScore from "./mixin/OnScore"
import OnPack from "./mixin/OnPack"
import OnSkills from "./mixin/OnSkills"
import OnTasks from "./mixin/OnTasks"
import OnList from "./mixin/OnList"
import OnMsg from "./mixin/OnMsg"
import OnText from "./mixin/OnText"
import OnCustomCommand from "./mixin/OnCustomCommand"

// 创建应用程序实例
const app = Vue.createApp({})

// 加载 Element3 UI 组件库
app.use(Element3)

// 禁止 Vue3 的开发模式警告信息
app.config.warnHandler = function(msg, vm, trace) {} // trace 是组件的继承关系追踪

// Web Worker
app.mixin(ValkyrieWorker)
// 同步监听
app.mixin(ValkyrieAwait)
// 配置项
app.mixin(ValkyrieOptions)
// 数据处理
app.mixin(OnLogin)
app.mixin(OnRoom)
app.mixin(OnMap)
app.mixin(OnExits)
app.mixin(OnItems) // items, itemadd, itemremove, sc
app.mixin(OnState)
app.mixin(OnScore)
app.mixin(OnPack)
app.mixin(OnSkills)
app.mixin(OnTasks)
app.mixin(OnList)
app.mixin(OnMsg)
app.mixin(OnText)
app.mixin(OnCustomCommand) // 自定义指令模块

// DOM 加载完毕
document.addEventListener(`DOMContentLoaded`, function() {

  document.body.insertAdjacentHTML(`beforeend`, `<div id="app"></div>`)

  // 挂载 Valkyrie
  unsafeWindow.Valkyrie = app.mount(`#app`)
})

// 全局 Vue 对象
unsafeWindow.Vue = Vue
