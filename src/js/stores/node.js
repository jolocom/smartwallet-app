import Reflux from 'reflux'
import nodeActions from 'actions/node'
import graphActions from 'actions/graph-actions'
import GraphAgent from 'lib/agents/graph.js'
import rdf from 'rdflib'
let SCHEMA = rdf.Namespace('https://schema.org/')

let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')

export default Reflux.createStore({
  listenables: nodeActions,

  init() {
    this.gAgent = new GraphAgent()
  },

  getInitialState() {
    return null
  },

  create(user, node, title, description, image, type) {
    this.gAgent.createNode(user, node, title, description, image, type)
  },

  onCreateCompleted(node) {
    this.trigger(node)
  },

  // On Remove will remove the node itself (RDF file), a function onDisconnect will be introduced later.
  onRemove(state){
    console.log(state)
    if(state.node.rank != 'center'){
      this.gAgent.deleteFile(state.node.uri).then(()=>{
        this.gAgent.deleteTriple(state.center.uri,state.node.connection,state.node.uri).then(()=>{
          graphActions.deleteNode(state.svg, state.node) 
        })
      }).catch((e)=>{
        console.log('error', e, 'occured while deleting')
      })
    } else {
      this.gAgent.deleteFile(state.node.uri).then(()=>{
        graphActions.deleteNode(state.svg, state.node) 
        graphActions.drawAtUri(state.state.navHistory[state.state.navHistory.length - 1].uri, 1)
      }).catch((e)=>{
        console.log('error', e, 'occured while deleting')
      })
    }
  },

  link(start, type, end, flag) {
    let predicate = null
    if(type === 'generic') predicate = SCHEMA('isRelatedTo')
    if(type ==='knows') predicate = FOAF('knows')

    this.gAgent.writeTriple(start, predicate, rdf.sym(end), flag)
  }
})
