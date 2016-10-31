import Reflux from 'reflux'

export default Reflux.createActions({
  'fetchInitialData': {asyncResult: true},
  'allowRead': {asyncResult: false},
  'disallowRead': {asyncResult: false},
  'friendDisallowRead': {asyncResult: false},
  'allowEdit': {asyncResult: false},
  'disallowEdit': {asyncResult: false},
  'friendDisallowEdit': {asyncResult: false},
  'friendViewAllow': {asyncResult: false}
})
