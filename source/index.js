import HeadHTML from "./html/head.html"
import BodyHTML from "./html/body.html"
import ValkyrieStyle from "../bundle/style.min.css"

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
import OnPerform from "./mixin/OnPerform"

import OnTasks from "./mixin/OnTasks"
import OnList from "./mixin/OnList"
import OnMsg from "./mixin/OnMsg"
import OnText from "./mixin/OnText"
import OnCustomCommand from "./mixin/OnCustomCommand"

import ToCheck from "./mixin/ToCheck"
import ToClear from "./mixin/ToClear"
import ToWakuang from "./mixin/ToWakuang"
import ToXiulian from "./mixin/ToXiulian"
import ToDazuo from "./mixin/ToDazuo"
import ToTaskFb from "./mixin/ToTaskFb"
import ToTaskQa from "./mixin/ToTaskQa"
import ToTaskSm from "./mixin/ToTaskSm"
import ToTaskYm from "./mixin/ToTaskYm"
import ToTaskWd from "./mixin/ToTaskWd"
import ToTask from "./mixin/ToTask"

// 创建应用程序实例
const app = Vue.createApp({
  mixins: [
    ValkyrieWorker, // Web Worker
    ValkyrieAwait, // 同步监听
    ValkyrieOptions, // 配置项
    OnLogin,
    OnRoom,
    OnMap,
    OnExits,
    OnItems, // items, itemadd, itemremove, sc
    OnState,
    OnScore,
    OnPack,
    OnSkills,
    OnPerform,
    OnTasks,
    OnList,
    OnMsg,
    OnText,
    OnCustomCommand, // 自定义指令模块
    ToCheck,
    ToClear,
    ToWakuang,
    ToXiulian,
    ToDazuo,
    ToTaskFb,
    ToTaskQa,
    ToTaskSm,
    ToTaskYm,
    ToTaskWd,

    ToTask,
  ],
})
// 加载 Element3 UI 组件库
app.use(Element3)

// <app-icon>
app.component(`app-icon`, {
  props: [`icon`],
  emits: [`click`],
  methods: {
    click() {
      this.$emit(`click`)
    },
  },
  template: `<i class="cursor-pointer" :class="icon" @click="click"></i>`,
})
// <app-header>
app.component(`app-header`, {
  props: [`title`, `show`],
  emits: [`update:show`],
  methods: {
    toggle() {
      this.$emit(`update:show`, !this.show)
    },
  },
  template: `
<div class="app-header unselectable">
  <div><span class="font-cursive" v-text="title"></span></div>
  <div><slot></slot>
    <app-icon :icon="show?'el-icon-caret-bottom':'el-icon-caret-right'" @click="toggle"></app-icon>
  </div>
</div>`,
})
// <app-panel>
app.component(`app-panel`, {
  props: [`show`],
  template: `<transition name="app-panel"><div class="app-panel" v-show="show"><slot></slot></div></transition>`,
})
// <app-dialog>
app.component(`app-dialog`, {
  data() {
    return { showDialog: false }
  },
  props: [`title`, `width`, `show`],
  emits: [`update:show`],
  watch: {
    show(value) {
      this.showDialog = value
    },
    showDialog(value) {
      this.$emit(`update:show`, value)
    },
  },
  template: `<el-dialog :title="title" :width="width" v-model:visible="showDialog" center destroy-on-close><slot></slot></el-dialog>`,
})
// <app-button>
app.component(`app-button`, {
  template: `<div class="app-button font-cursive"><slot></slot></div>`,
})

// 禁止 Vue3 的开发模式警告信息
app.config.warnHandler = function(msg, vm, trace) {} // trace 是组件的继承关系追踪

// DOM 加载完毕
document.addEventListener(`DOMContentLoaded`, function() {
  // head
  document.head.insertAdjacentHTML(`beforeend`, HeadHTML)
  // css
  document.head.insertAdjacentHTML(`beforeend`, `<style>${ValkyrieStyle}</style>`)
  // body
  document.body.insertAdjacentHTML(`beforeend`, BodyHTML)
  // room
  document.querySelector(`.map-panel`).remove()
  document.querySelector(`.room-title`).remove()
  document.querySelector(`.room_desc`).remove()
  document.querySelector(`.content-room`).insertAdjacentHTML(`afterbegin`, `<div id="app-room"></div>`)
  // 挂载 Valkyrie
  unsafeWindow.Valkyrie = app.mount(`#app`)
})

// 全局 Vue 对象
unsafeWindow.Vue = Vue
