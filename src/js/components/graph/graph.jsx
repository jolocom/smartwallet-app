// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// This file renders the whole graph component. Takes care of all the nuances. It is also stateless,
// Figuring out now how to make it maintain some changes through refreshes.
import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react-dom'
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
let graphAgent = new GraphAgent()
let convertor = new D3Converter()

let Graph = React.createClass({

  mixins : [Reflux.listenTo(GraphStore, 'onChange')],

  getInitialState: function() {
    graphActions.getInitialGraphState()
    return {
      center: null,
      neighbours: null,
      highlighted: null,
      showSearch: false,
      plusDrawerOpen: false
    }
  },

  componentWillMount: function() {
  },

  componentDidMount: function() {
  },

  handleNodeClick(node){
  },

  componentWillUpdate(nextProp, nextState){
    if (nextState.center && nextState.neighbours)
      this.graph = new GraphD3(this.getGraphEl(), nextState, this.handleNodeClick)
  },

  onChange: function(state) {
    this.setState(state)
  },

  getGraphEl() {
      return ReactDOM.findDOMNode(this.refs.graph)

  },

  getStyles() {
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

  render() {
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
