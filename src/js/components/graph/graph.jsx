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
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')

let graphAgent = new GraphAgent()
let convertor = new D3Converter()
let Graph = React.createClass({

  mixins : [Reflux.listenTo(GraphStore, 'onStateUpdate')],

  // Custom methods

  getGraphEl: function() {
      return ReactDOM.findDOMNode(this.refs.graph)
  },

  onStateUpdate: function(data, signal) {

    this.setState(data)
    if (!this.state.loaded) {
      graphActions.getInitialGraphState()
    }
    if (this.state.loaded && !this.state.drawn){

      this.graph = new GraphD3(this.getGraphEl())
      this.graph.drawBackground()
      this.graph.drawNodes(this.state)

      this.state.drawn = true
      graphActions.setState(this.state)
    }
    if (this.state.newNode) {
      this.graph.addNode(this.state.newNode)
    }

    if(signal == 'redraw'){
      this.graph.eraseGraph()
      this.graph.drawNodes(data)
    }
  },

  addNode: function() {
    // This takes a triple describing the new node added!
    // For now it will add a friend relationship to Justas. Reason is we do not have a proper input field yet
    // And also because everyone would be happy to have a friend like Justas.
    let target = prompt()
    graphActions.addNode(rdf.sym(this.state.center.uri), FOAF('knows'), rdf.sym(target))
  },

  handleNodeClick: function(node){
  },

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

  componentDidUpdate: function() {
  },

  getInitialState: function() {
    return {
      //These state keys describe the graph
      user: null,
      center:null,
      neighbours: null,
      loaded: false,
      newNode: null,
      drawn: false,
      //These describe the ui
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false
    }
  },

  componentWillUnmount: function(){
    console.log(this.state)
    this.state.drawn = false
    graphActions.setState(this.state)
    if (this.graph) this.graph.eraseGraph()
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
