// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// This file renders the whole graph component. Takes care of all the nuances. It is also stateless,
// Figuring out now how to make it maintain some changes through refreshes.
import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Radium from 'radium'
import GraphD3 from 'lib/graph'
import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'
import GraphStore from 'stores/graph-store'
import AccountStore from 'stores/account'
import graphActions from 'actions/graph-actions'

import Node from '../node/node.jsx'

let Graph = React.createClass({

  mixins : [Reflux.listenTo(GraphStore, 'onStateUpdate')],

  contextTypes: {
    history: React.PropTypes.object
  },

  childContextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getChildContext: function() {
    return {
      node: this.state.center,
      user: this.state.user
    }
  },

  getGraphEl: function() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  onStateUpdate: function(data, signal) {
    // Temp. make it more elegant later.
    if (signal == 'nodeRemove')
    {
      this.graph.deleteNode(data.activeNode)
      this.state.activeNode = null
      // Important to avoid a re-render here.
      graphActions.setState('activeNode', null, false)
    } 
    else if (signal == 'preview'){
      // Doesn't concern this component, used by preview.jsx
    }
    else if (data){
      if (this.state.newNode) {
        this.graph.addNode(this.state.newNode)
        // We update the state of the store to be in line with the state of the child
        this.state.newNode = null
        graphActions.setState('newNode', null, true)
      } else this.setState(data)

      if (data && data.neighbours){
        this.graph.render(this.state)
        this.graph.updateHistory(this.state.navHistory)
      }

    }

    if ( signal == 'erase') {
      this.graph.eraseGraph()
    }
  },

  addNode: function(type) {
    let uri = encodeURIComponent(this.state.center.uri)
    this.context.history.pushState(null, `/graph/${uri}/add/${type}`)
  },

  
  // This is the first thing that fires when the user logs in.
  componentDidMount: function() {
    // We create a basic grap, draws the background, and that's about it.
    this.graph = new GraphD3(this.getGraphEl())

    // Adding the listeners. 
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('select', this._handleSelectNode)
    this.graph.on('view-node', this._handleViewNode)

    // Fetching the state from the store.
    // This includes the center node, the neighbours, and everything
    // used to render the graph
    graphActions.getState()
  },

  componentWillUnmount: function(){
    if (this.graph) {
      this.graph.eraseGraph()
      this.graph.removeAllListeners()
    }
  },


  _handleSelectNode(node, svg){
    graphActions.setState('selected', svg)
  },

  _handleCenterChange(node){
    graphActions.navigateToNode(node)
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

    let nodeDetails

    if (this.state.activeNode) {
      nodeDetails = <Node state={this.state}/>
    }

    return (
      <div style={styles.container}>
        <FabMenu style={styles.menu}>
          <FabMenuItem icon="radio_button_unchecked" label="Node" onClick={() => {this.addNode('node')}}/>
          <FabMenuItem icon="insert_link" label="Link" onClick={() => {this.addNode('link')}}/>
        </FabMenu>

        <div style={styles.chart} ref="graph"></div>

        {this.props.children}

        {nodeDetails}
      </div>
    )
  },

  _handleViewNode(node) {
    graphActions.viewNode(node)
  }
})
export default Radium(Graph)
