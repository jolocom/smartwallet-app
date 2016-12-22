import Reflux from 'reflux'

export default Reflux.createActions({
  'changeRotationIndex': {asyncResult: false},
  'syncStateWithPreview': {asyncResult: false},
  'getInitialGraphState': {asyncResult: true},
  'drawNewNode': {asyncResult: false},
  'navigateToNode': {asyncResult: false},
  'refresh': {asyncResult: false},
  'drawAtUri': {asyncResult: false},
  'enterPreview': {asyncResult: false}
})
