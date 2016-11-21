import Reflux from 'reflux'
import GraphAgent from '../lib/agents/graph.js'
import graphActions from '../actions/graph-actions'
import accountActions from '../actions/account'
import Utils from 'lib/util'
import D3Convertor from '../lib/d3-converter'

import Debug from 'lib/debug'
let debug = Debug('stores:graph')

export default Reflux.createStore({
  listenables: [graphActions],

  getInitialState: function() {
    return this.state
  },

  init: function() {
    this.listenTo(accountActions.logout, this.onLogout)
    this.listenTo(accountActions.login.completed, this.onLogin)
    this.gAgent = new GraphAgent()
    this.convertor = new D3Convertor()

    this.state = {
      // These state keys describe the graph
      webId: null,
      center: null,
      neighbours: null,
      loading: false,
      initialized: false,
      newNode: null,
      navHistory: [],
      selected: null,
      rotationIndex: 0,
      // These describe the ui
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false,
      activeNode: null
    }
  },

  onLogout() {
    this.initialized = false
    this.state = {
      // Graph related
      webId: null,
      center: null,
      neighbours: null,
      loading: false,
      initialized: false,
      newNode: null,
      navHistory: [],
      selected: null,
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

  /*
  -- We use onRefresh() and do a reloading of the graph for now
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
  */

  dissconnectNode: function() {
    // Animation / removing from the neighb array will go here.
  },

  // This sends Graph.jsx and the Graph.js files a signal to add
  // new ndoes to the graph
  onDrawNewNode: function(object, predicate) {
    // This fetches the triples at the newly added file,
    // it allows us to draw it the graph accurately
    this.gAgent.fetchTriplesAtUri(object).then((result) => {
      // Adding the extra value to the object, the URI, it's usefull later.
      result.triples.uri = object
        // Now we tell d3 to draw a new adjacent node on the graph,
        // with the info from the triiple file
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

  onGetInitialGraphState() {
    this.state.loading = true
    this.trigger(this.state)

    this.gAgent.getGraphMapAtWebID(this.state.webId).then((triples) => {
      triples[0] = this.convertor.convertToD3('c', triples[0])
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3(
          'a', triples[i], i, triples.length - 1
        )
      }
      graphActions.getInitialGraphState.completed(triples)
    }).catch(graphActions.getInitialGraphState.failed)
  },

  onGetInitialGraphStateCompleted(result) {
    this.state.center = result[0]
    this.state.neighbours = result.slice(1, result.length)
    this.state.initialized = true
    this.state.loading = false
    this.trigger(this.state)
  },

  // TODO, show an error perhaps.
  onGetInitialGraphStateFailed: function () {
    this.state.loading = false
    this.state.initialized = true

    this.trigger(this.state)
  },

  onRefresh: function() {
    debug('Refreshing the graph with current center', this.state.center.uri)
    this.drawAtUri(this.state.center.uri)
  },

  // TODO - make sure loading works.
  drawAtUri(uri, hisNodesToPop = 0) {
    /*
    this.state.loading = true
    this.trigger(this.state)
    */

    return this.gAgent.getGraphMapAtUri(uri).then((triples) => {
      this.state.loading = false
      this.state.center = this.convertor.convertToD3('c', triples[0])

      this.state.neighbours = []
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3(
          'a', triples[i], i, triples.length - 1
        )
        this.state.neighbours.push(triples[i])
      }

      for (let i = 0; i < hisNodesToPop; i++) {
        this.state.navHistory.pop()
      }

      this.trigger(this.state)
    })
  },

  // TODO - make sure loading works.
  onNavigateToNode(node, defaultHistoryNode) {
    /*
    this.state.loading = true
    this.trigger(this.state)
    */

    this.state.rotationIndex = 0

    this.gAgent.getGraphMapAtUri(node.uri).then((triples) => {
      // Deciding which node to display as history.
      let historyCandidate
      if (this.state.center && this.state.center.uri) {
        historyCandidate = this.state.center
      } else {
        historyCandidate = defaultHistoryNode
      }

      // If we travel to a history node, pop it from the history.
      if (node.connection === 'hist') {
        for (let i = 0; i <= node.histLevel; i++) {
          this.state.navHistory.pop()
        }
      } else {
        // If we travel to a normal node, check if it is in history
        // and then short circuit it.
        let foundIndex = 0
        if (this.state.navHistory.length > 1) {
          for (let i = 0; i < this.state.navHistory.length; i++) {
            if (this.state.navHistory[i].uri === node.uri) {
              foundIndex = i
              break
            }
          }
          if (foundIndex) {
            this.state.navHistory = this.state.navHistory.slice(0, foundIndex)
          }
        }
        // Travel to normal node, that is not in history, simply add it to his.
        if (!foundIndex) {
          this.state.navHistory.push(historyCandidate)
        }
      }

      this.state.center = this.convertor.convertToD3('c', triples[0])
      this.state.neighbours = []
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3(
          'a', triples[i], i, triples.length - 1
        )
        this.state.neighbours.push(triples[i])
      }

      // this.state.loading = false
      this.trigger(this.state)
    })
  },

  // TODO - make sure loading works.
  onViewNode(node) {
    if (!node) {
      debug('Ignoring onViewNode because node is null.')
      return
    }

    /* activeNode is the node we're viewing the full-screen view of
    this.state.activeNode = node
    this.state.loading = false
    this.trigger(this.state)
    */
  }
})
