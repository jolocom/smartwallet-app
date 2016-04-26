import Reflux from 'reflux'
import graphAgent from '../lib/agents/graph.js'
import graphActions from '../actions/graph-actions'
import d3Convertor from '../lib/d3-converter'

export default Reflux.createStore({

  listenables: [graphActions],

  init: function(){
    this.gAgent = new graphAgent()
    this.convertor = new d3Convertor()
    this.state = {
      //These state keys describe the graph
      center:null,
      neighbours: null,
      loaded: false,
      highlighted: null,
      //These describe the ui
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false
    }
  },

  onUpdateState: function(updated){
    this.state = updated
    this.trigger(this.state)
  },

  onGetState: function(){
    this.trigger(this.state)
  },

  getInitialState: function() {
  },

  onGetInitialGraphState: function() {
    this.gAgent.getGraphMapAtWebID().then((triples) => {
      triples[0] = this.convertor.convertToD3(triples[0])
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3(triples[i], i, triples.length - 1)}
      graphActions.getInitialGraphState.completed(triples)
    })
  },

  onGetInitialGraphStateCompleted: function(result) {
    this.state.center = result[0]
    this.state.neighbours = result.slice(1, result.length)
    this.state.loaded = true
    this.trigger(this.state)
  }
})
