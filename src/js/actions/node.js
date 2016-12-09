import Reflux from 'reflux'

export default Reflux.createActions({
  'initiate': {asyncResult: false},
  'link': {asyncResult: true},
  'remove': {asyncResult: true},
  'disconnectNode': {asyncResult: false},
  'resetState': {asyncResult: false},
  'create': {asyncResult: false}
})
