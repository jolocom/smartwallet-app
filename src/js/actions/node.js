import Reflux from 'reflux'

export default Reflux.createActions({
  'create': {asyncResult: true},
  'initiate': {asyncResult: false},
  'link': {asyncResult: true},
  'remove': {asyncResult: true},
  'disconnectNode': {asyncResult: false},
  'resetState': {asyncResult: false}
})
