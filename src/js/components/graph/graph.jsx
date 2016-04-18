// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// This file renders the whole graph component. Takes care of all the nuances. It is also stateless,
// Figuring out now how to make it maintain some changes through refreshes.

import React from 'react'
import ReactDOM from 'react-dom'
import Radium from 'radium'
import GraphAgent from 'lib/agents/graph.js'
import GraphD3 from 'lib/graph'
import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'
import PinnedNodes from './pinned.jsx'
import D3Converter from '../../lib/d3-converter'

let graphAgent = new GraphAgent()
let convertor = new D3Converter()

let Graph = React.createClass({
  getInitialState: function() {
    return {
      center: null,
      neighbours: null,
      highlighted: null,
      showSearch: false,
      plusDrawerOpen: false
    }
  },

  getGraphEl() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  componentDidMount: function() {
    console.log(this.state)
    console.log(this.props)
    graphAgent._getWebIdGraphScheme()
    .then((result) => {
      result.center.triples = convertor.convertToD3(result.center)
      for (var i = 0; i < result.adjacent.length; i++) {
        result.adjacent[i].triples = convertor.convertToD3(result.adjacent[i], i, result.adjacent.length)
      }
      let newState = {
        center: result.center.triples,
        neighbours: result.adjacent
      }
      this.setState(newState)
      this.graph = new GraphD3(this.getGraphEl(), this.state, this.handleNodeClick)
    })
  },

  handleNodeClick(node){
  },

  componentWillUpdate(){

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
