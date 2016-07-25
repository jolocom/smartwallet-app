import WebIDAgent from './webid.js'
import {proxy} from 'settings'
import $ from 'jquery'

import {Parser} from '../rdf.js'
import {Writer} from '../rdf.js'
import solid from 'solid-client'
import Util from '../util.js'
import GraphActions from '../../actions/graph-actions'

import rdf from 'rdflib'
let SCHEMA = rdf.Namespace('https://schema.org/')
let RDF = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let DC = rdf.Namespace('http://purl.org/dc/terms/')
let NIC = rdf.Namespace('http://www.w3.org/ns/pim/space#')

// Graph agent is responsible for fetching rdf data from the server, parsing
// it, and creating a "map" of the currently displayed graph.

// General notes: Abstract the proxy uri to a config value or something like that.

class GraphAgent {

  // We create a rdf file at the distContainer containing a title and description passed to it
  // TODO break this down.
  createNode(currentUser, centerNode, title, description, image, nodeType) {

    let writer = new Writer()
    let dstContainer = centerNode.storage ? centerNode.storage : currentUser.storage
    let newNodeUri = rdf.sym(dstContainer + Util.randomString(5))

    // The boilerplate.
    writer.addTriple(newNodeUri, DC('title'), title)
    writer.addTriple(newNodeUri, NIC('storage'), dstContainer)
    writer.addTriple(newNodeUri, FOAF('maker'), rdf.sym(centerNode.uri))

    // Populating the file with the appropriate triples.
    if(description) 
      writer.addTriple(newNodeUri, DC('description'), description)
    if(nodeType === 'default')
      writer.addTriple(newNodeUri, RDF('type') , FOAF('Document'))
    if(nodeType === 'image')
      writer.addTriple(newNodeUri, RDF('type') , FOAF('Image'))

    // Handling the picture upload
    return new Promise((resolve, reject) => {
      // Check if the image is there and it is a file.
      if (image instanceof File) {
        this.storeFile(dstContainer, image).then((result) => {
          resolve(result)
        }).catch((err) => {
          reject(err)
        })
        // This will resolve to undefined / null
      } else resolve(image)
    }).then((image) => {
      console.log(image, 'this is the uri right here')
      if (image)
        writer.addTriple(newNodeUri, FOAF('img'), image)
      // The predicate here will have to change dynamically as well, based on the chosen predicate.
      this.writeTriple(rdf.sym(centerNode.uri), SCHEMA('isRelatedTo'), newNodeUri).then(()=> {
        this.putACL(newNodeUri.uri, currentUser.uri).then((uri)=>{
          // We use this in the LINK header.
          let aclUri = `<${uri}>`;
          fetch(`${proxy}/proxy?url=${newNodeUri.uri}`,{
            method: 'PUT', 
            credentials: 'include',
            body: writer.end(),
            headers: {
              'Content-Type':'text/turtle',
              'Link': '<http://www.w3.org/ns/ldp#Resource>; rel="type", '+aclUri+' rel="acl"'
            }
          }).then((answer)=>{
            if (answer.ok)
              GraphActions.drawNewNode(newNodeUri.uri, SCHEMA('isRelatedTo').uri)
          }).catch((error)=>{
            console.log('Error,',error,'occured when putting the rdf file.') 
          })
        })
      })
    })
  }
  
  // Should we remove the ACL file associated with it as well? 
  // PRO : we won't need the ACL file anymore CON : it can be a parent ACL file, that would
  // result in other children loosing the ACL as well.
  deleteFile(uri){
    return fetch(`${proxy}/proxy?url=${uri}`, {
      method: 'DELETE',
      credentials: 'include'
    })
  }
  
  storeFile(dstContainer, file) {
    console.log('We are storing the file', file, 'in the destination', dstContainer)
    let wia = new WebIDAgent()
    return wia.getWebID().then((webID) => {
      let uri = `${dstContainer}files/${Util.randomString(5)}-${file.name}`
      return this.putACL(uri, webID).then(()=>{
        return fetch(`${proxy}/proxy?url=${uri}`,{
          method: 'PUT', 
          credentials: 'include',
          headers: {
            'Content-Type':'image' 
          },
          body: file
        }).then(()=>{
          return uri
        }).catch(()=>{
          return undefined
        })
      })
    })
  }

