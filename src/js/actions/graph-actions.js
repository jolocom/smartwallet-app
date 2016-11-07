import Reflux from 'reflux'

export default Reflux.createActions({
  'setState' : {asyncResult: false},
  'getState': {asyncResult: false},
  'changeRotationIndex': {asyncResult: false},
  // Birth
  'getInitialGraphState' : {asyncResult: true},
  // Life
  'drawNewNode': {asyncResult: false},
  'deleteNode': {asyncResult: false},
  'dissconnectNode': {asyncResult: false},
  'navigateToNode' : {asyncResult: true},
  'refresh' : {asyncResult: false},
  'drawAtUri' : {asyncResult: false},
  'highlight' : {asyncResult : false},
  'viewNode': {asyncResult : false},
  // Death.
  'eraseGraph' :{asyncResult: false}
})
