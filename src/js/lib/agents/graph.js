import WebIDAgent from './webid.js'
import {proxy} from 'settings'

import {Parser} from '../rdf.js'
import {Writer} from '../rdf.js'
import solid from 'solid-client'
import Util from '../util.js'
import GraphActions from '../../actions/graph-actions'
import $ from 'jquery'

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
          resolve(result.url)
        }).catch((err) => {
          reject(err)
        })
        // This will resolve to undefined / null
      } else resolve(image)
    }).then((image) => {
      if (image)
        writer.addTriple(newNodeUri, FOAF('img'), image)
      // The predicate here will have to change dynamically as well, based on the chosen predicate.
      this.writeTriple(rdf.sym(centerNode.uri), SCHEMA('isRelatedTo'), newNodeUri).then(()=> {
        this.putACL(newNodeUri.uri, currentUser.uri).then((uri)=>{
          // We use this in the LINK header.
          let aclUri = '<'+uri+'>;'

          $.ajax({
            type: 'PUT',
            // This could be a bnode, and then we have no uri. Edge case, but still
            url: `${proxy}` + newNodeUri.uri,
            // Tell the browser to supply the cookie
            xhrFields: {withCredentials: true},  
            data: writer.end(),
            contentType: 'text/turtle',
            Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type", '+aclUri+' rel="acl"',
          }).done(() => {
            // We trigger the animation to draw the new node.
            GraphActions.drawNewNode(newNodeUri.uri, SCHEMA('isRelatedTo').uri)
          }).fail((error) => {
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
    return solid.web.del(uri)
  }
  
  // Puts a file to the adress and attaches a ACL file to it.
  // dstContainer is the destination, and the file is the file itself.
  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!! BROKEN TODO !!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  storeFile(dstContainer, file) {
    let wia = new WebIDAgent()
    return wia.getWebID().then((webID) => {
      let uri = `${dstContainer}files/${Util.randomString(5)}-${file.name}`
      this.putACL(uri, webID)
      return 'test.com'
      //return solid.web.put('https://proxy.webid.jolocom.de/proxy/&url='+uri, file, file.type)
    })
  }

  // THIS WHOLE FUNCTION IS TERRIBLE, MAKE USE OF THE API TODO
  // PUT ACL and WRITE TRIPLE should be called after making sure that the user
  // has write access
  putACL(uri, webID){
    let acl_writer = new Writer()
    let ACL = rdf.Namespace('http://www.w3.org/ns/auth/acl#')
    // TODO, perhaps introduce more potential setups.
    // Current one is creator can do read write control. Everyone else has read acc.

    return solid.web.options(uri).then((res) => {
      let acl_uri = res.linkHeaders.acl[0] ? res.linkHeaders.acl[0]
        : acl_uri = uri+'.acl'

      if (acl_uri.indexOf('http://') < 0 || acl_uri.indexOf('https://') < 0)
        acl_uri = uri.substring(0, uri.lastIndexOf('/') + 1) + acl_uri

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

      return $.ajax({
        type: 'PUT',
        // This could be a bnode, and then we have no uri. Edge case, but still
        // Abstract the proxy value into a config value
        url: `${proxy}`+acl_uri,
        // Tell the browser to supply the cookie
        xhrFields: {withCredentials: true},  
        data: acl_writer.end(),
        contentType: 'text/turtle'
      }).done(() => {
        return acl_uri  
      }).fail((e) => {
        console.log('Error ', e, 'found!')
      })
    })
  }

  writeTriple(subject, predicate, object, draw) {

    let newTrip = [rdf.st(subject, predicate, object).toNT()]
    // We probably need more predicates here
    if(draw && (predicate.uri === SCHEMA('isRelatedTo').uri || predicate.uri === FOAF('knows').uri))
      GraphActions.drawNewNode(object.uri, predicate.uri)

    return $.ajax({
      type: 'PATCH', 
      data: 'INSERT DATA {'+ newTrip[0] +'} ;',
      xhrFields: {withCredentials: true},  
      contentType: 'application/sparql-update',
      url: `${proxy}`+subject.uri,
    }).done((body) => {
      return body
    }).fail((e)=>{
      console.log(e, 'occured while writing the connection') 
    })
  }

  // Replaced the put request with a patch request, it's faster, and there's no risk of wiping the whole file.
  deleteTriple(subject, predicate, object){
    let oldTrip = [rdf.st(subject, predicate, object).toNT()]
    return $.ajax({
      type: 'PATCH',
      // This could be a bnode, and then we have no uri. Edge case, but still
      url: `${proxy}` + subject.uri,
      // Tell the browser to supply the cookie
      xhrFields: {withCredentials: true},  
      data: 'DELETE DATA { ' + oldTrip[0] + ' } ;',
      contentType: 'application/sparql-update',
    }).done((body)=>{
      return body 
    }).fail((error)=>{
      console.log(error, 'occured while removing the triple') 
    })
  }

  fetchTriplesAtUri(uri) {
    let parser = new Parser()
    return new Promise((resolve) => {
      $.ajax({ 
        type: 'GET', 
        url: `${proxy}` + uri, 
        xhrFields: {withCredentials: true},  
      }).done((res)=>{
        resolve(parser.parse(res,uri))
      }).fail(()=>{
        console.log('The uri', uri, 'could not be resolved. Skipping')
        resolve({uri: uri, unav : true, connection:null,  triples:[]})
      })
    })
  }

  // This function gets passed a center uri and it's triples, and then finds all possible
  // links that we choose to display. After that it parses those links for their RDF data.
  getNeighbours(center, triples) {
    // We will only follow and parse the links that end up in the neighbours array.
    console.log('URGENT')
    console.log(center)
    console.log(triples)
    console.log('URGENT')
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
          if (graphMap.length == neighbours.length) {
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
