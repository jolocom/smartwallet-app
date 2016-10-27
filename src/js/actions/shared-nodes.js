import Reflux from 'reflux'

let SharedNodesActions = Reflux.createActions({
  'getOverview': {asyncResult: true}
})

export default SharedNodesActions
