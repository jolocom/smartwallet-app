import Reflux from 'reflux'
import NavActions from 'actions/nav'

let NavStore = Reflux.createStore({
  listenables: NavActions,
  getInitialState() {
    return {show: false}
  },
  onToggle() {
    this.show = !this.show

    this.trigger({
      show: this.show
    })
  }
})

export default NavStore
