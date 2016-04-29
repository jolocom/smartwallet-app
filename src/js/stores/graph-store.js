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
    this.gAgent = new graphAgent()
    this.convertor = new d3Convertor()
    this.state = {
      //These state keys describe the graph
      center:null,
      neighbours: null,
      loaded: false,
      //These describe the ui
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false,
    }
  },

  onAddNode: function(uri){
    let writer = new Writer()
    this.gAgent.fetchTriplesAtUri(uri).then((result) => {
      for (var i = 0; i < result.triples.length; i++) {
        let triple = result.triples[i]
        writer.addTriple(triple.subject, triple.predicate, triple.object)
      }
      let person = prompt('Introduce the name of the person')
      person = 'https://localhost:8443/' + person + '/profile/card'
      writer.addTriple(rdf.sym('#me'), FOAF('knows'), rdf.sym(person))
      solid.web.put(uri, writer.end())
      this.gAgent.fetchTriplesAtUri(person).then((res)=>{
        console.log(this.convertor.convertToD3(res))
      })
    })
  },

  onLogout(){
    this.state = {
      center: null,
      neighbours: null,
      loaded: false,
      showPinned:false,
      showSearch: false,
      plusDrawerOpen:false
    }
    this.trigger(this.state)
  },

  onGetState: function(){
    this.trigger( this.state)
  },

  onGetInitialGraphState: function() {
    this.gAgent.getGraphMapAtWebID().then((triples) => {
      triples[0] = this.convertor.convertToD3(triples[0])
      for (let i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3(triples[i], i, triples.length - 1)}
      graphActions.getInitialGraphState.completed(triples)
    })
  },

  onGetInitialGraphStateCompleted: function(result) {
    this.state.center = result[0]
    this.state.neighbours = result.slice(1, result.length)
    this.state.loaded = true
    this.trigger(this.state)
  }
})
