import Reflux from 'reflux'
import NavActions from 'actions/nav'

let NavStore = Reflux.createStore({
  listenables: NavActions,
  init() {
    this.show = false
  },
  getInitialState() {
    return {show: false}
  },
  onToggle() {
    this.show = !this.show

    this.trigger({
      show: this.show
    })
  },
  onShow() {
    this.show = true

    this.trigger({
      show: this.show
    })
  },
  onHide() {
    this.show = false

    this.trigger({
      show: this.show
    })
  }
})

export default NavStore
