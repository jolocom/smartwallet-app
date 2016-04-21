import Reflux from 'reflux'
import graphAgent from '../lib/agents/graph.js'
import graphActions from '../actions/graph-actions'
import d3Convertor from '../lib/d3-converter'

export default Reflux.createStore({

  listenables: [graphActions],
  graphNodes : {
    center: null,
    neighbours: null,
    highlighted: null,
    showSearch: false,
    plusDrawerOpen: false
  },

  init: function(){
    this.gAgent = new graphAgent()
    this.convertor = new d3Convertor()
  },

  onGetInitialGraphState: function() {
    this.gAgent.getGraphMapAtWebID().then((triples) => {
      triples[0] = this.convertor.convertToD3(triples[0])
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3(triples[i], i, triples.length - 1)
      }
      graphActions.getInitialGraphState.completed(triples)
    })
  },

  onGetInitialGraphStateCompleted: function(result) {
    this.graphNodes.center = result[0]
    this.graphNodes.neighbours = result.slice(1, result.length)
    
    this.trigger(this.graphNodes)
  }

})
