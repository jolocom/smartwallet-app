import Reflux from 'reflux'

export default Reflux.createActions({
  'setState' : {asyncResult: false},
  'getInitialGraphState' : {asyncResult: true},
  'addNode': {asyncResult: true},
  'fetchGraph' : {children: ['completed', 'failed']},
  'fetchGraphAtWebID' : {asyncResult: true},
  'fetchTriples' : {asyncResult: true},
  'getState': {asyncResult: false},
})
