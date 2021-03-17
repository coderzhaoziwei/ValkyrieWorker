import Map from './Map'
import Room from './Room'
import Pack from './Pack'
import Task from './Task'
import Skill from './Skill'
import State from './State'
import Score from './Score'
import Storage from './Storage'
import Channel from './Channel'

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
})

export default Valkyrie
