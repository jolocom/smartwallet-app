import Reflux from 'reflux'

let Actions = Reflux.createActions({
  login: {asyncResult: true},
  logout: {asyncResult: false},
  signup: {asyncResult: true},
  activateEmail: {asyncResult: true},
  updateUserEmail: {asyncResult: false}
})

export default Actions
