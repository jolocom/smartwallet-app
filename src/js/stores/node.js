import profileActions from 'actions/profile'
import Reflux from 'reflux'
import nodeActions from 'actions/node'
import graphActions from 'actions/graph-actions'
import GraphAgent from 'lib/agents/graph.js'
import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'

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
   * @param {object} centerNode - we disconnect from this node.
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
            profileActions.load() // Reload profile info (bitcoin, passport)
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
    this.gAgent.deleteTriple(subject.uri, subject, predicate, object).then(function(){
      graphActions.drawAtUri(centerNode.uri, 0)
    })
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
    if(type === 'generic') predicate = PRED.isRelatedTo
    if(type ==='knows') predicate = PRED.knows
    let payload = {
      subject: rdf.sym(start),
      predicate,
      object: rdf.sym(end)
    }
    this.gAgent.writeTriples(start, [payload], flag)
  }
})
