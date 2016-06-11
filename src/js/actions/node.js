import Reflux from 'reflux'

export default Reflux.createActions({
  'create': {asyncResult: true},
  'link': {asyncResult: true},
  'remove': {asyncResult: true}

  // Not implemented yet.
  // 'load': {asyncResult: true},
  // 'pin': {asyncResult: true},
  // 'unpin': {asyncResult: true}
})
