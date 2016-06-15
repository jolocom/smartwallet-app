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
  onRemove(node, centerNode){
    this.gAgent.deleteFile(node.uri).then(()=>{
      this.gAgent.deleteTriple(centerNode.uri, node.connection, node.uri).then(()=>{
        graphActions.deleteNode(node) 
      }).catch((e)=>{console.log('Error', e ,'while removing connection')})
    }).catch((e)=> {
      console.log('error', e, 'occured while deleting')
    })
  },

  onDissconnectNode(node, centerNode){
    this.gAgent.deleteTriple(centerNode.uri, node.connection, node.uri)
  },

  link(start, type, end, flag) {
    let predicate = null
    if(type === 'generic') predicate = SCHEMA('isRelatedTo')
    if(type ==='knows') predicate = FOAF('knows')

    this.gAgent.writeTriple(start, predicate, rdf.sym(end), flag)
  }
})
