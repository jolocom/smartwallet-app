import Reflux from 'reflux'
import graphAgent from '../lib/agents/graph.js'
import graphActions from '../actions/graph-actions'
import accountActions from '../actions/account'
import d3Convertor from '../lib/d3-converter'

export default Reflux.createStore({

  listenables: [graphActions],

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
      newLink: null,
      drawn: false,
      highlighted: null,
      linkSubject: null,
      linkObject: null,
      // Keeps track of all the nodes we navigated to.
      navHistory: [],
      //These describe the ui
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false
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
      newLink: null,
      drawn: false,
      highlighted: null,
      linkSubject: null,
      navHistory: [],
      // UI related
      showPinned:false,
      showSearch: false,
      plusDrawerOpen:false
    }
  },

  onEraseGraph: function() {
    this.trigger(null, 'erase')
  },

  onDrawGraph: function() {
    this.trigger(null, 'redraw')
  },

  onSetState: function(key, value, flag){
    this.state[key] = value
    if (flag) this.trigger(this.state)
  },

  onChooseSubject: function() {
    // We choose the subject of the new link
    if (this.state.highlighted) this.state.linkSubject = this.state.highlighted
    else this.state.linkSubject = this.state.center.uri
    this.trigger(this.state)

    graphActions.linkTriple()
  },

  onChooseObject: function() {
    // We choose the object of the new link
    if (this.state.highlighted) this.state.linkObject = this.state.highlighted
    else this.state.linkObject = this.state.center.uri
    this.trigger(this.state)
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
      this.trigger(this.state)
    })
  },

  onHighlight: function(node) {
    if(!node) this.state.highlighted = null
    else this.state.highlighted = node.uri
    this.trigger(this.state, 'highlight')
  },

  onGetState: function(){
    this.trigger( this.state)
  },

  onGetInitialGraphState: function(username) {
    this.gAgent.getGraphMapAtWebID(username).then((triples) => {
      triples[0] = this.convertor.convertToD3('c', triples[0])
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)}
      graphActions.getInitialGraphState.completed(triples)
    })
  },

  onGetInitialGraphStateCompleted: function(result) {
    this.state.center = result[0]
    this.state.neighbours = result.slice(1, result.length)
    this.state.loaded = true
    this.state.user = result[0].uri
    this.trigger(this.state)
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
        else if(this.state.navHistory.length > 1) {
          for (var j = 0; j < this.state.navHistory.length-1; j++) {
            if (this.state.center.uri == this.state.navHistory[this.state.navHistory.length - 2 - j].uri) {
              for (var k = 0; k < j+2; k++) {
                this.state.navHistory.pop()
              }
            }
          }
        }
      }


      for (var i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)
        this.state.neighbours.push(triples[i])
      }

      this.state.highlighted = null
      this.trigger(this.state, 'redraw')
    })
  }
})
