import HTTPAgent from './http.js'
import WebIDAgent from './webid.js'

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

class GraphAgent extends HTTPAgent {

  // We create a rdf file at the distContainer containing a title and description passed to it
  createNode(user, node, title, description, image, type) {
    console.log('drawing the node!')
    let writer = new Writer()

    let dstContainer = node.storage
    let new_node = dstContainer + Util.randomString(5)

    console.log('new node is:', new_node)

    writer.addTriple(rdf.sym(new_node), DC('title'), title)
    writer.addTriple(rdf.sym(new_node), FOAF('maker'), rdf.sym(node.uri))
    
    // Populating the file with the appropriate triples.
    if(description) writer.addTriple(rdf.sym(new_node), DC('description'), description)
    if(type === 'default') writer.addTriple(rdf.sym(new_node), RDF('type') , FOAF('Document'))
    if(type === 'image') writer.addTriple(rdf.sym(new_node), RDF('type') , FOAF('Image'))
    if(node.storage) writer.addTriple(rdf.sym(new_node), NIC('storage'), node.storage)
    else if (user.storage) writer.addTriple(rdf.sym(new_node), NIC('storage'), user.storage)

    // Handling the picture upload
    return new Promise((resolve, reject) => {
      // Is there a case where this does not resolve to true?
      // Check if image is a file
      if (image instanceof File) {
        // If yes we upload it
        this.storeFile(dstContainer, image).then((result) => {
          // and return the uri
          resolve(result.url)
        }).catch((err) => {
          // We catch a error and reject
          reject(err)
        })
        // If not an instance of file, just resolve the image [whatever it is?]
      } else resolve(image)
    }).then((image) => {
      console.log('data')
      console.log('end of data')
      // Here we add the triple to the user's rdf file, this triple connects
      // him to the resource that he uploaded

      if (image) writer.addTriple(rdf.sym(new_node), FOAF('img'), image)
      this.writeTriple(rdf.sym(node.uri), SCHEMA('isRelatedTo'), rdf.sym(new_node)).then(()=> {
        // Should this one be here? Implications of having this triple?
        this.writeTriple(rdf.sym(user.uri), FOAF('made'), rdf.sym(new_node)).then(() => {
          this.postACL(new_node, user.uri).then(()=>{
            $.ajax({
              type: 'PUT',
              // This could be a bnode, and then we have no uri. Edge case, but still
              // Abstract the proxy value into a config value
              url: 'https://proxy.webid.jolocom.de/proxy?url='+new_node,
              // Tell the browser to supply the cookie
              xhrFields: {withCredentials: true},  
              data: writer.end(),
              contentType: 'text/turtle',
              Link: '<http://www.w3.org/ns/ldp#Resource>; rel="type"',
              success: function() {
                console.log('we have a success here!')
                GraphActions.drawNewNode(new_node, SCHEMA('isRelatedTo').uri)
              },
              error: function() {
                console.log('error')  
              }
            })
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
  storeFile(dstContainer, file) {
    let wia = new WebIDAgent()
    return wia.getWebID().then((webID) => {
      let uri = `${dstContainer}files/${Util.randomString(5)}-${file.name}`
      this.postACL(uri, webID)
      return 'test.com'
      //return solid.web.put('https://proxy.webid.jolocom.de/proxy/&url='+uri, file, file.type)
    })
  }

  // THIS WHOLE FUNCTION IS TERRIBLE, MAKE USE OF THE API TODO
  // PUT ACL and WRITE TRIPLE should be called after making sure that the user
  // has write access
  postACL(uri, webID){
    let acl_writer = new Writer()
    let ACL = rdf.Namespace('http://www.w3.org/ns/auth/acl#')
    // TODO, perhaps introduce more potential setups.
    // Current one is creator can do read write control. Everyone else has read acc.

    return solid.web.options(uri).then((res) => {
      console.log(res)
      let acl_uri = res.linkHeaders.acl[0] ? res.linkHeaders.acl[0]
        : acl_uri = uri+'.acl'

      if (acl_uri.indexOf('http://') < 0 || acl_uri.indexOf('https://') < 0)
        acl_uri = uri.substring(0, uri.lastIndexOf('/') + 1) + acl_uri

      console.log(acl_uri)
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
      return new Promise((resolve, reject) => {
        $.ajax({
          type: 'PUT',
          // This could be a bnode, and then we have no uri. Edge case, but still
          // Abstract the proxy value into a config value
          url: 'https://proxy.webid.jolocom.de/proxy?url='+acl_uri,
          // Tell the browser to supply the cookie
          xhrFields: {withCredentials: true},  
          data: acl_writer.end(),
          contentType: 'text/turtle',
          success: function(res) {
            resolve(res)
            console.log('we have a success here!')
          },
          error: function(e) {
            reject(e)
            console.log('error')  
          }
        })
      })
    })
  }

  writeTriple(subject, predicate, object, draw) {

    let newTrip = [rdf.st(subject, predicate, object).toNT()]
    // We probably need more predicates here
    if(draw && (predicate.uri == SCHEMA('isRelatedTo').uri || predicate.uri == FOAF('knows').uri))
      GraphActions.drawNewNode(object.uri, predicate.uri)

    return new Promise((resolve) => {
      $.ajax({
        type: 'PATCH', 
        data: 'INSERT DATA {'+ newTrip[0] +'} ;',
        xhrFields: {withCredentials: true},  
        contentType: 'application/sparql-update',
        url: 'https://proxy.webid.jolocom.de/proxy/?url='+subject.uri,
        success: function(answ, two, three){
          resolve(three)
        }
      })
    })
  }

  // Replaced the put request with a patch request, it's faster, and there's no risk of wiping the whole file.
  deleteTriple(subject, predicate, object){
    let oldTrip = [rdf.st(subject, predicate, object).toNT()]
    let statement = 'DELETE DATA { ' + oldTrip[0] + ' } ;'
    return new Promise((resolve) => {
      $.ajax({
        type: 'PATCH',
        // This could be a bnode, and then we have no uri. Edge case, but still
        // Abstract the proxy value into a config value
        url: 'https://proxy.webid.jolocom.de/proxy?url='+subject.uri,
        // Tell the browser to supply the cookie
        xhrFields: {withCredentials: true},  
        data: statement,
        contentType: 'application/sparql-update',
        success: function(one, two, three) {
          resolve(three)
        },
        error: function() {
          console.log('error')  
        }
      })
    })
  }

  // Perhaps do a promise free version of this.
  fetchTriplesAtUri(uri) {
    // This is new, replaced with an ajax call, might raise bugs.
    let parser = new Parser()
    return new Promise((resolve) => {
      $.ajax({ 
        type: 'GET', 
        url: 'https://proxy.webid.jolocom.de/proxy?url=' + uri, 
        xhrFields: {withCredentials: true},  
        // Take a better look at these callbacks.
        success: function(res_body) { 
          resolve(parser.parse(res_body ,uri))
        }, 
        error: function(){
          console.log('The uri', uri, 'could not be resolved. Skipping')
          // We return this in order to later be able to display it grayed out.
          resolve({uri: uri, unav : true, connection:null,  triples:[]})
        }
      })
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
