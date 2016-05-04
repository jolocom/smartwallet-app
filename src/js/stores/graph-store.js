import Reflux from 'reflux'
import graphAgent from '../lib/agents/graph.js'
import graphActions from '../actions/graph-actions'
import accountActions from '../actions/account'
import d3Convertor from '../lib/d3-converter'
import STYLES from '../styles/app'
import {Writer} from '../lib/rdf'
import rdf from 'rdflib'
import solid from 'solid-client'
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')

export default Reflux.createStore({

  listenables: [graphActions],

  init: function(){

    this.listenTo(accountActions.logout, this.onLogout)
    this.writer = new Writer()
    this.gAgent = new graphAgent()
    this.convertor = new d3Convertor()
    this.state = {
      //These state keys describe the graph
      user: null,
      center:null,
      neighbours: null,
      loaded: false,
      newNode: null,
      drawn: false,
      highlighted: null,
      linkSubject: null,
      //These describe the ui
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false,
    }
  },

  onSetState: function(state){
      this.state = state
      this.trigger(this.state)
  },

  onAddNode: function(subject, predicate, object){
    // First we fetch the triples at the webId/uri of the user adding the triple
    this.gAgent.fetchTriplesAtUri(subject.uri).then((file) => {
      for (var i = 0; i < file.triples.length; i++) {
        let triple = file.triples[i]
        this.writer.addTriple(triple.subject, triple.predicate, triple.object)
      }
      // Then we add the new triple to the object representing the current file
      // This function also returns true if the operation is successfull and false if not
      // Not the best type of error handling TODO improve later.
      if (this.writer.addTriple(subject, predicate, object))
      {
        // Then we serialize the object to Turtle and PUT it's address.
        solid.web.put(subject.uri, this.writer.end())

        // This fetches the triples at the newly added file, it allows us to draw it
        // the graph accurately
        this.gAgent.fetchTriplesAtUri(object.uri).then((result)=>{
          result.triples.uri = object.uri
          // Now we tell d3 to draw a new adjacent node on the graph, with the info from
          // the triple file
          graphActions.addNode.completed(this.convertor.convertToD3('a', result.triples))
        })
      }
    })
  },

  onAddNodeCompleted: function(node){
    this.state.newNode = node
    this.trigger(this.state)
  },

  onLogout(){
    this.state = {
      // Graph related
      user: null,
      center: null,
      neighbours: null,
      loaded: false,
      newNode: null,
      drawn: false,
      highlighted: null,
      linkSubject: null,
      // UI related
      showPinned:false,
      showSearch: false,
      plusDrawerOpen:false
    }
    this.trigger(this.state)
  },

  onHighlight: function(node) {
    if(!node) this.state.highlighted = null
    else this.state.highlighted = node.uri
    this.trigger(this.state)
  },

  onGetState: function(){
    this.trigger( this.state)
  },

  onGetInitialGraphState: function() {
    this.gAgent.getGraphMapAtWebID().then((triples) => {
      triples[0] = this.convertor.convertToD3('c', triples[0])
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)}
      graphActions.getInitialGraphState.completed(triples)
    })
  },

  onGetInitialGraphStateCompleted: function(result) {
    this.state.center = result[0]
    this.state.neighbours = result.slice(1, result.length)
    this.state.loaded = true
    this.state.user = result[0].uri
    this.trigger(this.state)
  },


  onNavigateToNode: function(node){
    this.state.neighbours = []

    this.gAgent.getGraphMapAtUri(node.uri).then((triples) => {
      triples[0] = this.convertor.convertToD3('c', triples[0])
      this.state.center = triples[0]
      for (var i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)
        this.state.neighbours.push(triples[i])
      }
      this.trigger(this.state, 'redraw')
    })
  }
})
