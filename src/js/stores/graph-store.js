import Reflux from 'reflux'
import graphAgent from '../lib/agents/graph.js'
import graphActions from '../actions/graph-actions'
import d3Convertor from '../lib/d3-converter'
import STYLES from '../styles/app'

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
      plusDrawerOpen: false,
      highlighted: null
    }
  },

  onHighlight(node){

   d3.selectAll('g .node').selectAll('circle')
    .transition().duration(STYLES.nodeTransitionDuration)
    .attr('r', function(d){
      if (d.rank == 'center') return STYLES.largeNodeSize / 2
      else return STYLES.smallNodeSize / 2
    })

    d3.selectAll('g .node').selectAll('pattern')
    .transition().duration(STYLES.nodeTransitionDuration)
    .attr('x', function(d){
      if (d.rank == 'center') return -STYLES.largeNodeSize / 2
      else return -STYLES.smallNodeSize / 2 })
    .attr('y', function(d){
      if (d.rank == 'center') return -STYLES.largeNodeSize / 2
      else return -STYLES.smallNodeSize / 2
    })

    d3.selectAll('g .node').selectAll('image')
    .transition().duration(STYLES.nodeTransitionDuration)
    .attr('width', function(d){
      if (d.rank == 'center') return STYLES.largeNodeSize
      else return STYLES.smallNodeSize
    })
    .attr('height',function(d){
      if (d.rank == 'center') return STYLES.largeNodeSize
      else return STYLES.smallNodeSize
    })

    d3.select(node).select('circle')
    .transition().duration(STYLES.nodeTransitionDuration)
    .attr('r', STYLES.largeNodeSize / 2)

    d3.select(node).select('pattern')
    .transition().duration(STYLES.nodeTransitionDuration)
    .attr('x', -STYLES.largeNodeSize / 2)
    .attr('y', -STYLES.largeNodeSize / 2)

    d3.select(node).select('image')
    .transition().duration(STYLES.nodeTransitionDuration)
    .attr('width', STYLES.largeNodeSize)
    .attr('height', STYLES.largeNodeSize)
    this.state.highlighted = d3.select(node)

  },

  onUpdateState: function(updated){
    this.state = updated
    this.trigger( this.state)
  },

  onGetState: function(){
    this.trigger( this.state)
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