  // THIS WHOLE FUNCTION IS TERRIBLE, MAKE USE OF THE API TODO
  // PUT ACL and WRITE TRIPLE should be called after making sure that the user
  // has write access
  putACL(uri, webID){
    let acl_writer = new Writer()
    let ACL = rdf.Namespace('http://www.w3.org/ns/auth/acl#')
		let acl_uri = `${uri}.acl`

	  /* PROXY currently doesn't return the link header TODO
    return solid.web.options(`${proxy}/proxy?url=${uri}`).then((res) => {
		let acl_uri = res.linkHeaders.acl[0] ? res.linkHeaders.acl[0]
			: acl_uri = uri+'.acl'

		if (acl_uri.indexOf('http://') < 0 || acl_uri.indexOf('https://') < 0)
			acl_uri = uri.substring(0, uri.lastIndexOf('/') + 1) + acl_uri
		*/

		// At the moment we create only one type of ACL file. Owner has full controll,
		// everyone else has read access. This will change in the future.
		acl_writer.addTriple(rdf.sym('#owner'), RDF('type'), ACL('Authorization'))
		acl_writer.addTriple(rdf.sym('#owner'), ACL('accessTo'), rdf.sym(uri))
		acl_writer.addTriple(rdf.sym('#owner'), ACL('accessTo'), rdf.sym(acl_uri))
		acl_writer.addTriple(rdf.sym('#owner'), ACL('agent'), rdf.sym(webID))
		acl_writer.addTriple(rdf.sym('#owner'), ACL('mode'), ACL('Control'))
		acl_writer.addTriple(rdf.sym('#owner'), ACL('mode'), ACL('Read'))
		acl_writer.addTriple(rdf.sym('#owner'), ACL('mode'), ACL('Write'))

		acl_writer.addTriple(rdf.sym('#readall'), RDF('type'), ACL('Authorization'))
		acl_writer.addTriple(rdf.sym('#readall'), ACL('accessTo'), rdf.sym(uri))
		acl_writer.addTriple(rdf.sym('#readall'), ACL('agentClass'), FOAF('Agent'))
		acl_writer.addTriple(rdf.sym('#readall'), ACL('mode'), ACL('Read'))

		return fetch(`${proxy}/proxy?url=${acl_uri}`,{
			method: 'PUT', 
			credentials: 'include',
			body: acl_writer.end(),
			headers: {
				'Content-Type':'text/turtle' 
			}
		}).then(()=>{return acl_uri})
		.catch((e)=>{console.log('error',e,'occured while putting the acl file')})
	//})
  }

  /**
   * @summary Checks if a triple is present in the RDF file at the uri.
   * @param {string} uri - uri of the rdf file. 
   * @param {object} subject - triple subject.
   * @param {object} predicate - triple predicate.
   * @param {object} object - triple object.
   * @returns {boolean} - True if present, False if not.
   */

  isTriplePresent(uri, subject, predicate, object){
    let writer = new Writer()
    return this.fetchTriplesAtUri(uri).then((res)=>{
      for(let t of res.triples)
        writer.addTriple(t.subject, t.predicate, t.object)
      if (writer.g.statementsMatching(subject, predicate, object).length > 0)
        return true
      else 
        return false
    })
  }

  /**
   * @summary Adds a new triple to an rdf file.
   * @params {object} subject - triple subject, also the uri of the file.
   * @params {object} predicate - triple predicate.
   * @params {object} object - triple object.
   * @params {boolean} draw - do we play the node add animation.
   * @return {function} fetch request - .then contains the response. 
   */ 

  writeTriple(subject, predicate, object, draw) {
    let validPredicate = (predicate.uri === SCHEMA('isRelatedTo').uri ||
                          predicate.uri === FOAF('knows').uri)
    return this.isTriplePresent(subject.uri, subject, predicate, object).then((verdict)=>{
      if (!verdict){
        let newTrip = [rdf.st(subject, predicate, object).toNT()]
        return fetch(`${proxy}/proxy?url=${subject.uri}`,{
          method: 'PATCH', 
          credentials: 'include',
          body: 'INSERT DATA { ' + newTrip[0] + ' } ;',
          headers: {
            'Content-Type':'application/sparql-update' 
          }
        }).then((result) => {
          if (result.ok && draw && validPredicate)
            GraphActions.drawNewNode(object.uri, predicate.uri)
        })
      } else {
        console.warn('Triple already present in the rdf file.') 
      }
    })
  }

