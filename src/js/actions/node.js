import Reflux from 'reflux'

export default Reflux.createActions({
  'create': {asyncResult: true},
  'initiate': {asyncResult: false},
  'link': {asyncResult: true},
  'remove': {asyncResult: true},
  'disconnectNode': {asyncResult: false},
  'resetState': {asyncResult: false}

  // Not implemented yet.
  // 'load': {asyncResult: true},
  // 'pin': {asyncResult: true},
  // 'unpin': {asyncResult: true}
})
