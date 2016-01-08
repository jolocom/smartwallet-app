import Reflux from 'reflux'

let Actions = Reflux.createActions({
  login: {asyncResult: true},
  logout: {},
  signup: {asyncResult: true}
})

export default Actions
