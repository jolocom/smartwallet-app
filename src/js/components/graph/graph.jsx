// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/
// This file renders the whole graph component. Takes care of all the nuances.
// It is also stateless,
// Figuring out now how to make it maintain some changes through refreshes.
import Reflux from 'reflux'
import React from 'react'
import ReactDOM from 'react/lib/ReactDOM'
import GraphD3 from 'lib/graph'
import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'
import GraphStore from 'stores/graph-store'
import graphActions from 'actions/graph-actions'
import IndicatorOverlay from 'components/graph/indicator-overlay.jsx'
import Radium from 'radium'
import NodeTypes from 'lib/node-types'

import AclAgent from 'lib/agents/acl'

import Debug from 'lib/debug'
let debug = Debug('components:graph')

let Graph = React.createClass({

  mixins: [Reflux.listenTo(GraphStore, 'onStateUpdate')],

  propTypes: {
    children: React.PropTypes.node
  },

  contextTypes: {
    router: React.PropTypes.object,
    searchActive: React.PropTypes.bool,
    account: React.PropTypes.object
  },

  childContextTypes: {
    node: React.PropTypes.object,
    user: React.PropTypes.object
  },

  getChildContext() {
    return {
      node: this.state.center,
      user: this.state.user
    }
  },

  getGraphEl() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  onStateUpdate(data, signal) {
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

  addNode(type) {
    let uri = encodeURIComponent(this.state.center.uri)
    this.context.router.push(`/graph/${uri}/add/${type}`)
  },

  // This is the first thing that fires when the user logs in.
  componentDidMount() {
    this.aclAgent = new AclAgent('https://pre.jolocom.webid.de/profile/card')
    const {account} = this.context

    // Instantiating the graph object.
    this.graph = new GraphD3(this.getGraphEl(), 'main')
    // Adding the listeners.
    this.graph.on('center-changed', this._handleCenterChange)
    this.graph.on('select', this._handleSelectNode)
    this.graph.on('view-node', this._handleViewNode)
    this.graph.on('change-rotation-index', this._handleChangeRotationIndex)
    this.graph.on('scrolling-drawn', this._handleScrollingDrawn)
    this.graph.on('start-scrolling', this.refs.scrollIndicator._handleClick)

    if (this.props.params.node) {
      if (this.props.params.node == account.webId) {
        debug('Home node (componentDidMount): redirecting to /graph')
        this.context.router.push(`/graph/`)
      }
      else {
        debug('Navigating to node (componentDidMount)', this.props.params.node)
        graphActions.navigateToNode({uri: this.props.params.node},
                                    {uri: this.context.account.webId,
                                     name: this.context.account.username})
      }
    }
    else if (account.webId) {
      debug('Navigating to default node', account.webId)
      // Load graph when user is logged in
      graphActions.getInitialGraphState(account.webId)
    }
    
  },
  
  // @TODO combine with componentWillUpdate ?
  componentDidUpdate(prevProps) {    
    // We do not want to center the graph on the person we're viewing the
    // full-screen profile of.
    
    let fullscreenView = this.props.routes.length == 3 // /graph/[uri]/view
    let viewChanged = prevProps.routes.length != this.props.routes.length
    let nodeChanged = prevProps.params.node !== this.props.params.node // .uri?
      
    // In case we disconnected from the node in full-screen view, we want to
    // navigate to the center node again (refresh) if viewChanged, even though
    // the center node will inevitably be the same (nodeChanged == false)
    if (!fullscreenView && (nodeChanged || viewChanged)) {
      if (this.props.params.node &&
          this.props.params.node == this.context.account.webId) {
        debug('Home node (componentDidUpdate): redirecting to /graph')
        this.context.router.push(`/graph/`)
      }
      else {
        let nodeUri = this.props.params.node || this.context.account.webId
        debug('Navigating to node (componentDidUpdate)', nodeUri)
        
        if (this.props.params.node) {
          graphActions.navigateToNode({uri: nodeUri},
                                      {uri: this.context.account.webId,
                                       name: this.context.account.username})
        }
        else {
          graphActions.navigateToNode({uri: nodeUri})
        }
      }
    }
  },

  componentWillUnmount() {
    if (this.graph) {
      this.graph.eraseGraph()
      this.graph.removeAllListeners()
    }
  },

  componentWillUpdate(newProps, newState, newContext) {
    let uri

    if (newState.activeNode &&
        newState.activeNode !== this.state.activeNode) {
      uri = encodeURIComponent(newState.activeNode.uri)
      this.context.router.push(`/graph/${uri}/view`)
    }
    else if (newContext.account.webId &&
             newContext.account.webId !== this.context.account.webId) {
      graphActions.getInitialGraphState(newContext.account.webId)
    }
  },

  _handleSelectNode(node, svg) {
    this.aclAgent.removeAllow(node.uri, 'write')
    graphActions.setState('selected', svg)
  },

  _handleChangeRotationIndex(rotationIndex) {
    graphActions.changeRotationIndex(rotationIndex, false)
  },

  _handleCenterChange(node) {
    this.aclAgent.commitIndex()
    this.context.router.push(`/graph/${encodeURIComponent(node.uri)}/`)
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

    let children = React.Children.map(this.props.children, (el) => {
      return React.cloneElement(el, {
        node: this.state.activeNode,
        center: this.state.center,
        navHistory: this.state.navHistory,
        state: this.state
      })
    })

    return (
      <div style={styles.container}>
        <IndicatorOverlay ref="scrollIndicator" />
        <div style={styles.chart} ref="graph"></div>

        {fab}

        {children}
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
