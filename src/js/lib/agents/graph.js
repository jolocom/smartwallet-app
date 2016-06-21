import HTTPAgent from './http.js'
import WebIDAgent from './webid.js'

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

class GraphAgent extends HTTPAgent {
  //
  // We create a rdf file at the distContainer containing a title and description passed to it
  createNode(user, node, title, description, image, type) {

    let writer = new Writer()

    let dstContainer = node.storage
    let new_node = dstContainer + Util.randomString(5)

    writer.addTriple(rdf.sym(new_node), DC('title'), title)
    writer.addTriple(rdf.sym(new_node), FOAF('maker'), rdf.sym(node.uri))
    
    // Populating the file with the appropriate triples.
    if(description) writer.addTriple(rdf.sym(new_node), DC('description'), description)
    if(type == 'default') writer.addTriple(rdf.sym(new_node), RDF('type') , FOAF('Document'))
    if(type == 'image') writer.addTriple(rdf.sym(new_node), RDF('type') , FOAF('Image'))
    if(node.storage) writer.addTriple(rdf.sym(new_node), NIC('storage'), node.storage)
    else if (user.storage) writer.addTriple(rdf.sym(new_node), NIC('storage'), user.storage)

    // Handling the picture upload
    return new Promise((resolve, reject) => {
      if (image instanceof File) {
        this.storeFile(dstContainer, image).then((result) => {
          resolve(result.url)
        }).catch((err) => {
          reject(err)
        })
      } else resolve(image)
    }).then((image) => {
      // If the image is there, we add it to the rdf file.
      if (image) writer.addTriple(rdf.sym(new_node), FOAF('img'), image)
      
      // Here we add the triple to the user's rdf file, this triple connects
      // him to the resource that he uploaded
      this.writeTriple(rdf.sym(node.uri), SCHEMA('isRelatedTo'), rdf.sym(new_node)).then(()=> {
        // Should this one be here? Implications of having this triple?
        this.writeTriple(rdf.sym(user.uri), FOAF('made'), rdf.sym(new_node)).then(() => {
          this.postACL(new_node, user.uri).then(()=>{
            solid.web.post(new_node, writer.end()).then(()=>{
              GraphActions.drawNewNode(new_node, SCHEMA('isRelatedTo').uri)
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
    console.log(dstContainer)
    let wia = new WebIDAgent()
    return wia.getWebID().then((webID) => {

      let uri = `${dstContainer}files/${Util.randomString(5)}-${file.name}`
      this.postACL(uri, webID)

      return solid.web.put(uri, file, file.type)
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
      let acl_uri = res.linkHeaders.acl[0] ? res.linkHeaders.acl[0]
        : acl_uri = uri+'.acl'

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
      return solid.web.post(acl_uri, acl_writer.end()).catch((e)=>{
        console.log(e, ' occured while trying to post the acl file.')
      })
    })
  }

  writeTriple(subject, predicate, object, draw) {
   let newTrip = [rdf.st(subject, predicate, object).toNT()]
   // We probably need more predicates here
   if(draw && (predicate.uri == SCHEMA('isRelatedTo').uri || predicate.uri == FOAF('knows').uri))
     GraphActions.drawNewNode(object.uri, predicate.uri)

   return solid.web.patch(subject.uri,null, newTrip)
  }

  // Replaced the put request with a patch request, it's faster, and there's no risk of wiping the whole file.
  deleteTriple(subject, predicate, object){
    let oldTrip = [rdf.st(subject, predicate, object).toNT()]
    return solid.web.patch(subject.uri, oldTrip, null)
  }

  fetchTriplesAtUri(uri) {
    return solid.web.get(uri).then((res)=>{
      let parser = new Parser()
      return parser.parse(res.xhr.response, res.url)
    }).catch(()=>{
      console.log('The uri', uri, 'could not be resolved. Skipping')
      // We return this in order to later be able to display it grayed out.
      return {uri: uri, unav : true, connection:null,  triples:[]}
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
      if (neighbours.length == 0)
        resolve(graphMap)
          
      // If there are adjacent nodes to draw, we parse them and return an array of their triples
      let i = 0
      neighbours.map((triple) => {
        this.fetchTriplesAtUri(triple.object.uri).then((result) =>{
          // This is a node that coulnt't be retrieved, either 404, 401, 403 etc... 
          if (result.triples.length === 0) {
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
