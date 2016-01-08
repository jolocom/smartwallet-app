import Reflux from 'reflux'
import Availability from 'actions/availability'
import WebIDAgent from '../lib/agents/webid'

let wia = new WebIDAgent()

let AvailabilityDevStore = Reflux.createStore({
  listenables: Availability,

  onCheck(username) {
    wia.isFakeIDAvailable(username)
      .then((available) => {
        let data = {
          username: username,
          available: available
        }
        Availability.check.completed(data)
      })
  },

  onCheckCompleted(data) {
    console.log('onCheckCompleted')
    console.log(data)
    this.trigger(data)
  },

  onCheckFailed() {
    console.log('onCheckFailed')
    this.trigger(false)
  }
})

export default AvailabilityDevStore
