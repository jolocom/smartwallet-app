import Reflux from 'reflux'
import graphAgent from '../lib/agents/graph.js'
import graphActions from '../actions/graph-actions'
import accountActions from '../actions/account'
import d3Convertor from '../lib/d3-converter'
import rdf from 'rdflib'
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')

export default Reflux.createStore({

  listenables: [graphActions],

  init: function(){

    this.listenTo(accountActions.logout, this.onLogout)

    this.gAgent = new graphAgent()
    this.convertor = new d3Convertor()

    this.state = {
      //These state keys describe the graph
      user: null,
      center:null,
      neighbours: null,
      loaded: false,
      newNode: null,
      newLink: null,
      drawn: false,
      highlighted: null,
      linkSubject: null,
      linkObject: null,
      // Keeps track of all the nodes we navigated to.
      navHistory: [],
      //These describe the ui
      showPinned: false,
      showSearch: false,
      plusDrawerOpen: false
    }
  },

  onLogout(){
    this.state = {
      // Graph related
      user: null,
      center: null,
      neighbours: null,
      loaded: false,
      newNode: null,
      newLink: null,
      drawn: false,
      highlighted: null,
      linkSubject: null,
      navHistory: [],
      // UI related
      showPinned:false,
      showSearch: false,
      plusDrawerOpen:false
    }
    this.trigger(this.state)
  },

  onSetState: function(state){
    this.state = state
    this.trigger(this.state)
  },

  onChooseSubject: function() {
    // We choose the subject of the new link
    if (this.state.highlighted) this.state.linkSubject = this.state.highlighted
    else this.state.linkSubject = this.state.center.uri
    console.log('we chose the subject to be', this.state.linkSubject)
    this.trigger(this.state)

    graphActions.linkTriple()
  },

  onChooseObject: function() {
    // We choose the object of the new link
    if (this.state.highlighted) this.state.linkObject = this.state.highlighted
    else this.state.linkObject = this.state.center.uri
    this.trigger(this.state)
    console.log('we chose the object to be', this.state.linkObject)
  },

  onLinkTriple: function(){
    // this.state.newLink = rdf.sym(this.state.linkSubject) + FOAF('knows') + rdf.sym(this.state.linkObject)
    graphActions.writeTriple(this.state.linkSubject, FOAF('knows'), this.state.linkObject, ' ')
  },

  createAndConnectNode(title, description, image) {
    // This returns the localhost:8443/name/ this adress is used for now as the container, can be changed later
    let destination = this.state.user.substring(0, this.state.user.length-15)
    // Creating a rdf document.
    // We are passing the current user / creator, the destination where the resource will be put,
    // The title, description and image, these will be put in the according rdf attribute fields.
    this.gAgent.createNode(this.state.user, destination, title, description, image).then((res) => {
      // Once that's done, we add a "User made RDF FILE" triple to the author's rdf File
      // writeTriple will aslo make the d3 add the node dynamically to the graph, now that is not
      // fully supported, and the added node will dissapear upon refresh and have a name of anonymous because
      // it has no name field but a title one
      // TODO, this is a easy addaptation to implement, I will do it in the close future.
      graphActions.writeTriple(this.state.user, FOAF('made'), res.url)
    })
  },
  // @TODO move this away from the store and use gAgent directly in createAndConnect?
  // This writes a new triple into the rdf file
  onWriteTriple: function(subject, predicate, object) {
    this.gAgent.writeTriple(this.state.user, subject, predicate, object).then(() => {
      if(subject.uri === this.state.center.uri) {
        graphActions.drawNewNode(subject, predicate, object)
      }
    }).catch((err) => {
      console.warn(err)
    })
  },

  // This sends Graph.jsx and the Graph.js files a signal to add new ndoes to the graph
  drawNewNode: function(subject, predicate, object){
    // This fetches the triples at the newly added file, it allows us to draw it
    // the graph accurately
    this.gAgent.fetchTriplesAtUri(object.uri).then((result)=>{
      result.triples.uri = object.uri
      // Now we tell d3 to draw a new adjacent node on the graph, with the info from
      // the triple file
      this.state.newNode = this.convertor.convertToD3('a', result.triples)
      this.trigger(this.state)
    })
  },

  onHighlight: function(node) {
    if(!node) this.state.highlighted = null
    else this.state.highlighted = node.uri
    this.trigger(this.state, 'highlight')
  },

  onGetState: function(){
    console.log(this.state, 'this is what we have from onGetState')

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
      // Before updating the this.state.center, we push the old center node
      // to the node history
      this.state.navHistory.push(this.state.center)

      this.state.center = triples[0]
      for (var i = 1; i < triples.length; i++) {
        triples[i] = this.convertor.convertToD3('a', triples[i], i, triples.length - 1)
        this.state.neighbours.push(triples[i])
      }

      this.state.highlighted = null

      this.trigger(this.state, 'redraw')
    })
  }
})
