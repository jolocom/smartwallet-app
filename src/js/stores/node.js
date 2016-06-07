import Reflux from 'reflux'
import nodeActions from 'actions/node'
import GraphAgent from 'lib/agents/graph.js'
import rdf from 'rdflib'
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let SCHEMA = rdf.Namespace('https://schema.org/')

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

  link(webId, start, end, type, flag) {
    this.gAgent.writeAccess(webId, end).then((verdict) => {
      let predicate = null
      // Both are is related to for now, since we don't have any extra behaviour based
      // On the link type, no need to complicate for now.
      if(type == 'generic') predicate = SCHEMA('isRelatedTo')
      if(type =='knows') predicate = SCHEMA('isRelatedTo')
      if(verdict)
        // Needs some error handling perhaps.
        // We pass the true flag here to say that we will draw.
        this.gAgent.writeTriple(end, predicate, rdf.sym(start), flag)
    })
  }
})
