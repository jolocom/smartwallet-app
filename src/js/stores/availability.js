import Reflux from 'reflux'
import Availability from 'actions/availability'
import $ from 'jquery'

import {accountStatusEndpoint} from 'settings'

let AvailabilityStore = Reflux.createStore({
  listenables: Availability,

  onCheck(username) {
    let payload = {
      method: 'accountStatus',
      accountName: username
    }
    // @TODO use webagent here?
    $.ajax({
      url: accountStatusEndpoint,
      data: JSON.stringify(payload),
      type: 'POST',
      dataType : 'json',
      contentType: 'application/json'
    }).done(Availability.check.completed).fail(Availability.check.failed)
  },

  onCheckCompleted(data) {
    this.trigger({
      action: data.formURL,
      available: data.response.available
    })
  },

  onCheckFailed() {
    this.trigger(false)
  }
})

export default AvailabilityStore
