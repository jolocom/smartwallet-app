import Reflux from 'reflux'
import nodeActions from 'actions/node'
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

  onRemove(subject, predicate, object){
    this.gAgent.deleteTriple(subject,predicate,object)
  },

  link(start, type, end, flag) {
    let predicate = null
    if(type === 'generic') predicate = SCHEMA('isRelatedTo')
    if(type ==='knows') predicate = FOAF('knows')

    this.gAgent.writeTriple(start, predicate, rdf.sym(end), flag)
  }
})
