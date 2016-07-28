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
    let subject = rdf.sym(centerNode.uri)
    let predicate = rdf.sym(node.connection)
    let object = rdf.sym(node.uri)

    this.gAgent.deleteFile(object.uri).then(()=>{
      // Deleting the connection to the file. 
      this.gAgent.deleteTriple(subject, predicate, object).then(()=>{
        graphActions.deleteNode(node) 
      // Basic error handling
      }).catch((e)=>{console.log('Error', e ,'while removing connection')})
    }).catch((e)=>{console.log('error', e, 'occured while deleting')})
	}, 


  onDisconnectNode(node, centerNode){
    let subject = rdf.sym(centerNode.uri)
    let predicate = rdf.sym(node.connection)
    let object = rdf.sym(node.uri)
    this.gAgent.deleteTriple(subject, predicate, object)
	},

  link(start, type, end, flag) {
    let predicate = null
    if(type === 'generic') predicate = SCHEMA('isRelatedTo')
    if(type ==='knows') predicate = FOAF('knows')
    this.gAgent.writeTriple(rdf.sym(start), predicate, rdf.sym(end), flag)
  }
})
