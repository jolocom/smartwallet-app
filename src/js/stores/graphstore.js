import Reflux from 'reflux'
import GraphActions from 'actions/graphactions'

export default Reflux.createStore({
  listenables: GraphActions,
  init: function() {
    this.clicked()
  },
  
  clicked: function(){
    this.trigger('some shit here')
  }
})
