import Room from './Room'
import Pack from './Pack'
import Skill from './Skill'
import State from './State'
import Score from './Score'
import Account from './Account'

const Valkyrie = Vue.reactive({
  room: new Room(),
  pack: new Pack(),
  state: new State(),
  score: new Score(),
  skill: new Skill(),
  account: new Account(),
})

export default Valkyrie
