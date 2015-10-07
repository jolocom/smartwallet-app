import Reflux from 'reflux'
import Availability from 'actions/availability'
import WebIDAgent from '../lib/webid-agent'

let AvailabilityDevStore = Reflux.createStore({
  listenables: Availability,

  onCheck(username) {
    WebIDAgent.isFakeIDAvailable(username)
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
  },

  onFakeSignup(data) {
    WebIDAgent.fakeSignup(data.username, data.name, data.email)
      .then(() => {
        Availability.fakeSignup.completed(data.username)
      })
      .catch(Availability.fakeSignup.failed)
  },
  onFakeSignupCompleted(username) {
    localStorage.setItem('fake-user', username)
    this.trigger({signedUp: username})
  },
  onFakeSignupFailed(err) {
    //TODO: trigger failure
    console.log(err)
  
  }
})

export default AvailabilityDevStore
