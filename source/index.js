import "./core/event/roles"
import "./core/event/login"
import "./core/event/room"
import "./core/event/exits"
import "./core/event/map"
import "./core/event/items"
import "./core/event/itemadd"
import "./core/event/itemremove"
import "./core/event/sc"
import "./core/event/score"
import "./core/event/state"
import "./core/event/pack"
import "./core/event/skills"
import "./core/event/tasks"
import "./core/event/text"
import "./core/event/list"
import "./core/event/msg"
import "./core/event/custom-command"

import Valkyrie from "./core/Valkyrie"

if (unsafeWindow.Valkyrie) {
  console.error(`Valkyrie is already existed.`)
}

unsafeWindow.Valkyrie = Valkyrie
unsafeWindow.Vue = Vue
unsafeWindow.Element3 = Element3
unsafeWindow.gsap = gsap
