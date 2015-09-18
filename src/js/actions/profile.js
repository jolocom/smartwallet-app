import Reflux from 'reflux'

let ProfileActions = Reflux.createActions({
  'load': {asyncResult: true},
  'update': {}
})

export default ProfileActions
