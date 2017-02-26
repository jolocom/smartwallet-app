import WebIDAgent from './webid.js'
import LDPAgent from './ldp.js'
import {Writer} from '../rdf.js'
import {PRED} from 'lib/namespaces'
import Util from '../util.js'
import D3Convertor from 'lib/d3-converter'

import $rdf from 'rdflib'

// Graph agent is responsible for fetching $rdf data from the server, parsing
// it, and creating a "map" of the currently displayed graph.

class GraphAgent extends LDPAgent {

  /**
   * @summary Populate a object wtih basic / generic node triples.
   * @param {string} uri - The uri of the current node
   * @param {object} writer - A object it adds the triples to
   * @param {string} title - The Name / Title of the node
   * @param {string} description - The Description of a node
   * @param {string} nodeType - The type of the node
   * @return {object} node - The inicial writer with added triples
   */
  baseNode(uri, writer, title, description, nodeType, centerNode) {
    if (!writer || !nodeType || !uri) {
      throw new Error('baseNode: not enough arguments')
    }

    if (title) {
      writer.addTriple($rdf.sym(uri), PRED.title, $rdf.literal(title))
    }
    if (description) {
      writer.addTriple(
        $rdf.sym(uri),
        PRED.description,
        $rdf.literal(description)
      )
    }
    writer.addTriple($rdf.sym(uri), PRED.storage, $rdf.sym(centerNode.storage))
    writer.addTriple($rdf.sym(uri), PRED.maker, $rdf.sym(centerNode.uri))

    // TODO
    if (nodeType === 'image') {
      writer.addTriple($rdf.sym(uri), PRED.type, PRED.Image)
    } else {
      writer.addTriple($rdf.sym(uri), PRED.type, PRED.Document)
    }
    return writer
  }

  /**
   * @summary Adds the image triples to an existing ndoe and uploads an image
   * @param {string} uri - The uri of the current node
   * @param {string} dstContainer - The uri of the folder where the image goes
   * @param {object} writer - A object it adds the triples to
   * @param {blob} image - The image itself
   * @param {bool} confidential - If the img is to be confidential
   */

  addImage(uri, dstContainer, writer, image, confidential) {
    if (!writer || !image) {
      throw new Error('addImage: not enough arguments')
    }
    if (image instanceof File) {
      let imgUri = `${dstContainer}files/${this.randomString(5)}`
      writer.addTriple($rdf.sym(uri), PRED.image, $rdf.literal(imgUri))
      return this.storeFile(imgUri, '', image, confidential)
    }
    writer.addTriple($rdf.sym(uri), PRED.image, $rdf.literal(image))
    return
  }

  checkImages(nodes) {
    return Promise.all(nodes.map(node => {
      const img = node.img
      if (!img) {
        return
      }
      return this.head(this._proxify(img)).catch((e) => {
        node.img = ''
      })
    }))
  }

  /**
   * @summary Returns all friends a profile has.
   * @param {string} uri - The uri of the profile file.
   */

  findFriends(uri) {
    return this.fetchTriplesAtUri(uri).then(res => {
      return this.findTriples(uri, $rdf.sym(uri), PRED.knows, undefined)
    })
  }

  /**
   * @summary Curates the creation of a new node, delegates to other functions.
   * @param {string} currentUser - Current webID, used for creating acl.
   *                 and connecting to the onwer.
   * @param {object} centerNode - A object describing the center node.
   * @param {string} title - The title of the node.
   * @param {string} description - The description of the new node.
   * @param {blob} image - The image if there's one.
   * @param {string} nodeType - The type [image / text] of the node.
   * @param {bool} confidential - If the img is to be confidential.
   */
  createNode(currentUser, centerNode, nodeInfo) {
    const writer = new Writer()
    const {confidential, title, description, nodeType, image} = nodeInfo
    const newNodeUri = centerNode.storage + this.randomString(5)

    return this.createAcl(newNodeUri, currentUser, confidential)
    .then((uri) => {
      const des = description
      this.baseNode(newNodeUri, writer, title, des, nodeType, centerNode)

      if (image) {
        const storage = centerNode.storage
        return this.addImage(newNodeUri, storage, writer, image, confidential)
      }
    }).then(() => {
      return this.put(Util.uriToProxied(newNodeUri), writer.end(), {
        'Content-Type': 'text/turtle'
      })
    }).then(() => {
      let type = nodeType === 'passport'
        ? 'passport'
        : 'generic'

      return this.linkNodes(centerNode.uri, type, newNodeUri)
    }).then(() => {
      return newNodeUri.uri
    })
  }

  _randomString() {
    return Util.randomString(5)
  }

  // Should we remove the ACL file associated with it as well?
  // PRO : we won't need the ACL file anymore
  // CON : it can be a parent ACL file, that would
  // result in other children loosing the ACL as well.

  deleteFile(uri) {
    return this.delete(Util.uriToProxied(uri))
  }

  storeFile(finUri, dstContainer, file, confidential = false) {
    const uri = finUri || `${dstContainer}files/${this.randomString(5)}`
    const webId = this._getWebId() || (() => {
      throw new Error('No webId detected.')
    })()
    return this.createAcl(finUri, webId, confidential).then(() => {
      return this.put(Util.uriToProxied(uri), file, {
        'Content-Type': 'image'
      }).then(() => uri).catch((e) => {
        throw new Error('Could not upload the image')
      })
    })
  }

