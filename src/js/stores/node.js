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
    this.state = {
      uri: null,
      initialized: false
    }
  },

  getInitialState() {
    return this.state
  },

  resetState() {
    this.init()
  },

  create(user, node, title, description, image, type) {
    this.gAgent.createNode(user, node, title, description, image, type)
  },

  onCreateCompleted(node) {
    this.trigger(node)
  },

  onInitiate(uri) {
    this.state.uri = uri
    this.state.initialized = true
    this.trigger(this.state)
  },

  /**
   * @summary Deletes a rdf file and it's connection to the center node
   * and plays the delete animation
   * @param {object} node - the node to be deleted.
   * @param {object} centerNode - we disconnect from this node.
   */

  onRemove(node, centerNode) {
    // Prevent centerNode from being modified by the outside
    // if the state of the graph store changes for instance
    centerNode = Object.assign({}, centerNode)

    let subject = rdf.sym(centerNode.uri)
    let object = rdf.sym(node.uri)

    this.gAgent.deleteFile(object.uri).then((response) => {
      return new Promise((resolve, reject) => {
        if (response.ok) {
          let triples = []
          this.gAgent.findTriples(subject.uri, subject, undefined, object)
          .then((result) => {
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
      }).then((query) => {
        this.gAgent.deleteTriple(query).then((result) => {
          if (result.ok) {
            profileActions.load() // Reload profile info (bitcoin, passport)
            graphActions.refresh()
          }
        })
      })
    })
  },

  /** TODO - update documentation for this function.
   * @summary Disconnects a node from another node.
   * @param {object} subject - triple subject describing connection
   * @param {object} predicate - triple predicate describing connection
   * @param {object} object - triple object describing connection
   */

  onDisconnectNode(...args) {
    let payload
    let {uri} = args[0]

    if (args.length === 2) {
      let {node, centerNode} = args[0]
      payload = {
        uri: centerNode.uri,
        triples: [{
          subject: rdf.sym(centerNode.uri),
          predicate: rdf.sym(node.connection),
          object: rdf.sym(node.uri)
        }]
      }
    } else {
      payload = args[0]
    }
    this.gAgent.deleteTriple(payload)
    .then(function() {
      graphActions.drawAtUri(uri, 0)
    })
  },

  /**
   * @summary Links a node to another node.
   * @param {string} start - subject uri describing connection
   * @param {string} type - predicate uri describing connection
   * @param {string} end - object uri describing connection
   * @param {string} center - the current center node, helps decide
   *                          if we fire the animation.
   */
  link(start, type, end, center) {
    console.log('--------------')
    console.log(start, center)
    console.log('--------------')
    let predicate = null
    if (type === 'generic') {
      predicate = PRED.isRelatedTo
    } else if (type === 'knows') {
      predicate = PRED.knows
    }
    let payload = {
      subject: rdf.sym(start),
      predicate,
      object: rdf.sym(end)
    }
    this.gAgent.writeTriples(start, [payload], start === center)
  }
})
