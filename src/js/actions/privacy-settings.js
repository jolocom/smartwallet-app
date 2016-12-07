import Reflux from 'reflux'

export default Reflux.createActions({
  'fetchInitialData': {asyncResult: true},
  'allowRead': {asyncResult: false},
  'disallowRead': {asyncResult: false},
  'friendAllowRead': {asyncResult: false},
  'friendDisallowRead': {asyncResult: false},
  'allowEdit': {asyncResult: false},
  'disallowEdit': {asyncResult: false},
  'friendAllowEdit': {asyncResult: false},
  'friendDisallowEdit': {asyncResult: false},
  'navigate': {asyncResult: false},
  'handleCheck': {asyncResult: false},
  'commit': {asyncResult: false},
  'computeResult': {asyncResult: false}
})
