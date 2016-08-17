// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// This file renders the whole graph component. Takes care of all the nuances.
// It is also stateless,
// Figuring out now how to make it maintain some changes through refreshes.
import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import Radium from 'radium'
import GraphD3 from 'lib/graph'
import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'
import GraphStore from 'stores/graph-store'
import graphActions from 'actions/graph-actions'
import IndicatorOverlay from 'components/graph/indicator-overlay.jsx'

import Node from '../node/node.jsx'

let Graph = React.createClass({

  mixins: [Reflux.listenTo(GraphStore, 'onStateUpdate')],

  propTypes: {
    children: React.PropTypes.node
  },

  contextTypes: {
    history: React.PropTypes.object,
    searchActive: React.PropTypes.bool
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
    if (signal === 'nodeRemove') {
      this.graph.deleteNodeAndRender(data)
      this.setState({activeNode: null})
      // Important to avoid a re-render here.
      graphActions.setState('activeNode', null, false)
    } else if (signal !== 'preview') {
      if (data) {
        this.setState(data)
      }
      if (data && data.neighbours) {
        this.graph.render(this.state)
        this.graph.updateHistory(this.state.navHistory)
      }
    }

    if (this.state.newNode) {
      // this.graph.addNode(this.state.newNode)
      // We update the state of the store to be
      // in line with the state of the child
      this.state.newNode = null
      graphActions.setState('newNode', null, false)
    }
    if (signal === 'erase') {
      this.graph.eraseGraph()
    }
  },

  addNode: function(type) {
    let uri = encodeURIComponent(this.state.center.uri)
    this.context.history.pushState(null, `/graph/${uri}/add/${type}`)
  },

  // This is the first thing that fires when the user logs in.
  componentDidMount: function() {
    // Instantiating the graph object.
    this.graph = new GraphD3(this.getGraphEl(), 'main')
    // Adding the listeners.
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('select', this._handleSelectNode)
    this.graph.on('view-node', this._handleViewNode)
    this.graph.on('change-rotation-index', this._handleChangeRotationIndex)
    this.graph.on('scrolling-drawn', this._handleScrollingDrawn)
    graphActions.getState()
  },

  componentWillUnmount: function() {
    if (this.graph) {
      this.graph.eraseGraph()
      this.graph.removeAllListeners()
    }
  },

  _handleSelectNode(node, svg) {
    graphActions.setState('selected', svg)
  },

  _handleChangeRotationIndex(rotationIndex) {
    graphActions.changeRotationIndex(rotationIndex, false)
  },

  _handleCenterChange(node) {
    graphActions.navigateToNode(node)
  },

  // max visible nodes reached, show indicator overlay
  _handleScrollingDrawn() {
    // refers to show() method of IndicatorOverlay component
    this.refs.scrollIndicator.show()
  },

  getStyles: function() {
    let styles = {
      container: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      },
      chart: {
        flex: 1,
        overflow: 'hidden'
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

    if (this.graph) {
      this.graph.setRotationIndex(this.state.rotationIndex)
    }

    let nodeDetails

    if (this.state.activeNode) {
      nodeDetails = (
        <Node
          node={this.state.activeNode}
          center={this.state.center}
          svg={this.state.selected}
          state={this.state}
        />
      )
    }

    let fab

    if (!this.context.searchActive) {
      fab = (
        <FabMenu style={styles.menu} icon="add" closeIcon="close">
          <FabMenuItem
            icon="radio_button_unchecked"
            label="Node" onTouchTap={this._handleAddNodeTouchTap} />
          <FabMenuItem
            icon="insert_link"
            label="Link" onClick={this._handleLinkNodeTouchTap} />
        </FabMenu>
      )
    }

    return (
      <div style={styles.container}>
        <IndicatorOverlay ref="scrollIndicator" />
        <div style={styles.chart} ref="graph"></div>

        {fab}

        {this.props.children}

        {nodeDetails}
      </div>
    )
  },

  _handleViewNode(node) {
    graphActions.viewNode(node)
  },

  _handleAddNodeTouchTap() {
    this.addNode('node')
  },

  _handleLinkNodeTouchTap() {
    this.addNode('link')
  }
})

export default Radium(Graph)
