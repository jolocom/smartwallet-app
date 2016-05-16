import Reflux from 'reflux'
import nodeActions from 'actions/node'
import GraphAgent from 'lib/agents/graph.js'
import webIdAgent from '../lib/agents/webid.js'
import rdf from 'rdflib'
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let SCHEMA = rdf.Namespace('https://schema.org/')

export default Reflux.createStore({
  listenables: nodeActions,

  init() {
    this.gAgent = new GraphAgent()
    this.wia = new webIdAgent()
  },

  getInitialState() {
    return null
  },
  
  create(username, user, title, description, image, type) {
    // We need to check if the currently logged in user can write to the rdfs
    // he is trying to link.
    this.wia.getWebID(username).then((webId) => {
      // Now we have the currently logged in user, next step we need to check
      // if the Maker field of the file he is trying to write to links to him,
      this.gAgent.createNode(webId, user, title, description, image, type)
    })
  },

  onCreateCompleted(node) {
    this.trigger(node)
  },

  link(username, start, end, type) {
    this.wia.getWebID(username).then((webId) => {
      this.gAgent.writeAccess(webId, end).then((verdict) => {
        let predicate = null
        if(type == 'generic') predicate = SCHEMA('isRelatedTo')
        if(type =='knows') predicate = FOAF('knows')
        if(verdict)
          {
          this.gAgent.writeTriple(end, predicate, rdf.sym(start)).then((res) =>{
            console.log('done', res)
          })
        }
      })
    })
  }
})
