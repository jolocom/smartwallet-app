import Reflux from 'reflux'
import Availability from 'actions/availability'
import WebIDAgent from '../lib/agents/webid'

let wia = new WebIDAgent()

let AvailabilityStore = Reflux.createStore({
  listenables: Availability,

  getInitialState() {
    return false
  },
  
  // onCheck(username) {
  //   let payload = {
  //     method: 'accountStatus',
  //     accountName: username
  //   }
  //   // @TODO use webagent here?
  //   $.ajax({
  //     url: accountStatusEndpoint,
  //     data: JSON.stringify(payload),
  //     type: 'POST',
  //     dataType : 'json',
  //     contentType: 'application/json'
  //   }).done(Availability.check.completed).fail(Availability.check.failed)
  // },

  onCheck(username) {
    wia.isFakeIDAvailable(username)
      .then((available) => {
        Availability.check.completed(available)
      })
  },

  onCheckCompleted(data) {
    this.trigger(data)
  },

  onCheckFailed() {
    this.trigger(false)
  }
})

export default AvailabilityStore
