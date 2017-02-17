import Reflux from 'reflux'

export default Reflux.createActions({
  'load': {asyncResult: true},
  'addMessage': {asyncResult: true},
  'subscribe': {},
  'unsubscribe': {}
})
