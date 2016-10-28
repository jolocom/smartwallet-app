import Reflux from 'reflux'

export default Reflux.createActions({
  'fetchInitialData': {asyncResult: true},
  'allowRead': {asyncResult: false}
})
