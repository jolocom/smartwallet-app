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

  /**
   * @summary Deletes a rdf file and it's connection to the center node
   * and plays the delete animation
   * @param {object} node - the node to be deleted.
   * @param {object} centerNode - we dissconnect from this node.
   */

  onRemove(node, centerNode){

    let subject = rdf.sym(centerNode.uri)
    let object = rdf.sym(node.uri)

    this.gAgent.deleteFile(object.uri).then((response)=>{
      return new Promise((resolve, reject) => {
        if (response.ok){
          let triples = []
          this.gAgent.findTriples(subject.uri, subject, undefined, object).then((result)=>{
            for (let t of result) {
              triples.push({
                subject: t.subject,
                predicate: t.predicate,
                object: t.object   
              })
            } 
            resolve({uri: centerNode.uri, triples})
          }) 
        } else reject('Could not delete file') 
      }).then((query)=>{
        this.gAgent.deleteTriple(query).then((result)=>{
          if (result.ok){
            graphActions.deleteNode(node) 
          }
        })
      })
    })
	}, 

  /**
   * @summary Disconnects a node from another node.
   * @param {object} subject - triple subject describing connection
   * @param {object} predicate - triple predicate describing connection
   * @param {object} object - triple object describing connection
   */

  onDisconnectNode(node, centerNode){
    let subject = rdf.sym(centerNode.uri)
    let predicate = rdf.sym(node.connection)
    let object = rdf.sym(node.uri)
    this.gAgent.deleteTriple(subject.uri, subject, predicate, object)
	},

  /**
   * @summary Links a node to another node.
   * @param {string} start - subject uri describing connection
   * @param {string} type - predicate uri describing connection
   * @param {string} end - object uri describing connection
   * @param {boolean} flag - fire the animation in the graph 
   */

  link(start, type, end, flag) {
    let predicate = null
    if(type === 'generic') predicate = SCHEMA('isRelatedTo')
    if(type ==='knows') predicate = FOAF('knows')
    this.gAgent.writeTriple(rdf.sym(start), predicate, rdf.sym(end), flag)
  }
})
