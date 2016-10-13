import Reflux from 'reflux'

export default Reflux.createActions({
  'load': {asyncResult: true},
  'new': {asyncResult: true},
  'read': {asyncResult: true}
})
