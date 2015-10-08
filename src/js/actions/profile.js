import Reflux from 'reflux'

let ProfileActions = Reflux.createActions({
  'load': {asyncResult: true},
  'update': {},
  'show': {},
  'hide': {}
})

export default ProfileActions
