import N3 from 'n3'
import D3Converter from './d3-converter.js'
import WebAgent from './web-agent.js'
import {DC, SIOC} from './namespaces.js'
import {Parser, Writer} from './rdf.js'
import Util from './util.js'

//TODO: this should eventually be replaced with user's workspace
const DEST_CONTAINER = document.location.origin + '/misc/'

let N3Util = N3.Util


// abstraction of WebAgent for graph purposes
class GraphAgent {
  // Post a new node to a container
  //
  // @param {string} title title of the new node.
  // @param {string} description description of the new node.
  // @param {string} newNodeUrl url for the new node
  // @param {string} slug slug for the new node
  // @param {string} dstContainer url indicating container to which the new node should be posted.
  //
  // @return {Promise} promise with the result (TODO: what result)?
  static createNode(title, description, newNodeUrl, slug, dstContainer=DEST_CONTAINER) {
    //TODO

    let writer = new Writer({format: 'N-Triples', prefixes: []})
    writer.addTriple({
      subject: newNodeUrl,
      predicate: DC.title,
      object: N3Util.createLiteral(title)
    })
    writer.addTriple({
      subject: newNodeUrl,
      predicate: DC.description,
      object: N3Util.createLiteral(description)
    })

    return writer.end().then((res) => {
      return WebAgent.post(dstContainer, {'Slug': slug, 'Accept': 'application/n-triples', 'Content-type': 'application/n-triples'}, res)
    })
  }


  // Make a link between to nodes denoted by src and dst urls
  //
  // // TODO: do we need the distinction between src and dst? The links are bidirectional anyway.
  // @param {string} srcUrl source node
  // @param {string} dstUrl destination node
  //
  // @return {Promis promise containing the result (TODO: what result?)
  //
  static connectNode(srcUrl, dstUrl) {
    // fetch src node
    return GraphAgent.fetchTriples(srcUrl).then((res) => {
      let writer = new Writer({format: 'N-Triples', prefixes: res.prefixes})
      for (var t of res.triples) {
        writer.addTriple(t)
      }

      // add connection triple to source node
      writer.addTriple({
        subject: srcUrl,
        predicate: SIOC.hasContainer,
        object: dstUrl
      })
      return writer.end()

    }).then((updatedDoc) => {
      // now PUT the updated doc
      return WebAgent.put(srcUrl, {'Content-Type': 'application/n-triples'}, updatedDoc)

    }).then(() => {
      // fetch dst node
      return GraphAgent.fetchTriples(dstUrl)

    }).then((res) => {
      let writer = new Writer({format: 'N-Triples', prefixes: res.prefixes})
      for (var t of res.triples) {
        writer.addTriple(t)
      }
      // add connection triple to destination node
      writer.addTriple({
        subject: dstUrl,
        predicate: SIOC.containerOf,
        object: srcUrl
      })
      return writer.end()

    }).then((updatedDoc) => {
      // now PUT the updated doc
      return WebAgent.put(dstUrl, {'Content-Type': 'application/n-triples'}, updatedDoc)
    })
  }


  // Combination of createNode and connectNode
  //
  // @param {string} title title of the new node.
  // @param {string} description description of the new node.
  // @param {string} dstUrl which node should the newly created node be connected to?
  // @param {string} dstContainer url indicating container to which the new node should be posted.
  //
  // @return {Promise} promise with the result (TODO: what result)?
  static createAndConnectNode(title, description, dstUrl, dstContainer=DEST_CONTAINER) {
    // TODO: should we have non-random slugs?

    let slug = Util.randomString(5)
    let newNodeUrl = `${dstContainer}${slug}#${title.split(' ')[0].toLowerCase()}`
    return GraphAgent.createNode(title, description, newNodeUrl, slug)
      .then(() => {
        return GraphAgent.connectNode(newNodeUrl, dstUrl)
      })
  }


  // Fetch triples which represent RDF document
  //
  // @param {string} uri document uri
  //
  // @return {Promise} promise containg object with triples and prefixes
  static fetchTriples(uri) {
    return WebAgent.get(uri)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
  }



  // Fetch user profile document and convert it to format which can be
  // rendered in d3 graph.
  //
  // @return {Promise} promise containing d3 data
  static fetchWebIdAndConvert() {
    return WebAgent.head(document.location.origin)
      .then((xhr) => {
        let webid = xhr.getResponseHeader('User')
        return GraphAgent.fetchAndConvert(webid)
      })
  }

  // given a pointed graph- we need to figure out the pointers for relevant adjacent graphs
  static _adjacentGraphs(pointer, triples) {
    let possibleLinks = [SIOC.containerOf, SIOC.hasContainer]
    let currentDoc = Util.urlWithoutHash(pointer)
    return triples.filter((t) => t.subject == pointer && possibleLinks.indexOf(t.predicate) >= 0 && N3Util.isIRI(t.object) && Util.urlWithoutHash(t.object) != currentDoc).map((t) => t.object)
  }


  // Fetch rdf document and convert it to format which can be
  // rendered in d3 graph.
  //
  // @param {string} url document url
  //
  // @return {Promise} promise containing d3 data
  static fetchAndConvert(uri) {
    let centerTriples = null

    // get triples from graph at uri
    return GraphAgent.fetchTriples(uri).then((res) => {
      centerTriples = res.triples

      // fetch adjacent graphs
      let adjacent = GraphAgent._adjacentGraphs(uri, centerTriples)
      return Promise.all(adjacent.map((uri) => GraphAgent.fetchTriples(uri)))
    }).then((results) => {

      // concat triples and convert them to format which can be rendered in d3 graph
      let triples = results.reduce((acc, current) => acc.concat(current.triples), centerTriples)
      let d3graph = D3Converter.convertTriples(uri, triples)
      return d3graph
    })
  }
}

export default GraphAgent