  _getWebId() {
    const wia = new WebIDAgent()
    return wia.getWebId()
  }
  // We create only one type of ACL file. Owner has full controll,
  // everyone else has read access. This will change in the future.
  // @TODO Optimize slightly.
  createAcl(uri, webId, confidential = false) {
    const writer = new Writer()
    const aclUri = `${uri}.acl`
    const owner = $rdf.sym(`${aclUri}#owner`)

    const tripleMap = [
      {pred: PRED.type, obj: [PRED.auth]},
      {pred: PRED.access, obj: [$rdf.sym(uri), $rdf.sym(aclUri)]},
      {pred: PRED.agent, obj: [$rdf.sym(webId)]},
      {pred: PRED.mode, obj: [PRED.read, PRED.write, PRED.control]}
    ]

    tripleMap.forEach(st => {
      st.obj.forEach(obj => {
        writer.addTriple(owner, st.pred, obj)
      })
    })

    if (!confidential) {
      const all = $rdf.sym(`${aclUri}#readall`)
      writer.addTriple(all, PRED.type, PRED.auth)
      writer.addTriple(all, PRED.access, $rdf.sym(uri))
      writer.addTriple(all, PRED.agentClass, PRED.Agent)
      writer.addTriple(all, PRED.mode, PRED.read)
    }

    return this.put(Util.uriToProxied(aclUri), writer.end(), {
      'Content-Type': 'text/turtle'
    }).then(() => {
      return aclUri
    }).catch(e => {})
  }

  /**
   * @summary Adds a new triple to an $rdf file.
   * @params {object} uri - The uri of the file to add the triples to.
   * @params {array | object} triples - array of objets describing triples.
   * @params {boolean} draw - play the animation or not.
   * @return {function} fetch request - .then contains the response.
   */

  writeTriples(uri, tripsToWrite) {
    const toAdd = $rdf.graph()
    return this.fetchTriplesAtUri(uri).then(fetchedTrips => {
      const writer = new Writer()
      writer.addAll(fetchedTrips)
      tripsToWrite.forEach(t => {
        if (writer.find(t.subject, t.predicate, t.object).length === 0) {
          toAdd.add(t.subject, t.predicate, t.object)
        }
      })
    }).then(() => {
      return this.patch(this._proxify(uri), [], toAdd.statements)
    })
  }

  /**
   * @summary Deletes a triple from an $rdf file.
   *
   * @param {string} uri -  the file we are removing from
   * @param {object} subject - subject of the triple we are deleting
   * @param {object} predicate - predicate of the triple we are deleting
   * @param {object} object - object of the triple we are deleting
   * Or
   * @param {object} {uri: uri, triples: [{subj,pred,obj}, {subj,pred,obj}..]}
   * @return {promise} fetch request - .then contains the response.
   */

  // uri, subj, pred, obj
  // {uri:uri, triples:[]}
  deleteTriples(...args) {
    let subject, predicate, object
    let triples = []
    let uri

    // Check if we received only one object with more triples.
    if (args.length === 1) {
      ({uri} = args[0])
      triples = args[0].triples
    } else {
      ([uri, subject, predicate, object] = args)
      triples = [{subject, predicate, object}]
    }

    const toDel = $rdf.graph()
    toDel.addAll(triples)

    return this.patch(this._proxify(uri), toDel.statements, [])
  }

  // This function gets passed a center uri and it's triples,
  // and then finds all possible links that we choose to display.
  // After that it parses those links for their RDF data.
  getNeighbours(triples) {
    const links = [
      PRED.knows.uri,
      PRED.isRelatedTo.uri,
      PRED.isRelatedTo_HTTP.uri,
      PRED.passport.uri
    ]
    const neighbours = triples.filter((t) =>
      links.indexOf(t.predicate.uri) >= 0)
    const graphMap = []

    return Promise.all(neighbours.map(neighb => {
      return this.fetchTriplesAtUri(neighb.object.uri).then((result) => {
        if (!result.unav) {
          result.triples.connection = neighb.predicate.uri
          result.triples.uri = neighb.object.uri
          graphMap.push(result.triples)
        }
      })
    })).then(() => {
      return graphMap
    })
  }

  /**
   * @summary Given a uri, returns a JS object we can render
   *   describing the rdf file there.
   * @param {string} uri - The uri of the rdf file.
   * @return {object} node - JS object describing the node ready for render.
   */
  getFileModel(uri) {
    return this.fetchTriplesAtUri(uri).then(triples => {
      triples.triples.uri = uri
      return this.convertToNodes('a', [triples.triples])
    })
  }

  /**
   * @summary Given an array of triples, converts it to a JS object
   *  that is ready to be rendered.
   * @param {string} r - The rank of the node (center | adjacent)
   * @param {array | arrays} Triples - The triples describing the file.
   * @return {object} node - JS object describing the node ready for render.
   */
  convertToNodes(r, triples) {
    const result = []
    triples.forEach(triple => {
      result.push((new D3Convertor()).convertToD3(r, triple))
    })
    return result
  }

  getGraphMapAtUri(uri) {
    return this.fetchTriplesAtUri(uri).then(centerTriples => {
      return this.getNeighbours(centerTriples.triples).then(neibTrips => {
        const firstNode = centerTriples.triples
        firstNode.uri = uri
        return [firstNode].concat(neibTrips)
      })
    })
  }

  linkNodes(start, type, end) {
    const predMap = {
      'generic': PRED.isRelatedTo,
      'knows': PRED.knows,
      'passport': PRED.passport
    }

    return Promise.all([
      this.head(this._proxify(start)),
      this.head(this._proxify(end))
    ]).then(() => {
      const predicate = predMap[type]
      let payload = {
        subject: $rdf.sym(start),
        predicate,
        object: $rdf.sym(end)
      }
      return this.writeTriples(start, [payload])
    }).catch(e => {
      return
    })
  }
}

export default GraphAgent
