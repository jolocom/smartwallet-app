import Reflux from 'reflux'

export default Reflux.createActions({
  'load': {asyncResult: true},
  'add': {asyncResult: true},
  'read': {asyncResult: true},
  'subscribe': {},
  'unsubscribe': {}
})
