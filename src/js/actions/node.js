import Reflux from 'reflux'

export default Reflux.createActions({
  'load': {asyncResult: true},
  'create': {asyncResult: true},
  'link': {asyncResult: true},
  'remove': {asyncResult: true},
  'pin': {asyncResult: true},
  'unpin': {asyncResult: true}
})

// We need functionality related to one node here.

// Delete node.
// Edit node.
// Link node?
  //     |
  //     +--> select subject
  //     |
  //     +--> select object
  //     |
  //     +--> select predicate
// Fullscreen it.
