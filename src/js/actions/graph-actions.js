import Reflux from 'reflux'

export default Reflux.createActions({
  'getInitialGraphState' : {asyncResult: true},
  // Should add node be async?
  'addNode': {asyncResult: false},
  'fetchGraph' : {children: ['completed', 'failed']},
  'fetchGraphAtWebID' : {asyncResult: true},
  'fetchTriples' : {asyncResult: true},
  'getState': {asyncResult: false},
})
