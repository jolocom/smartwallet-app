// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/

import React from 'react'
import ReactDOM from 'react-dom'
import Radium from 'radium'
import Reflux from 'reflux'
import classNames from 'classnames'

import Util from 'lib/util.js'
import GraphAgent from 'lib/agents/graph.js'
import GraphD3 from 'lib/graph'

import STYLES from 'styles/app.js'

import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'

import NodeActions from 'actions/node'
import NodeStore from 'stores/node'

import PinnedNodes from './pinned.jsx'

import rdf from 'rdflib'
let graphAgent = new GraphAgent()

let Graph = React.createClass({

  mixins: [
    Reflux.connect(NodeStore, 'nodes')
  ],

  contextTypes: {
    history: React.PropTypes.any
  },

  childContextTypes: {
    node: React.PropTypes.string
  },

  getChildContext: function() {
    return {
      node: this.props.params.node
    }
  },

  getInitialState: function() {
    return {
      identity: null,
      centerNode: null,
      previewNode: null,
      inboxNodes: [],
      inboxCount: 0,
      historyNodes: [],
      links: [],
      literals: [],
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false
    }
  },

  // returns altered state
  _changeCenter: function(center, newData) {
    console.log('change center to: ')
    console.log(center)
    let dataSource = newData ? newData : this.state

    let res = {
      nodes: dataSource.nodes,
      links: dataSource.links,
      literals: dataSource.literals
    }

    let cn = res.nodes.filter((n) => n.uri == center)[0]

    let state = {
      graph: this.state.graph,
      identity: this.state.identity,
      centerNode: {
        node: cn,
        uri: cn.uri
      },
      previewNode: {
        node: cn,
        uri: cn.uri
      },
      nodes: res.nodes,
      inboxNodes: this.state.inboxNodes,
      inboxCount: this.state.inboxCount,
      historyNodes: this.state.historyNodes,
      links: res.links,
      literals: res.literals,
      chatOpen: this.state.chatOpen,
      inboxOpen: this.state.inboxOpen,
      plusDrawerOpen: this.state.plusDrawerOpen
    }

    //this.showNode(center)

    this.arrangeNodesInACircle(state.nodes)
    return state
  },

  centerAtWebID: function() {
    graphAgent._getWebIdGraphScheme().then((d3graph) => {
      let newState = this._changeCenter(d3graph.center, d3graph)
      newState.identity = d3graph.center
      this.setState(newState)
    })
  },

  //TODO: has to fetch uri and all the uri's objects, if they're not in the same doc
  centerAtURI: function(uri) {
    //TODO: should only crawl if the uri is external(?)
    // render relevant information in UI
    graphAgent._getUriGraphScheme(uri)
      .then((d3graph) => {
        let newState = this._changeCenter(uri, d3graph)
        this.setState(newState)
      })
  },


  getGraphEl() {
    return ReactDOM.findDOMNode(this.refs.graph)
  },

  componentDidMount: function() {
    this.graph = new GraphD3(this.getGraphEl(), this.props, this.state, this.handleNodeClick, this.handleDragEnd, this.handleLongTap)
    if (this.props.params.node) {
      this.centerAtURI(this.props.params.node)
    } else {
      this.centerAtWebID()
    }
  },

  componentWillUpdate: function(nextProps, nextState) {
    this.graph.beforeUpdate(this.state, nextState)
  },

  componentDidUpdate: function(prevProps, prevState) {
    let uri

    if (prevProps.params.node !== this.props.params.node) {
      this.centerAtURI(this.props.params.node)
      return
    }

    let isIdentity = this.state.identity === this.state.centerNode.uri

    if (!prevState.centerNode && this.state.centerNode && isIdentity) {
      uri = encodeURIComponent(this.state.centerNode.uri)
      this.context.history.replaceState(null, `/graph/${uri}`)
    }
    this.graph.update(prevState, this.state)
  },

  showNode(uri) {
    uri = encodeURIComponent(uri || 'current-node-id')
    this.context.history.pushState(null, `/graph/${uri}`)
  },

  showNodeDetails(uri) {
    // @TODO user proper id
    uri = encodeURIComponent(uri || 'current-node-id')
    this.context.history.pushState(null, `/graph/${uri}/details`)
  },

  handleLongTap(distance) {
    if (distance > 40) {
      this.showNodeDetails(this.state.centerNode.node.uri)
    }
  },

  handleNodeClick(node) {
    if (node == this.state.centerNode.node) {
      // this.showNode(node)
    } else if(node.uri !== this.state.previewNode.uri) {
      this.setState({
        previewNode: {
          node: node,
          uri: node.uri
        }
      })
    }
  },

  handleDragEnd: function(node, distance, verticalOffset) {
    if (node == this.state.centerNode.node){
      if (distance < 40){
        this.showNodeDetails(node.uri)
      } else if (verticalOffset < STYLES.height / 3) {
        // perspective node can be dragged into inbox (top of screen)
        NodeActions.pin(node)
      }
    } else {
      // surrounding nodes can be dragged into focus (center of screen)
      if(Util.distance(node.x,
                    node.y,
                    STYLES.width / 2,
                    STYLES.height / 2)
          < STYLES.width * (3/8)){


        let old = this.state.nodes.filter((n) => n.uri == this.state.centerNode.uri)[0]
        let oldCenter = {
          node: old,
          uri: old.uri
        }
        this.state.historyNodes.push(oldCenter)

        let targetUri = this.state.nodes.filter((n) => n.uri == node.uri)[0].uri
        // this.centerAtURI(targetUri)
        this.showNode(targetUri)
      }
    }

    //self.closeInbox()
  },

  // addNode: function(node) {
  //   // @Justas: this pushes fake node & connections into d3
  //   // and is called by the 'plus'-button and the 'inbox' (see `./mobile-js/mobile.js`)
  //   let fullNode = {
  //     description: 'A New Node',
  //     fixed: false,
  //     index: this.state.nodes.length,
  //     name: undefined, //'https://test.jolocom.com/2013/groups/moms/card#g',
  //     px: STYLES.width / 2, //undefined, //540,
  //     py: STYLES.height * 3/4, //undefined, //960,
  //     title: 'NewNode',
  //     type: 'uri',
  //     uri: 'fakeURI' +(Math.random() * Math.pow(2, 32)), //'https://test.jolocom.com/2013/groups/moms/card#g',
  //     weight: 5,
  //     x: undefined, //539.9499633771337,
  //     y: undefined //960.2001464914653
  //   }
  //
  //   this.enrich(node, fullNode)
  //
  //   let link = { source: node,
  //            target: this.state.centerNode.node }
  //
  //   let p = null
  //   if (node.newNode) {
  //     console.log('creating a new one')
  //     p = graphAgent.createAndConnectNode(node.title, node.description, this.state.centerNode.uri, this.state.identity)
  //   } else {
  //     console.log('connecting existing node')
  //     p = graphAgent.connectNode(this.state.centerNode.uri, node.uri)
  //   }
  //
  //   p.then(() => {
  //     this.state.links.push(link)
  //     this.state.nodes.push(node)
  //
  //     //TODO: connect node in database
  //
  //     let state = {
  //       identity: this.state.identity,
  //       centerNode: this.state.centerNode,
  //       previewNode: this.state.previewNode,
  //       nodes: this.state.nodes,
  //       inboxNodes: this.state.inboxNodes,
  //       inboxCount: this.state.inboxCount,
  //       historyNodes: this.state.historyNodes,
  //       newNodeURI: node.uri,  // will lit up on GraphD3 update
  //       links: this.state.links,
  //       literals: this.state.literals,
  //       plusDrawerOpen: this.state.plusDrawerOpen
  //     }
  //
  //     this.setState(state)
  //   })
  // },

  pinNode: function(d) {
    NodeActions.pin(d)
  },

  enrich: function (less, more){
    // add any missing keys of `more` to `less`
    for(var k in more){
      if((more.hasOwnProperty(k)) && (less[k] == undefined)){
        less[k] = more[k]
      }
    }
  },

  arrangeNodesInACircle: function(nodes) {
    let angle = (2 * Math.PI)/ nodes.length
    let halfwidth = (STYLES.width / 2)
    let halfheight = (STYLES.height / 2)
    for(var i in nodes){
      if(nodes[i].x){
        // skip (old) nodes that already have a position
        continue
      }
      nodes[i].x = nodes[i].px =
        Math.cos(angle * i) * halfwidth + halfwidth
      nodes[i].y = nodes[i].py =
        Math.sin(angle * i) * halfwidth + halfheight
    }
  },

  addNode(type) {
    let uri = encodeURIComponent(this.state.centerNode.uri)
    this.context.history.pushState(null, `/graph/${uri}/add/${type}`)
  },

  getStyles() {
    let styles = {
      menu: {
        position: 'absolute',
        bottom: '16px',
        right: '16px'
      }
    }
    return styles
  },

  render() {
    let classes = classNames('jlc-graph')
    let styles = this.getStyles()
    return (
      <div className={classes}>
        <FabMenu style={styles.menu}>
          <FabMenuItem icon="comment" label="Comment" onClick={() => {this.addNode('comment')}}/>
          <FabMenuItem icon="insert_photo" label="Image" onClick={() => {this.addNode('image')}}/>
          <FabMenuItem icon="attachment" label="File" onClick={() => {this.addNode('file')}}/>
          <FabMenuItem icon="person" label="Contact" onClick={() => {this.addNode('person')}}/>
          <FabMenuItem icon="wb_sunny" label="Sensor" onClick={() => {this.addNode('sensor')}}/>
        </FabMenu>

        <div className="jlc-graph-chart" ref="graph"></div>

        {this.props.children}

        <PinnedNodes/>
      </div>
   )
  }
})
//
// <div id="inbox_container">
//   { this.state.inboxCount > 0 ? <InboxCounter onClick={this.openInbox} count={this.state.inboxCount}/> : ''}
//
//   { this.state.inboxOpen ? <Inbox onClick={this.closeInbox} nodes={this.state.inboxNodes} addNode={this.addNode}/> : ''}
// </div>
//             { this.state.chatOpen ? <Chat identity={this.state.identity} topic={this.state.centerNode.uri} origin={this.state.centerNode.uri} graph={this.state.graph} hide={this.hideChat}/> : ''}

export default Radium(Graph)
