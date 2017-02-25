import profileActions from 'actions/profile'
import Reflux from 'reflux'
import nodeActions from 'actions/node'
import graphActions from 'actions/graph-actions'
import SnackbarActions from 'actions/snackbar'
import GraphAgent from 'lib/agents/graph'
import AclAgent from 'lib/agents/acl'
import WebIdAgent from 'lib/agents/webid'
import $rdf from 'rdflib'
import {PRED} from 'lib/namespaces'

export default Reflux.createStore({
  listenables: nodeActions,

  init() {
    this.gAgent = new GraphAgent()
    this.state = {
      uri: null,
      initialized: false,
      selectedNdoe: {}
    }
  },

  getInitialState() {
    return this.state
  },

  onGetRemoteNodeInfo(nodeUri) {

  },

  resetState() {
    this.init()
  },

  _getNodeType(graphState, uri) {
    if (graphState.center.uri === uri) {
      return graphState.center
    } else {
      return graphState.neighbours.find(el => {
        return el.uri === uri
      })
    }
  },

  onInitiate(graphState, uri) {
    let getNodeType

    this.state.uri = uri
    const wia = new WebIdAgent()
    const webId = wia.getWebId()
    const centerUri = graphState.center.uri
    const selectedNodeObj = this._getNodeType(graphState, uri)

    if (selectedNodeObj) {
      this.state.selectedNode = selectedNodeObj
      getNodeType = Promise.resolve()
    } else {
      getNodeType = new Promise((resolve, reject) => {
        return this.gAgent.getFileModel(uri).then(res => {
          resolve(res[0])
        })
      })
    }

    let checkCenter = new Promise((resolve, reject) => {
      let aAgent = new AclAgent(centerUri)
      aAgent.initialize().then(() => {
        this.state.centerWritePerm = aAgent.isAllowed(webId, 'write')
        resolve()
      }).catch(() => {
        this.state.centerWritePerm = false
        resolve()
      })
    })

    let checkCurrent = new Promise((resolve, reject) => {
      let aAgent = new AclAgent(uri)
      aAgent.initialize().then((res) => {
        this.state.writePerm = aAgent.isAllowed(webId, 'write')
        resolve()
      }).catch((res) => {
        this.state.writePerm = false
        resolve()
      })
    })

    Promise.all([getNodeType, checkCenter, checkCurrent]).then((res) => {
      if (res[0]) {
        this.state.selectedNode = res[0]
      }
      this.state.initialized = true
      this.trigger(this.state)
    }).catch(() => {
      this.state.initialized = true
      this.trigger(this.state)
    })
  },

  onCreate(
    currentUser,
    centerNode,
    title,
    description,
    image,
    nodeType,
    confidential = false
  ) {
    const node = {title, description, image, nodeType, confidential}
    this.gAgent.createNode(currentUser, centerNode, node).then(uri => {
      graphActions.drawNewNode(uri, PRED.isRelatedTo.uri)
    }).catch(() => {
      SnackbarActions.showMessage('Could not create the node.')
    })
  },

  /**
   * @summary Deletes a rdf file and it's connection to the center node
   * and plays the delete animation
   * @param {object} node - the node to be deleted.
   * @param {object} centerNode - we disconnect from this node.
   * @param {bool} flag - should we remove the link as well?
   */

  onRemove(node, centerNode, flag = true) {
    // Prevent centerNode from being modified by the outside
    // if the state of the graph store changes for instance
    centerNode = Object.assign({}, centerNode)

    let subject = $rdf.sym(centerNode.uri)
    let object = $rdf.sym(node.uri)

    this.gAgent.deleteFile(object.uri).then((response) => {
      return new Promise((resolve, reject) => {
        if (response.ok) {
          let triples = []
          this.gAgent.findTriples(
            subject.uri,
            subject,
            undefined,
            object
          ).then((result) => {
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
        if (flag) {
          this.gAgent.deleteTriples(query).then((result) => {
            if (result.ok) {
              profileActions.load() // Reload profile info (passport)
              graphActions.refresh()
            }
          })
        } else {
          graphActions.refresh()
        }
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
          subject: $rdf.sym(centerNode.uri),
          predicate: $rdf.sym(node.connection),
          object: $rdf.sym(node.uri)
        }]
      }
    } else {
      payload = args[0]
    }
    this.gAgent.deleteTriples(payload)
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
    const predMap = {
      generic: PRED.isRelatedTo,
      knows: PRED.knows
    }
    const pred = predMap[type]
    const rerender = start === center

    this.gAgent.linkNodes($rdf.sym(start), pred, $rdf.sym(end))
      .then(() => {
        if (rerender) {
          graphActions.drawNewNode(end, pred.uri)
        }
      }).catch(e => {
        if (e === 'DUPLICATE') {
          SnackbarActions.showMessage('The nodes are already linked.')
        } else {
          SnackbarActions.showMessage('No permission to link to this node.')
        }
      })
  }
})
