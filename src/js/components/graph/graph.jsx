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
import GraphStore from '../../stores/graph-store'
import graphActions from '../../actions/graph-actions'

import Node from '../node/node.jsx'

let Graph = React.createClass({

  mixins : [Reflux.listenTo(GraphStore, 'onStateUpdate')],

  contextTypes: {
    history: React.PropTypes.object
  },

  childContextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.string
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
    if (data) this.setState(data)

    if (!this.state.loaded) {
      graphActions.getInitialGraphState()
    }

    if (this.state.loaded && !this.state.drawn){
      this.graph.render(this.state)
      graphActions.setState('drawn', true)
    }

    if (this.state.newNode) {
      this.graph.addNode(this.state.newNode)
      this.state.neighbours.push(this.state.newNode)
      graphActions.setState('neighbours', this.state.neighbours)
      // We update the state of the store to be in line with the state of the child
      this.state.newNode = null
      graphActions.setState('newNode', null)
    }

    if(signal == 'redraw'){
      this.graph.render(this.state)
      this.graph.updateHistory(this.state.navHistory)
    } else if ( signal == 'highlight') {
      this.state.highlighted = data.highlighted
    } else if ( signal == 'erase') {
      graphActions.setState('drawn', false)
      graphActions.setState('highlighted', null)
      this.graph.eraseGraph()
    }
  },

  addNode: function(type) {
    let uri = encodeURIComponent(this.state.center.uri)
    this.context.history.pushState(null, `/graph/${uri}/add/${type}`)
  },

  componentDidMount: function() {
    // Instantiating the graph object.
    this.graph = new GraphD3(this.getGraphEl(), 'full')
    // this.graph.on is the same as this.graph.addListener()
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('select', this._handleSelect)
    this.graph.on('view-node', this._handleViewNode)
    this.graph.on('deselect', this._handleDeselect)

    // TODO Is this the right place for this?
    graphActions.getState()
  },

  componentWillUnmount: function(){
    // TODO Do I need these here?
    graphActions.setState('drawn', false)
    graphActions.setState('highlighted', null)

    if (this.graph) {
      this.graph.eraseGraph()
      this.graph.removeAllListeners()
    }
  },

  _handleCenterChange(node){
    graphActions.navigateToNode(node)
  },

  _handleSelect(node){
    graphActions.highlight(node)
  },

  _handleDeselect(){
    graphActions.highlight(null)
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

  // We are using the buttons as placeholders, when the frontend is implemented, we will use the actuall buttons
  render: function() {
    let styles = this.getStyles()

    let nodeDetails

    if (this.state.activeNode) {
      nodeDetails = <Node node={this.state.activeNode}/>
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
