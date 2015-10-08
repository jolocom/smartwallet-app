// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/

import React from 'react/addons'
import Reflux from 'reflux'
import {History} from 'react-router'
import classNames from 'classnames'

import Util from 'lib/util.js'
import GraphAgent from 'lib/agents/graph.js'
import GraphD3 from 'lib/graph'

import STYLES from 'styles/app.js'

import FabMenu from 'components/common/fab-menu.jsx'
import FabMenuItem from 'components/common/fab-menu-item.jsx'

import Pinned from 'components/graph/pinned.jsx'

import NodeActions from 'actions/node'
import NodeStore from 'stores/node'

let graphAgent = new GraphAgent()

let Graph = React.createClass({

  mixins: [
    Reflux.connect(NodeStore, 'nodes'),
    History
  ],

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
    this.arrangeNodesInACircle(state.nodes)
    return state
  },

  centerAtWebID: function() {
    // render relevant information in UI
    graphAgent.fetchWebIdAndConvert().then((d3graph) => {
      let newState = this._changeCenter(d3graph.center, d3graph)
      newState.identity = d3graph.center
      this.setState(newState)
    })
  },

  //TODO: has to fetch uri and all the uri's objects, if they're not in the same doc
  centerAtURI: function(uri) {
    //TODO: should only crawl if the uri is external(?)

    // render relevant information in UI
    graphAgent.fetchAndConvert(uri)
      .then((d3graph) => {
        let newState = this._changeCenter(uri, d3graph)
        this.setState(newState)
      })
  },

  getGraphEl() {
    return React.findDOMNode(this.refs.graph)
  },

  componentDidMount: function() {
    this.graph = new GraphD3(this.getGraphEl(), this.props, this.state, this.handleNodeClick, this.handleDragEnd, this.handleLongTap)
    this.centerAtWebID()
  },

  componentWillUpdate: function(nextProps, nextState) {
    this.graph.beforeUpdate(this.state, nextState)
  },

  componentDidUpdate: function(prevProps, prevState) {
    this.graph.update(prevState, this.state)
  },

  showNode(node) {
    // @TODO user proper id
    let uri = encodeURIComponent(node.uri || 'current-node-id')
    this.history.pushState(null, `/graph/${uri}`)
  },

  handleLongTap(distance) {
    if (distance > 40) {
      this.showNode(this.state.centerNode.node)
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
        this.showNode(node)
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
        this.centerAtURI(targetUri)
      }
    }

    //self.closeInbox()
  },

  addNode: function(node) {
    // @Justas: this pushes fake node & connections into d3
    // and is called by the 'plus'-button and the 'inbox' (see `./mobile-js/mobile.js`)
    let fullNode = {
      description: 'A New Node',
      fixed: false,
      index: this.state.nodes.length,
      name: undefined, //'https://test.jolocom.com/2013/groups/moms/card#g',
      px: STYLES.width / 2, //undefined, //540,
      py: STYLES.height * 3/4, //undefined, //960,
      title: 'NewNode',
      type: 'uri',
      uri: 'fakeURI' +(Math.random() * Math.pow(2, 32)), //'https://test.jolocom.com/2013/groups/moms/card#g',
      weight: 5,
      x: undefined, //539.9499633771337,
      y: undefined //960.2001464914653
    }

    this.enrich(node, fullNode)

    let link = { source: node,
             target: this.state.centerNode.node }

    let p = null
    if (node.newNode) {
      console.log('creating a new one')
      p = graphAgent.createAndConnectNode(node.title, node.description, this.state.centerNode.uri, this.state.identity)
    } else {
      console.log('connecting existing node')
      p = graphAgent.connectNode(this.state.centerNode.uri, node.uri)
    }

    p.then(() => {
      this.state.links.push(link)
      this.state.nodes.push(node)

      //TODO: connect node in database

      let state = {
        identity: this.state.identity,
        centerNode: this.state.centerNode,
        previewNode: this.state.previewNode,
        nodes: this.state.nodes,
        inboxNodes: this.state.inboxNodes,
        inboxCount: this.state.inboxCount,
        historyNodes: this.state.historyNodes,
        newNodeURI: node.uri,  // will lit up on GraphD3 update
        links: this.state.links,
        literals: this.state.literals,
        plusDrawerOpen: this.state.plusDrawerOpen
      }

      this.setState(state)
    })
  },

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

  togglePlusDrawer: function() {
    this.setState({
      plusDrawerOpen: !this.state.plusDrawerOpen
    })
  },

  togglePinned() {
    this.setState({
      showPinned: !this.state.showPinned
    })
  },

  toggleSearch() {
    this.setState({
      showSeach: !this.state.showSearch
    })
  },

  showSearch() {
    this.setState({
      showSearch: true
    })
  },

  hideSearch() {
    this.setState({
      showSearch: false
    })
  },

  resetSearch() {
  },

  render() {
    let classes = classNames('jlc-graph', {
      'jlc-search-active': this.state.showSearch
    })

    return (
      <div className={classes}>
        <FabMenu>
          <FabMenuItem icon="comment" label="Comment"/>
          <FabMenuItem icon="insert_photo" label="Image"/>
          <FabMenuItem icon="attachment" label="File"/>
          <FabMenuItem icon="person" label="Contact"/>
        </FabMenu>

        <div className="jlc-graph-chart" ref="graph"></div>

        <Pinned/>
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

export default Graph
