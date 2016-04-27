// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// This file renders the whole graph component. Takes care of all the nuances. It is also stateless,
// Figuring out now how to make it maintain some changes through refreshes.
import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Radium from 'radium'
import GraphAgent from 'lib/agents/graph.js'
import GraphD3 from 'lib/graph'
import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'
import PinnedNodes from './pinned.jsx'
import D3Converter from '../../lib/d3-converter'
import GraphStore from '../../stores/graph-store'
import graphActions from '../../actions/graph-actions'
import solid from 'solid-client'
import rdf from 'rdflib'
import {Writer} from '../../lib/rdf.js'

let graphAgent = new GraphAgent()
let convertor = new D3Converter()
let Graph = React.createClass({

  mixins : [Reflux.listenTo(GraphStore, 'onStateUpdate')],

  // Custom methods

  getGraphEl: function() {
      return ReactDOM.findDOMNode(this.refs.graph)
  },

  onNodeChange: function(){

  },

  onStateUpdate: function(data) {
    this.setState(data)
    // We check if the graph info has already been pulled from the RDF file
    // This way we only fetch data from the server when needed.
    if (!this.state.loaded) {
      graphActions.getInitialGraphState()
    } else{
      // If the data was already pulled, we draw a graph with it.
      this.graph = new GraphD3(this.getGraphEl(), this.state , this.handleNodeClick)
    }
  },

  // addNode: function() {
  //   let writer = new Writer()
  //   let uri = this.state.center.uri
  //   graphAgent.fetchTriplesAtUri(uri).then((result) => {
  //     for (var i = 0; i < result.triples.length; i++) {
  //       let triple = result.triples[i]
  //       writer.addTriple(triple.object, triple.predicate, triple.subject)
  //     }
  //     writer.end()
  //   })
  // },

  // Lifecycle methods below
  componentWillMount: function() {
  },

  componentDidMount: function() {
    // Make sure we refresh our state every time we mount the component, this
    // then fires the drawing function from onStateUpdate
    graphActions.getState()
  },

  componentWillUpdate: function(nextProp, nextState){
  },

  getInitialState: function() {
    return {
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

  componentWillUnmount: function(){
    // Commiting all the changes that the user did to the graph to the store's state
    // Not yet implemented, waiting for Eric's graph to start working on this.
    // graphActions.updateState(this.state)
  },

  getStyles: function() {
    let styles = {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      chart: {
        flex: 1
      },
      menu: {
        position: 'absolute',
        bottom: '16px',
        right: '16px'
      }
    }
    return styles
  },

  render: function() {
    let styles = this.getStyles()
    return (
      <div style={styles.container}>
        <FabMenu style={styles.menu}>
          <FabMenuItem icon="comment" label="Comment" onClick={() => {this.addNode('comment')}}/>
          <FabMenuItem icon="insert_photo" label="Image" onClick={() => {this.addNode('image')}}/>
          <FabMenuItem icon="attachment" label="File" onClick={() => {this.addNode('file')}}/>
          <FabMenuItem icon="person" label="Contact" onClick={() => {this.addNode('person')}}/>
          <FabMenuItem icon="wb_sunny" label="Sensor" onClick={() => {this.addNode('sensor')}}/>
        </FabMenu>

        <div style={styles.chart} ref="graph"></div>

        {this.props.children}

        <PinnedNodes/>
      </div>
   )
  }
})
export default Radium(Graph)
