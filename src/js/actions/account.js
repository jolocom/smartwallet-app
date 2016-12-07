import Reflux from 'reflux'

let Actions = Reflux.createActions({
  login: {asyncResult: true},
  logout: {asyncResult: false},
  signup: {asyncResult: true},
  setNameEmail: {asyncResult: true},
  activateEmail: {asyncResult: true}
})

export default Actions
