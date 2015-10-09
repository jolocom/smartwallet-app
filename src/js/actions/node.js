import Reflux from 'reflux'

export default Reflux.createActions({
  'load': {asyncResult: true},
  'add': {asyncResult: true},
  'remove': {asyncResult: true},
  'pin': {asyncResult: true},
  'unpin': {asyncResult: true}
})
