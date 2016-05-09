import HTTPAgent from './http.js'
import WebIDAgent from './webid.js'
import {Parser} from '../rdf.js'
import {Writer} from '../rdf.js'
import solid from 'solid-client'
import Util from '../util.js'

let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let DC = rdf.Namespace('http://purl.org/dc/terms/')

import rdf from 'rdflib'

// Graph agent is responsible for fetching rdf data from the server, parsing
// it, and creating a "map" of the currently displayed graph.

class GraphAgent extends HTTPAgent {

  // We create a rdf file at the distContainer containing a title and description passed to it
  createNode(currentUser, dstContainer, title, description, image){
    let writer = new Writer()
    // The uri / 'webId' of the resource, same as it's location on the server.
    // We use a random string as the name in order to make sure it's unique.
    // The string is based off a timestamp
    let uri = dstContainer + Util.randomString(5)
    writer.addTriple(rdf.sym(uri), DC('description'), description)
    writer.addTriple(rdf.sym(uri), DC('title'), title)

    // The maker triple basically links this rdf file to the person who created it.
    writer.addTriple(rdf.sym(uri), FOAF('maker'), currentUser)
    if (image) writer.addTriple(rdf.sym(uri), FOAF('img'), image)
    return solid.web.put(uri, writer.end())
  }

  // I tried rewriting this so that it uses solid.web.get(uri) to fetch the rdf file
  // instead of using XHR, the problem is that solid.web.get(uri) "optimizes" the resource
  // before returning it, for instance some common uris would be written as
  // ../../joachim/card#me. This obviously makes them unparsable, at least for now.
  fetchTriplesAtUri(uri) {
    return this.get(uri)
      .then((xhr) => {
        console.log(xhr.status, ' status code of fetching triples from uri')
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
  }

// This function gets passed a center uri and it's triples, and then finds all possible
// links that we choose to display. After that it parses those links for their RDF data.

  getNeighbours(center, triples) {
    // We will only follow and parse the links that end up in the neighbours array.
    let Links = [FOAF('knows').uri]
    let neighbours = triples.filter((t) => t.subject.uri == center && Links.indexOf(t.predicate.uri) >= 0)


    return new Promise ((resolve) => {
      let graphMap = []
      // If there are no adjacent nodes to draw, we return an empty array.
      if (neighbours.length == 0){
        resolve(graphMap)
        console.warn('No neighbours found')
      }

      // If there are adjacent nodes to draw, we parse them and return an array of their triples
      neighbours.map((triple, index) => {
        this.fetchTriplesAtUri(triple.object.uri).then((triples) =>{

          graphMap.push(triples.triples)
          graphMap[graphMap.length - 1].uri = triple.object.uri
          // This checks if the whole array has been parsed, and only after that resolves.
          if (graphMap.length == neighbours.length) {
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
