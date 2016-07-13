import Reflux from 'reflux'
import graphAgent from '../lib/agents/graph.js'
import previewActions from '../actions/preview-actions'
import accountActions from '../actions/account'
import d3Convertor from '../lib/d3-converter'

export default Reflux.createStore({

  listenables: [previewActions],

  init: function(){
    this.listenTo(accountActions.logout, this.onLogout)

    this.gAgent = new graphAgent()
    this.convertor = new d3Convertor()

    this.state = {
      //These state keys describe the graph
      user: null,
      center:null,
      neighbours: null,
      loaded: false,
      newNode: null,
      rotationIndex: 0,
      // Keeps track of all the nodes we navigated to.
      navHistory: [],
      //These describe the ui
      showPinned: false,
      showSearch: false,
      activeNode: null
    }
  },

  onLogout(){
    this.state = {
      // Graph related
      user: null,
      center: null,
      neighbours: null,
      loaded: false,
      newNode: null,
      navHistory: [],
      // UI related
      showPinned:false,
      showSearch: false,
      activeNode: null
    }
  },

  onSetState: function(key, value, flag){
      // No need to trigger here, since this is always called after the state
      // of the child component has been changed.
    this.state[key] = value
    if (flag) this.trigger(this.state)
  },
  
  onChangeRotationIndex: function(rotationIndex, flag){
    this.state['rotationIndex'] = rotationIndex
    if (flag) this.trigger(this.state,'changeRotationIndex')
  },

  onNavigateToNode: function(node){
    this.state.neighbours = []

    this.gAgent.getGraphMapAtUri(node.uri).then((triples) => {
      triples[0] = this.convertor.convertToD3('c', triples[0])
      // Before updating the this.state.center, we push the old center node
      // to the node history

      this.state.navHistory.push(this.state.center)
      this.state.center = triples[0]

      if(this.state.navHistory.length > 1) {
        if (this.state.center.uri == this.state.navHistory[this.state.navHistory.length - 2].uri) {
          this.state.navHistory.pop()
          this.state.navHistory.pop()
        }
        // Removed the brackets, one liners.
        else if(this.state.navHistory.length > 1)
          for (var j = 0; j < this.state.navHistory.length-1; j++) 
            if (this.state.center.uri == this.state.navHistory[this.state.navHistory.length - 2 - j].uri) 
              for (var k = 0; k < j+2; k++) 
                this.state.navHistory.pop()
      }

      for (var i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)
        this.state.neighbours.push(triples[i])
      }
      this.trigger(this.state)
    })
  },

  // NOT WORKING ATM.
  onViewNode(node) {
    this.state.activeNode = node
    this.trigger(this.state)
  }
})
