import Reflux from 'reflux'
import graphAgent from '../lib/agents/graph.js'
import graphActions from '../actions/graph-actions'
import accountActions from '../actions/account'
import Utils from 'lib/util'
import d3Convertor from '../lib/d3-converter'

import Debug from 'lib/debug'
let debug = Debug('stores:graph')

export default Reflux.createStore({
  listenables: [graphActions],

  init: function(){
    this.listenTo(accountActions.logout, this.onLogout)
    this.listenTo(accountActions.login.completed, this.onLogin)
    this.gAgent = new graphAgent()
    this.convertor = new d3Convertor()
    this.loaded = false


    this.state = {
      //These state keys describe the graph
      webId: null,
      user: null,
      center: null,
      neighbours: null,
      loaded: false,
      newNode: null,
      navHistory: [],
      selected: null,
      rotationIndex: 0,
      previousRenderedNodeUri: null,
      //These describe the ui
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false,
      activeNode: null
    }
  },

  onLogout() {
    this.loaded = false
    this.state = {
      // Graph related
      webId: null,
      user: null,
      center: null,
      neighbours: null,
      loaded: false,
      newNode: null,
      navHistory: [],
      selected: null,
      previousRenderedNodeUri: null,
      // UI related
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false,
      activeNode: null
    }
  },

  onLogin(username, webId) {
    this.state.webId = webId
  },

  // These two are needed in order to transition between the preview graph and
  // The actual graph.
  onEraseGraph: function () {
    this.trigger(null, 'erase')
  },

  onSetState: function(key, value, flag) {
    this.state[key] = value
    if (flag) this.trigger(this.state)
  },

  onChangeRotationIndex: function (rotationIndex, flag) {
    this.state['rotationIndex'] = rotationIndex
    if (flag) this.trigger(this.state, 'changeRotationIndex')
  },

  deleteNode: function(node){
    let nodeId = node.index > 0 ? node.index : node.uri
    for (let i = this.state.neighbours.length -1 ; i >= 0; i--){
     let sourceId = node.index > 0 ? this.state.neighbours[i].index
       : this.state.neighbours[i].uri
     if (sourceId === nodeId)
       this.state.neighbours.splice(i, 1)
    }
    this.state.activeNode = node
    this.trigger(this.state, 'nodeRemove')
  },

  dissconnectNode: function(){
    // Animation / removing from the neighb array will go here.
  },



  // This sends Graph.jsx and the Graph.js files a signal to add new ndoes to the graph
  onDrawNewNode: function(object, predicate){
    // This fetches the triples at the newly added file, it allows us to draw it
    // the graph accurately
    this.gAgent.fetchTriplesAtUri(object).then((result) => {
      // Adding the extra value to the object, the URI, it's usefull later.
      result.triples.uri = object
        // Now we tell d3 to draw a new adjacent node on the graph, with the info from
        // the triiple file
      result.triples.connection = predicate
      return result.triples
    }).then(this.gAgent.hydrateNodeConfidentiality).then((triples) => {
      this.state.newNode = this.convertor.convertToD3('a', triples)
      this.state.neighbours.push(this.state.newNode)
      this.trigger(this.state)
    })
  },

  // Is called by both graph.jsx and preview.jsx, we differentiate the caller
  // this way making sure that we update the right component.
  onGetState: function(source) {
    this.trigger(this.state, source)
  },

  onGetInitialGraphState: function (webId) {
    this.gAgent.getGraphMapAtWebID(webId).then((triples) => {
      triples[0] = this.convertor.convertToD3('c', triples[0])
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)
      }
      graphActions.getInitialGraphState.completed(triples)
    }).catch(graphActions.getInitialGraphState.failed)
  },

  onGetInitialGraphStateCompleted: function (result) {
    this.state.center = result[0]
    this.state.neighbours = result.slice(1, result.length)
    this.state.loaded = true
    this.state.user = result[0]
    this.trigger(this.state)
  },

  drawAtUri: function (uri, number) {
    return this.gAgent.getGraphMapAtUri(uri).then((triples) => {
      this.state.neighbours = []
      triples[0] = this.convertor.convertToD3('c', triples[0])
      this.state.center = triples[0]
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)
        this.state.neighbours.push(triples[i])
      }
      for (let i = 0; i < number; i++) {
        this.state.navHistory.pop()
      }
      this.trigger(this.state)
    })
  },

  onNavigateToNode: function (node, defaultHistoryNode) {
    
    this.state.rotationIndex = 0

    this.gAgent.getGraphMapAtUri(node.uri).then((triples) => {
      this.state.neighbours = []
      triples[0] = this.convertor.convertToD3('c', triples[0])
      
      // Before updating the this.state.center, we push the old center node
      // to the node history

      // We check if we're not navigating to the same node (e.g. went to the
      // full-screen view and then back), in which case we don't want to add
      // the node to the history
      if ((!this.state.previousRenderedNodeUri ||
          this.state.previousRenderedNodeUri !== node.uri)
          &&
          (this.state.center || defaultHistoryNode.uri !== node.uri))
        this.state.navHistory.push(this.state.center || defaultHistoryNode)
        
      this.state.previousRenderedNodeUri = node.uri
      
      this.state.center = triples[0]

      if (this.state.navHistory.length > 1) {
        if (this.state.center.uri === this.state.navHistory[this.state.navHistory.length - 2].uri) {
          this.state.navHistory.pop()
          this.state.navHistory.pop()
        }
        // Removed the brackets, one liners.
        else if (this.state.navHistory.length > 1)
          for (var j = 0; j < this.state.navHistory.length - 1; j++)
            if (this.state.center.uri == this.state.navHistory[this.state.navHistory.length - 2 - j].uri)
              for (var k = 0; k < j + 2; k++)
                this.state.navHistory.pop()
      }

      for (var i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)
        this.state.neighbours.push(triples[i])
      }
      this.trigger(this.state)
    })
  },

  onViewNode(node) {

    if (!node) {
      console.log('Ignoring onViewNode because node is null.')
      return
    }

    this.state.activeNode = node
    
    if (typeof node == 'string') {
      debug('Fetching information and user permisions about the node...')
      var activeNodeInfoP = this.gAgent.fetchTriplesAtUri(node).then((result) => {
        result.triples.uri = node
        this.state.activeNode = node = this.convertor.convertToD3('a', result.triples)
      })
      this.state.activeNode = {uri: node}
    }
    else {
      debug('Fetching user permissions about the node...')
      var activeNodeInfoP = Promise.resolve()
    }

    // Check if the cookie is still valid
    let activeNodePermissionsP = fetch(`${Utils.uriToProxied(this.state.activeNode.uri)}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {		
         'Content-Type':'application/sparql-update'		
      }
    }).then((res)=>{
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      this.state.activeNode.isOwnedByUser = true
    }).catch(() => {
      this.state.activeNode.isOwnedByUser = false
    })

    if (!this.state.center) {
      this.state.center = {}
      this.state.center.isOwnedByUser = false
      var updateCenterNode = Promise.resolve()
    }
    else {
      var centerNodePermissionsP =fetch(
        `${Utils.uriToProxied(this.state.center.uri)}`,
        { method: 'PATCH',
          credentials: 'include',
          headers: {		
            'Content-Type':'application/sparql-update'		
          }
        }
      )
      .then((res)=>{
        if (!res.ok)
          throw new Error(res.statusText)
        this.state.center.isOwnedByUser = true
      }).catch(() => {
        this.state.center.isOwnedByUser = false
      })
    }
    
    activeNodeInfoP
      .then(() => Promise.all([activeNodePermissionsP,centerNodePermissionsP]))
      .then(() => {
        this.trigger(this.state)
      })
  }
})
