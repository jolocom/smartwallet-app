import Reflux from 'reflux'

export default Reflux.createActions({
  'fetchInitialData': {asyncResult: true},
  'allowRead': {asyncResult: false},
  'disallowRead': {asyncResult: false},
  'allowEdit': {asyncResult: false},
  'disallowEdit': {asyncResult: false},
  'changePrivacyMode': {asyncResult: false},
  'commit': {asyncResult: false},
  'computeResult': {asyncResult: false},
  'removeContact': {asyncResult: false}
})
