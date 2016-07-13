import Reflux from 'reflux'

export default Reflux.createActions({
  'setState' : {asyncResult: false},
  'changeRotationIndex' : {asyncResult: true},
  // Birth
  'getInitialGraphState' : {asyncResult: true},
  // Life
  'viewNode':{},
  'navigateToNode' : {asyncResult: true},
  'highlight' : {asyncResult : false},
  'drawNewNode': {asyncResult: false}
})
