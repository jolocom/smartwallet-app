import Reflux from 'reflux'
import GraphActions from 'actions/graph'

export default Reflux.createStore({
  listenables: GraphActions
})
