import WebIDAgent from './webid.js'
import {Parser} from '../rdf.js'
import {Writer} from '../rdf.js'
import {PRED} from 'lib/namespaces'
import Util from '../util.js'
import GraphActions from '../../actions/graph-actions'

import rdf from 'rdflib'

import Debug from 'lib/debug'
let debug = Debug('agents:graph')

// Graph agent is responsible for fetching rdf data from the server, parsing
// it, and creating a "map" of the currently displayed graph.

class GraphAgent {

  /**
   * @summary Populate a object wtih basic / generic node triples.
   * @param {string} uri - The uri of the current node
   * @param {object} writer - A object it adds the triples to
   * @param {string} title - The Name / Title of the node
   * @param {string} description - The Description of a node
   * @param {string} nodeType - The type of the node
   * @return {object} node - The inicial writer with added triples
   */

  baseNode(uri, writer, title, description, nodeType){

    if (title) {
    writer.addTriple(uri, PRED.title, title)
    }
    if (description) {
      writer.addTriple(uri, PRED.description, description)
    }
    if (nodeType === 'default') {
      writer.addTriple(uri, PRED.type, PRED.Document)
    } else if (nodeType === 'image') {
      writer.addTriple(uri, PRED.type, PRED.Image)
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

  addImage(uri,dstContainer, writer, image, confidential) {
    if (image instanceof File){
      let imgUri = `${dstContainer}files/${Util.randomString(5)}-${image.name}`
      writer.addTriple(uri, PRED.image, imgUri)
	    return this.storeFile(imgUri, null, image, confidential)
    } 
    writer.addTriple(uri, PRED.image, image)
    return 
  }

  /**
   * @summary Curates the creation of a new node, delegates to other functions.
   * @param {string} currentUser - Current webID, used for creating acl 
   *                 and connecting to the onwer.
   * @param {object} centerNode - The uri of the folder where the image goes
   * @param {string} title - The title of the node
   * @param {string} description - The description of the node
   * @param {blob} image - The image if there's one
   * @param {string} nodeType - The type [image / text] of the node
   * @param {bool} confidential - If the img is to be confidential
   */
  
  createNode(currentUser, centerNode, title, description, image, nodeType, confidential = false) {

    let writer = new Writer()
    let newNodeUri = rdf.sym(currentUser.storage + Util.randomString(5))
    let aclUri
    return this.createACL(newNodeUri.uri, currentUser.uri, confidential)
    .then((uri) => {
      aclUri = uri
      writer.addTriple(newNodeUri, PRED.storage, currentUser.storage)
      writer.addTriple(newNodeUri, PRED.maker, rdf.sym(centerNode.uri))

      this.baseNode(newNodeUri, writer, title, description, nodeType)
      if (image) {
        return this.addImage(newNodeUri,currentUser.storage,writer,image,confidential)
      }
    }).then(() => {
      // Putting the RDF file for the node.
      return fetch(Util.uriToProxied(newNodeUri.uri), {
        method: 'PUT',
        credentials: 'include',
        body: writer.end(),
        headers: {
          'Content-Type': 'text/turtle',
          'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type", ' +
            aclUri + ' rel="acl"'
        }
      }).then((response) => {
        if (response.ok) {
          return 
        }
        console.warn('An error occured when putting the rdf file.')
      }).catch((error) => {
        console.warn('Error,', error, 'occured when putting the rdf file.')
      })
      // Connecting the node to the one that created it
    }).then(()=> {
      let payload = {
        subject: rdf.sym(centerNode.uri),
        predicate: PRED.isRelatedTo,
        object: newNodeUri
      }
      return this.writeTriples(centerNode.uri, [payload], false)
		}).then(()=>{
		  return newNodeUri.uri
		})
  } 


  // Should we remove the ACL file associated with it as well? 
  // PRO : we won't need the ACL file anymore 
  // CON : it can be a parent ACL file, that would
  // result in other children loosing the ACL as well.
  deleteFile(uri) {
    return fetch(Util.uriToProxied(uri), {
      method: 'DELETE',
      credentials: 'include'
    })
  }

  storeFile(finUri, dstContainer, file, confidential = false) {
		let uri
    let wia = new WebIDAgent()
    return wia.getWebID().then((webID) => {
			if (!finUri) {
        uri = `${dstContainer}files/${Util.randomString(5)}-${file.name}`
			} else {
				uri = finUri
			}
      return this.createACL(uri, webID, confidential).then(() => {
        return fetch(Util.uriToProxied(uri), {
          method: 'PUT',
          credentials: 'include',
          headers: {
            'Content-Type': 'image'
          },
          body: file
        }).then(() => {
					return uri
        }).catch(() => {
      		console.log('error', e, 'occured while putting the image file')
        })
      })
    })
  }


    /* PROXY currently doesn't return the link header TODO
    return solid.web.options(`${proxy}/proxy?url=${uri}`).then((res) => {
    let acl_uri = res.linkHeaders.acl[0] ? res.linkHeaders.acl[0]
      : acl_uri = uri+'.acl'

    if (acl_uri.indexOf('http://') < 0 || acl_uri.indexOf('https://') < 0)
      acl_uri = uri.substring(0, uri.lastIndexOf('/') + 1) + acl_uri
    */

    // We create only one type of ACL file. Owner has full controll,
    // everyone else has read access. This will change in the future.
  // THIS WHOLE FUNCTION IS TERRIBLE, MAKE USE OF THE API TODO
  // PUT ACL and WRITE TRIPLE should be called after making sure that the user
  // has write access

  createACL(uri, webID, confidential = false) {
    let acl_writer = new Writer()
    let acl_uri = `${uri}.acl`
    let owner = rdf.sym('#owner')

    acl_writer.addTriple(owner, PRED.type, PRED.auth)
    acl_writer.addTriple(owner, PRED.access, rdf.sym(uri))
    acl_writer.addTriple(owner, PRED.access, rdf.sym(acl_uri))
    acl_writer.addTriple(owner, PRED.agent, rdf.sym(webID))

    acl_writer.addTriple(owner, PRED.mode, PRED.control)
    acl_writer.addTriple(owner, PRED.mode, PRED.read)
    acl_writer.addTriple(owner, PRED.mode, PRED.write)

    if (!confidential) {
      let all = rdf.sym('#readall')

      acl_writer.addTriple(all, PRED.type, PRED.auth)
      acl_writer.addTriple(all, PRED.access, rdf.sym(uri))
      acl_writer.addTriple(all, PRED.agentClass, PRED.Agent)
      acl_writer.addTriple(all, PRED.mode, PRED.read)
    }

    return fetch(Util.uriToProxied(acl_uri), {
      method: 'PUT',
      credentials: 'include',
      body: acl_writer.end(),
      headers: {
        'Content-Type': 'text/turtle'
      }
    }).then(() => {
      return acl_uri
    })
    .catch((e) => {
      console.log('error', e, 'occured while putting the acl file')
    })
  }

  /**
   * @summary Find the triple in the RDF file at the uri.
   * @param {string} uri - uri of the rdf file. 
   * @param {object} subject - triple subject, undefined for wildcard.
   * @param {object} predicate - triple predicate, undefined for wildcard.
   * @param {object} object - triple object, undefined for wildcard.
   * @returns {array | objects} - All triples matching the description.
   */

  findTriples(uri, subject, predicate, object) {
    let writer = new Writer()
    return this.fetchTriplesAtUri(uri).then((res) => {
      for (let t of res.triples) {
        writer.addTriple(t.subject, t.predicate, t.object)
      }
      return writer.g.statementsMatching(subject, predicate, object)
    })
  }

  /* @summary Finds the objects related to the supplied characteristic.
   * @param {string} uri - The uri of the file to check
   * @param {string} value - The field name we are interested in
   * @return {array | objects} - All objects (in the rdf sense) associated
   * with the value 
   */

  findObjectsByTerm(uri, pred) {
    return new Promise((resolve, reject) => {
      if (!uri) {
        reject('No uri')
      } else {
        let user = rdf.sym(uri) //  + '#me'
        let result = []
        this.findTriples(uri, user, pred, undefined).then((res) => {
          for (let triple of res) {
            result.push(triple.object)
          }
          resolve(result)
        })
      }
    })
  }

  /**
   * @summary Adds a new triple to an rdf file.
   * @params {object} uri - The uri of the file to add the triples to.
   * @params {array | object} triples - array of objets describing triples.
   * @params {boolean} draw - play the animation or not.
   * @return {function} fetch request - .then contains the response. 
   */

  writeTriples(uri, triples, draw) {
    let validPredicate = false

    if (triples.length === 1) {
      let pred = triples[0].predicate.uri
      validPredicate = (pred === PRED.isRelatedTo.uri ||
        pred === PRED.knows.uri)
    }

    let statements = []
    return new Promise((resolve, reject) => {
      for (let i = 0; i < triples.length; i++) {
        let t = triples[i]
        this.findTriples(t.subject.uri, t.subject, t.predicate, t.object)
          .then((res) => {
            if (res.length === 0) {
              statements.push({
                subject: t.subject,
                predicate: t.predicate,
                object: t.object
              })
            } else {
              // Think about this
              return reject('A triple is already present in the file!')
            }
            if (i === triples.length - 1) {
              return resolve()
            }
          })
      }
    }).then(() => {
      statements = statements.map(st => {
        return rdf.st(st.subject, st.predicate, st.object).toNT()
      }).join(' ')

      return fetch(Util.uriToProxied(uri), {
        method: 'PATCH',
        credentials: 'include',
        body: `INSERT DATA { ${statements } } ;`,
        headers: {
          'Content-Type': 'application/sparql-update'
        }
      }).then((res) => {
        // At the moment the animation fires when we only add one triple.
        if (res.ok && draw && validPredicate) {
          let obj = triples[0].object.uri
          let pred = triples[0].predicate.uri
          GraphActions.drawNewNode(obj, pred)
        }
      })
    })
  }


  /**
   * @summary Deletes a triple from an rdf file.
   *
   * @param {string} uri -  the file we are removing from
   * @param {object} subject - subject of the triple we are deleting
   * @param {object} predicate - predicate of the triple we are deleting
   * @param {object} object - object of the triple we are deleting
   * Or
   * @param {object} {uri: uri, triples: [{subj,pred,obj}, {subj,pred,obj}..]}
   * @return {promise} fetch request - .then contains the response. 
   */

  // uri,subj,pred,obj
  // {uri:uri, triples:[]}
  deleteTriple(...args) {
    let subject, predicate, object
    let triples = []
    let uri, query

    // Check if we received only one object with multiple triples in there.
    if (args.length === 1) {
      ({
        uri
      } = args[0])
      triples = args[0].triples
    } else {
      ([uri, subject, predicate, object] = args)
      triples = [{
        subject, predicate, object
      }]
    }

    let statement = triples.map(t => {
      return rdf.st(t.subject, t.predicate, t.object).toNT()
    }).join(' ')

    query = 'DELETE DATA { ' + statement + ' } ;'
    return fetch(Util.uriToProxied(uri), {
      method: 'PATCH',
      credentials: 'include',
      body: query,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    })
  }


  // This takes a standard URI, it proxies the request itself. 
  fetchTriplesAtUri(uri) {
    let parser = new Parser()
    return fetch(Util.uriToProxied(uri), {
      credentials: 'include'
    }).then((ans) => {
      if (!ans.ok)
        throw new Error(ans.status) // Call the catch if response error

      return ans.text().then((res) => {
        return parser.parse(res, uri)
      })
    }).catch((err) => { // Catch is automatically called on network errors only
      let statusCode = err.message
      return {
        uri: uri,
        unav: true,
        connection: null,
        triples: [],
        statusCode: parseInt(statusCode)
      }
    })
  }

  // This function gets passed a center uri and it's triples, 
  // and then finds all possible links that we choose to display.
  // After that it parses those links for their RDF data.
  getNeighbours(center, triples) {
    // We will only follow and parse these links
    let Links = [PRED.knows.uri, PRED.isRelatedTo.uri]
    let neighbours = triples.filter((t) => Links.indexOf(t.predicate.uri) >= 0)

    // If there are adjacent nodes to draw, 
    // we parse them and return an array of their triples
    let neighbourErrors = []
    let graphMap = []

    return Promise.all(neighbours.map((triple) => {
      return this.fetchTriplesAtUri(triple.object.uri).then((result) => {
        console.log('fetchtriplesaturi returns',result)
        // This is a node that coulnt't be retrieved, either 404, 401 etc. 
        if (result.unav) {
          // We are setting the connection field of the node, we need it 
          // in order to be able to dissconnect it from our center node later.

          neighbourErrors.push(triple.object.uri)

          // if forbidden access to node, do not show it
          // (we assume the center node isn't ours then)
          // @TODO find better way to know if we have rights to center node
          if (result.statusCode !== 403) {
            result.connection = triple.predicate.uri
            graphMap.push(result)
          }

        } else {
          // This is a valid node.
          result.triples.connection = triple.predicate.uri
          graphMap.push(result.triples)
          graphMap[graphMap.length - 1].uri = triple.object.uri
        }

      }).catch((err) => {
        neighbourErrors.push(triple.object.uri)
      })
    })).then(() => {
      debug('Loading done,', neighbourErrors.length, 'rdf files were / was skipped : ', neighbourErrors)
      return graphMap
    })
  }

  //Both getGraphMapAtUri and getGraphMapAtWebID return an array of nodes, each
  //node being represented as an array of triples that define it. The result
  //is pretty much a "map" of the currently displayed graph.

  getGraphMapAtUri(uri) {
    debug('getGraphMapAtUri',uri)
    let parser = new Parser()
    
    // centerNode is {prefixes: [...], triples: [...]}
    let getPartialGraphMap = ((centerNode) =>
        this.getNeighbours(uri, centerNode.triples)
          .then((neibTriples) => {
            let firstNode = centerNode.triples
            firstNode.uri = uri
            return [firstNode].concat(neibTriples)
          })
    )
    
    let hydrateNodesConfidentiality = ((nodes) =>
      Promise.all(
        nodes
        .map((node) => {
          if (node.unav || /\/card(?:#me)?$/.test(node.uri))
            return Promise.resolve(node)
          
          // @TODO Get ACL URL by parsing LINK header of RDF file HTTP Response
          let aclUri = node.uri + '.acl'
            
          return fetch(Util.uriToProxied(aclUri), {
            credentials: 'include'
          }).then((ans) => {
            if (!ans.ok)
              throw new Error(ans.status) // Call the catch if response error

            return ans.text().then((res) => {
              let para = parser.parse(res, node.uri + '.acl')

              console.log('ACL : ', node.uri + '.acl')
              console.rdftable(para.triples)

              node.confidential = para.triples.every(
                (triple) => triple.subject.uri == aclUri + '#owner')
              
              console.log('confidential ?',node.confidential)
              return node
            })

          }).catch((e) => {
            console.error('Couldn\'t fetch ACL ' + node.uri + '.acl', e)
            return node
          })
        })
    ))
    
    return this.fetchTriplesAtUri(uri)
      .then(getPartialGraphMap)
      .then(hydrateNodesConfidentiality)
  }

  //Calls the above function, but passes the current webId as the URI.
  getGraphMapAtWebID() {
    let wia = new WebIDAgent()
    return wia.getWebID().then((webId) => this.getGraphMapAtUri(webId))
  }
}

export default GraphAgent
