import Reflux from 'reflux'

export default Reflux.createActions({
  'setState' : {asyncResult: false},
  'getState': {asyncResult: false},
  // Birth
  'getInitialGraphState' : {asyncResult: true},
  'drawGraph' : {asyncResult: false},
  // Life
  'drawNewNode': {asyncResult: false},
  'navigateToNode' : {asyncResult: true},
  'highlight' : {asyncResult : false},
  'viewNode': {},
  // Death.
  'eraseGraph' :{asyncResult: false}
})
