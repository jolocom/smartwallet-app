import Reflux from 'reflux'

export default Reflux.createActions({
  'setState' : {asyncResult: false},
  'navigateToNode' : {asyncResult: true},
  'getInitialGraphState' : {asyncResult: true},
  'fetchGraph' : {children: ['completed', 'failed']},
  'fetchGraphAtWebID' : {asyncResult: true},
  'fetchTriples' : {asyncResult: true},
  'getState': {asyncResult: false},
  'highlight' : {asyncResult : false},
  // Should next be async?
  'chooseSubject': { asyncResult: false},
  'chooseObject': { asyncResult: false},
  'createAndConnectNode' : {asyncResult: true},
  'linkTriple': {asyncResult:false},
  'writeTriple':{asyncResult: false},
  'drawNewNode': {asyncResult: false},
  'eraseGraph' :{asyncResult: false},
  'drawGraph' : {asyncResult: false},
  'viewNode': {}
})