  /**
   * @summary Deletes a triple from an rdf file.
   * @params {object} subject - triple subject, also the uri of the file.
   * @params {object} predicate - triple predicate.
   * @params {object} object - triple object.
   * @return {function} fetch request - .then contains the response. 
   */ 
  
  deleteTriple(subject, predicate, object){
    let oldTrip = [rdf.st(subject, predicate, object).toNT()]
    return fetch(`${proxy}/proxy?url=${subject.uri}`,{
      method: 'PATCH', 
      credentials: 'include',
      body: 'DELETE DATA { ' + oldTrip[0] + ' } ;',
      headers: {
        'Content-Type':'application/sparql-update' 
      }
    })
  }

  
  // This takes a standard URI, it proxies the request itself. 
  fetchTriplesAtUri(uri) {
    let parser = new Parser()
    return fetch(`${proxy}/proxy?url=${uri}`, {
      credentials: 'include' 
    }).then((ans) => {
      if (ans.ok){
				console.log(ans.headers.get('Content-Type'))
        return ans.text().then((res)=>{
          return parser.parse(res, uri) 
        })
        // This is later used for displaying broken nodes.
      } else return {uri: uri, unav : true, connection:null,  triples:[]} 
    })
	} 

  // This function gets passed a center uri and it's triples, and then finds all possible
  // links that we choose to display. After that it parses those links for their RDF data.
  getNeighbours(center, triples) {
    // We will only follow and parse the links that end up in the neighbours array.
    let Links = [FOAF('knows').uri, SCHEMA('isRelatedTo').uri, 'http://schema.org/isRelatedTo']
    let neighbours = triples.filter((t) =>  Links.indexOf(t.predicate.uri) >= 0)
    return new Promise ((resolve) => {
      let graphMap = []
      // If there are no adjacent nodes to draw, we return an empty array.
      if (neighbours.length === 0)
        resolve(graphMap)
      // If there are adjacent nodes to draw, we parse them and return an array of their triples
      let i = 0
      neighbours.map((triple) => {
        this.fetchTriplesAtUri(triple.object.uri).then((result) =>{
          // This is a node that coulnt't be retrieved, either 404, 401, 403 etc... 
          if (result.unav ) {
            // We are setting the connection field of the node, we need it 
            // in order to be able to dissconnect it from our center node later.
            result.connection = triple.predicate.uri
            graphMap.push(result)
            i += 1
          } else {
            // This is a valid node.
            result.triples.connection = triple.predicate.uri
            graphMap.push(result.triples)
            graphMap[graphMap.length - 1].uri = triple.object.uri
          }
          if (graphMap.length === neighbours.length) {
            console.log('Loading done,', i,'rdf files were / was skipped.')
            resolve(graphMap)
          }
        })
      })
    })
  }

//Both getGraphMapAtUri and getGraphMapAtWebID return an array of nodes, each
//node being represented as an array of triples that define it. The result
//is pretty much a "map" of the currently displayed graph.

  getGraphMapAtUri(uri) {
    return new Promise((resolve) => {
      this.fetchTriplesAtUri(uri).then((centerNode) => {
        this.getNeighbours(uri, centerNode.triples).then((neibTriples) => {
          let nodes = [centerNode.triples]
          nodes[0].uri = uri
          // Flattening now results in the final structure of
          // [array[x], array[x], array[x]...]
          neibTriples.forEach(element => {
            nodes.push(element)
          })
          resolve(nodes)
        })
      })
    })
  }

//Calls the above function, but passes the current webId as the URI.
  getGraphMapAtWebID() {
    let wia = new WebIDAgent()
    return wia.getWebID().then((webId) => this.getGraphMapAtUri(webId))
  }
}

export default GraphAgent
