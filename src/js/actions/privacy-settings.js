import Reflux from 'reflux'

export default Reflux.createActions({
  'changePrivacyMode': {asyncResult: false},
  'removeContact': {asyncResult: false},
  'fetchInitialData': {asyncResult: true},
  'allowRead': {asyncResult: false},
  'allowEdit': {asyncResult: false},
  'disallowEdit': {asyncResult: false},
  'commit': {asyncResult: false}
})
