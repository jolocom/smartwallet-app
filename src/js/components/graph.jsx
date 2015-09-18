// @see http://nicolashery.com/integrating-d3js-visualizations-in-a-react-app/

import React from 'react/addons'
import {AppBar, IconButton, FontIcon} from 'material-ui'

import Util from 'lib/util.js'
import GraphAgent from 'lib/graph-agent.js'
import GraphD3 from 'lib/graph'

import STYLES from 'styles/app.js'
import Chat from './chat.jsx'
import {Inbox, InboxCounter} from './inbox.jsx'
import PlusDrawer from './plus-drawer.jsx'

import NavActions from 'actions/nav'

let Graph = React.createClass({
  getInitialState: function() {
    return {
      graph: new GraphD3(null, null, this.state, this.handleNodeClick, this.handleDragEnd, this.handleLongTap),
      identity: null,
      centerNode: null,
      previewNode: null,
      nodes: [],
      inboxNodes: [],
      inboxCount: 0,
      historyNodes: [],
      links: [],
      literals: [],
      chatOpen: false,
      inboxOpen: false,
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
    GraphAgent.fetchWebIdAndConvert().then((d3graph) => {
      let newState = this._changeCenter(d3graph.center, d3graph)
      newState.identity = d3graph.center
      this.setState(newState)
    })
  },

  //TODO: has to fetch uri and all the uri's objects, if they're not in the same doc
  centerAtURI: function(uri) {
    //TODO: should only crawl if the uri is external(?)

    // render relevant information in UI
    GraphAgent.fetchAndConvert(uri)
      .then((d3graph) => {
        let newState = this._changeCenter(uri, d3graph)
        this.setState(newState)
      })
  },

  componentDidMount: function() {
    // Initialize d3 graph
    this.state.graph.create(null, this.props, this.state)

    this.centerAtWebID()
  },

  componentWillUpdate: function(nextProps, nextState) {
    nextState.graph.beforeUpdate(null, this.state, nextState)
  },

  componentDidUpdate: function(prevProps, prevState) {
    this.state.graph.update(null, prevState, this.state)
  },

  handleNodeClick: function(node) {
    if(node.uri == this.state.previewNode.uri) return
    this.state.previewNode = {
      node: node,
      uri: node.uri
    }

    this.setState(this.state)
  },

  handleDragEnd: function(node, distance, verticalOffset) {
    if(node == this.state.centerNode.node){
      if(distance < 40){
        this.showChat()
      } else if(verticalOffset < STYLES.height / 3) {
        // perspective node can be dragged into inbox (top of screen)
        this.addNodeToInbox(node)
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

  handleLongTap: function(distance) {
    if(distance > 40){
      let state = {
        graph: this.state.graph,
        identity: this.state.identity,
        centerNode: this.state.centerNode,
        previewNode: this.state.previewNode,
        nodes: this.state.nodes,
        inboxNodes: this.state.inboxNodes,
        inboxCount: this.state.inboxCount,
        historyNodes: this.state.historyNodes,
        links: this.state.links,
        literals: this.state.literals,
        chatOpen: this.state.chatOpen,
        inboxOpen: true,
        plusDrawerOpen: this.state.plusDrawerOpen
      }

      this.setState(state)
    }
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
      p = GraphAgent.createAndConnectNode(node.title, node.description, this.state.centerNode.uri)
    } else {
      console.log('connecting existing node')
      p = GraphAgent.connectNode(this.state.centerNode.uri, node.uri)
    }

    p.then(() => {
      this.state.links.push(link)
      this.state.nodes.push(node)

      //TODO: connect node in database

      let state = {
        graph: this.state.graph,
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
        chatOpen: this.state.chatOpen,
        inboxOpen: this.state.inboxOpen,
        plusDrawerOpen: this.state.plusDrawerOpen
      }

      this.setState(state)
    })
  },

  showChat: function() {
    let state = {
      graph: this.state.graph,
      identity: this.state.identity,
      centerNode: this.state.centerNode,
      previewNode: this.state.previewNode,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      inboxCount: this.state.inboxCount,
      historyNodes: this.state.historyNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: true,
      inboxOpen: this.state.inboxOpen,
      plusDrawerOpen: this.state.plusDrawerOpen
    }
    this.setState(state)
  },

  addNodeToInbox: function(d) {

    // FIXME: not guaranteed to be unique
    if (this.state.inboxNodes.filter((n) => n.name && n.name == d.name).length != 0) {
      console.log('Node is already in the inbox!')
      return
    }
    d.id = this.state.inboxNodes.length + 1
    this.state.inboxNodes.push(d)
    let state = {
      graph: this.state.graph,
      identity: this.state.identity,
      centerNode: this.state.centerNode,
      previewNode: this.state.previewNode,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      inboxCount: this.state.inboxCount + 1,
      historyNodes: this.state.historyNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: this.state.chatOpen,
      inboxOpen: this.state.inboxOpen,
      plusDrawerOpen: this.state.plusDrawerOpen
    }
    this.setState(state)
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

  hideChat: function() {
    let state = {
      graph: this.state.graph,
      identity: this.state.identity,
      centerNode: this.state.centerNode,
      previewNode: this.state.previewNode,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      inboxCount: this.state.inboxCount,
      historyNodes: this.state.historyNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: false,
      inboxOpen: this.state.inboxOpen,
      plusDrawerOpen: this.state.plusDrawerOpen
    }

    this.setState(state)
  },

  togglePlusDrawer: function() {
    let state = {
      graph: this.state.graph,
      identity: this.state.identity,
      centerNode: this.state.centerNode,
      previewNode: this.state.previewNode,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      inboxCount: this.state.inboxCount,
      historyNodes: this.state.historyNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: this.state.chatOpen,
      inboxOpen: this.state.inboxOpen,
      plusDrawerOpen: !this.state.plusDrawerOpen
    }

    this.setState(state)
  },

  openInbox: function() {
    let state = {
      graph: this.state.graph,
      identity: this.state.identity,
      centerNode: this.state.centerNode,
      previewNode: this.state.previewNode,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      inboxCount: this.state.inboxCount,
      historyNodes: this.state.historyNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: this.state.chatOpen,
      inboxOpen: true,
      plusDrawerOpen: this.state.plusDrawerOpen
    }

    this.setState(state)
  },

  closeInbox: function() {
    let state = {
      graph: this.state.graph,
      identity: this.state.identity,
      centerNode: this.state.centerNode,
      previewNode: this.state.previewNode,
      nodes: this.state.nodes,
      inboxNodes: this.state.inboxNodes,
      inboxCount: this.state.inboxCount,
      historyNodes: this.state.historyNodes,
      links: this.state.links,
      literals: this.state.literals,
      chatOpen: this.state.chatOpen,
      inboxOpen: false,
      plusDrawerOpen: this.state.plusDrawerOpen
    }

    this.setState(state)
  },

  _toggleNav() {
    NavActions.toggle()
  },

  render() {
    return (
      <div id="graph-outer">

        <header>
          <AppBar
            title="Graph"
            onLeftIconButtonTouchTap={this._toggleNav}
            iconElementRight={<IconButton><FontIcon className="material-icons">search</FontIcon></IconButton>}
          />
        </header>

        { /* TODO: structure, ids and class names suck*/ }
        <div id="wrapper">
          <div id="plus_button" onClick={this.togglePlusDrawer}/>

          {this.state.plusDrawerOpen ? <PlusDrawer graph={this.state.graph} toggle={this.togglePlusDrawer} addNode={this.addNode} addNodeToInbox={this.addNodeToInbox}/> : ''}

          <div id="inbox_container">
            { this.state.inboxCount > 0 ? <InboxCounter onClick={this.openInbox} count={this.state.inboxCount}/> : ''}

            { this.state.inboxOpen ? <Inbox onClick={this.closeInbox} nodes={this.state.inboxNodes} addNode={this.addNode}/> : ''}
          </div>


          <div id="graph">
            <div id="chart"/>
          </div>
        </div>
        { this.state.chatOpen ? <Chat identity={this.state.identity} topic={this.state.centerNode.uri} origin={this.state.centerNode.uri} graph={this.state.graph} hide={this.hideChat}/> : ''}
      </div>
   )
  }
})


export default Graph
