import Reflux from 'reflux'

let Actions = Reflux.createActions({
  check: {asyncResult: true},
  fakeSignup: {asyncResult: true}
})

export default Actions
