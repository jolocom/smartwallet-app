import Reflux from 'reflux'

export default Reflux.createActions({
  'getInitialGraphState' : {asyncResult: true},
  'fetchGraph' : {children: ['completed', 'failed']},
  'fetchGraphAtWebID' : {asyncResult: true},
  'fetchTriples' : {asyncResult: true}
})
