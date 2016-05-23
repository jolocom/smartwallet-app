import Reflux from 'reflux'

export default Reflux.createActions({
  'create': {asyncResult: true},
  'link': {asyncResult: true}
  
  // Not implemented yet.
  // 'load': {asyncResult: true},
  // 'remove': {asyncResult: true},
  // 'pin': {asyncResult: true},
  // 'unpin': {asyncResult: true}
})
