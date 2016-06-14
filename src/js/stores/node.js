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
  onRemove(subject, predicate, object, svgNode, node){
    if(node.rank != 'center'){
      this.gAgent.deleteFile(object).then(()=>{
        this.gAgent.deleteTriple(subject,predicate,object).then(()=>{
          graphActions.deleteNode(svgNode, node) 
        })
      }).catch((e)=>{
      console.log('error', e, 'occured while deleting')
      })
    } else {
      this.gAgent.deleteFile(object).then(()=>{
        graphActions.deleteNode(svgNode, node) 
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
