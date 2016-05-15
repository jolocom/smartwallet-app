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

// Graph agent is responsible for fetching rdf data from the server, parsing
// it, and creating a "map" of the currently displayed graph.

class GraphAgent extends HTTPAgent {

  // We create a rdf file at the distContainer containing a title and description passed to it
  createNode(currentUser, currentNode, title, description, image, type) {
    let writer = new Writer()
    // The randomly generated uri of the new rdf file
    let draw = true
    this.writeAccess(currentUser, currentNode).then((res) => {
      if (res == false) {
        draw = false
      }
      let dstContainer = currentUser.substring(0, currentUser.indexOf('profile'))
      let uri = dstContainer + Util.randomString(5)

      writer.addTriple(rdf.sym(uri), DC('title'), title)
      writer.addTriple(rdf.sym(uri), SCHEMA('isRelatedTo'), rdf.sym(currentNode))
      writer.addTriple(rdf.sym(uri), FOAF('maker'), rdf.sym(currentUser))
      if (description) {
        writer.addTriple(rdf.sym(uri), DC('description'), description)
      }

      if(type == 'default') writer.addTriple(rdf.sym(uri), RDF('type') , FOAF('Document'))
      if(type == 'person') writer.addTriple(rdf.sym(uri), RDF('type') , FOAF('Person'))
      if(type == 'company') writer.addTriple(rdf.sym(uri), RDF('type') , FOAF('Organization'))
      if(type == 'image') writer.addTriple(rdf.sym(uri), RDF('type') , FOAF('Image'))
      // Schema represents this better, perhaps use schema for everything eventually TODO
      if(type == 'event') writer.addTriple(rdf.sym(uri), RDF('type') , SCHEMA('Event'))

      return new Promise((resolve, reject) => {
        if (image instanceof File) {
          this.storeFile(currentUser, dstContainer, image).then((result) => {
            resolve(result.url)
          }).catch((err) => {
            reject(err)
          })
        } else {
          resolve(image)
        }
      }).then((image) => {
        // If the image is there, we add it to the rdf file.
        if (image) {
          writer.addTriple(rdf.sym(uri), FOAF('img'), image)
        }
        // Here we add the triple to the user's rdf file, this triple connects
        // him to the resource that he uploaded
        this.writeTriple(currentNode, SCHEMA('isRelatedTo'), rdf.sym(uri)).then(()=> {
          this.writeTriple(currentUser, FOAF('made'), rdf.sym(uri)).then(() => {
            if (draw)
              GraphActions.drawNewNode(uri)
            return solid.web.put(uri, writer.end())
          })
        })
      })
    })
  }

  storeFile(currentUser, dstContainer, file) {
    let uri = `${dstContainer}files/${Util.randomString(5)}-${file.name}`
    return solid.web.put(uri, file, file.type)
  }

  // Takes the current web ID and the link to the file we want to write to and
  // returns a bool saying wheather or not you are allowed to write to that uri.
  writeAccess(webId, node_uri) {

    let writer = new Writer()
    return new Promise((resolve) => {
      this.fetchTriplesAtUri(node_uri).then((file) =>{
        for (var i = 0; i < file.triples.length; i++) {
          let triple = file.triples[i]
          writer.addTriple(triple.subject, triple.predicate, triple.object)
        }
        let author = writer.g.statementsMatching(undefined, FOAF('maker'), undefined)[0].object.uri
        if (author == webId) {
          console.log('Write access granted')
          resolve(true)
        } else {
          console.log('No write access')
          resolve(false)
        }
      })
    })
  }


  writeTriple(subject, predicate, object) {

    let writer = new Writer()
    subject = rdf.sym(subject)
    // First we fetch the triples at the webId/uri of the user adding the triple
    return new Promise((resolve) => {
      this.fetchTriplesAtUri(subject.uri).then((file) => {
        for (var i = 0; i < file.triples.length; i++) {
          let triple = file.triples[i]
          writer.addTriple(triple.subject, triple.predicate, triple.object)
        }
        writer.addTriple(subject, predicate, object)
        // Then we serialize the object to Turtle and PUT it's address.
        solid.web.put(subject.uri, writer.end()).then(resolve)
      })
    })
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
    let Links = [FOAF('knows').uri, SCHEMA('isRelatedTo').uri, FOAF('maker').uri]
    console.log(Links)
    let neighbours = triples.filter((t) => t.subject.uri == center && Links.indexOf(t.predicate.uri) >= 0)
    console.log(neighbours)
    return new Promise ((resolve) => {
      let graphMap = []
      // If there are no adjacent nodes to draw, we return an empty array.
      if (neighbours.length == 0){
        resolve(graphMap)
        console.warn('No neighbours found')
      }
      // If there are adjacent nodes to draw, we parse them and return an array of their triples
      neighbours.map((triple) => {
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
  getGraphMapAtWebID(username) {
    let wia = new WebIDAgent()
    return wia.getWebID(username).then((webId) => this.getGraphMapAtUri(webId))
  }
}

export default GraphAgent
