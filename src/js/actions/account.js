import Reflux from 'reflux'

let Actions = Reflux.createActions({
  login: {asyncResult: true},
  signup: {asyncResult: true}
})

export default Actions
