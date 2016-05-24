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
      drawn: false,
      // Keeps track of all the nodes we navigated to.
      navHistory: [],
      //These describe the ui
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false,
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
      drawn: false,
      navHistory: [],
      // UI related
      showPinned:false,
      showSearch: false,
      plusDrawerOpen:false,
      activeNode: null
    }
  },

  onSetState: function(key, value, flag){
      // No need to trigger here, since this is always called after the state
      // of the child component has been changed.
    this.state[key] = value
    if (flag) this.trigger(this.state)
  },

  // This sends Graph.jsx and the Graph.js files a signal to add new ndoes to the graph
  drawNewNode: function(object){
    // This fetches the triples at the newly added file, it allows us to draw it
    // the graph accurately
    this.gAgent.fetchTriplesAtUri(object).then((result)=>{
      result.triples.uri = object
      // Now we tell d3 to draw a new adjacent node on the graph, with the info from
      // the triple file
      this.state.newNode = this.convertor.convertToD3('a', result.triples)
      this.state.neighbours.push(this.state.newNode)
      this.trigger(this.state)
    })
  },

  onGetState: function(){
    this.trigger( this.state)
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
        if (this.state.center.name == this.state.navHistory[this.state.navHistory.length - 2].name) {
          this.state.navHistory.pop()
          this.state.navHistory.pop()
        }
      }

      for (var i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)
        this.state.neighbours.push(triples[i])
      }
      this.trigger(this.state, 'redraw')
    })
  },

  onViewNode(node) {
    this.state.activeNode = node
    this.trigger(this.state)
  }
})
