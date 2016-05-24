import Reflux from 'reflux'

export default Reflux.createActions({
  'setState' : {asyncResult: false},
  'getState': {asyncResult: false},
  // Birth
  'getInitialGraphState' : {asyncResult: true},
  // Life
  'viewNode':{},
  'navigateToNode' : {asyncResult: true},
  'highlight' : {asyncResult : false},
  'drawNewNode': {asyncResult: false}
})
