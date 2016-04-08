import N3 from 'n3'
import HTTPAgent from './http.js'
import WebIDAgent from './webid.js'
import {DC, FOAF, SIOC} from '../namespaces.js'
import {Parser, Writer} from '../rdf.js'
import Util from '../util.js'

let N3Util = N3.Util

class GraphAgent extends HTTPAgent {
// START OF NOT IMPLEMENTED ZONE
  createNode(title, description, newNodeUrl, slug, dstContainer) {
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
      return this.post(dstContainer, {'Slug': slug, 'Accept': 'application/n-triples', 'Content-type': 'application/n-triples'}, res)
    })
  }
  connectNode(srcUrl, dstUrl) {
    return this.fetchTriples(srcUrl).then((res) => {
      let writer = new Writer({format: 'N-Triples', prefixes: res.prefixes})
      for (var t of res.triples) {
        writer.addTriple(t)
      }

      writer.addTriple({
        subject: srcUrl,
        predicate: SIOC.hasContainer,
        object: dstUrl
      })
      return writer.end()

    }).then((updatedDoc) => {
      return this.put(srcUrl, {'Content-Type': 'application/n-triples'}, updatedDoc)

    }).then(() => {
      return this.fetchTriples(dstUrl)

    }).then((res) => {
      let writer = new Writer({format: 'N-Triples', prefixes: res.prefixes})
      for (var t of res.triples) {
        writer.addTriple(t)
      }
      writer.addTriple({
        subject: dstUrl,
        predicate: SIOC.containerOf,
        object: srcUrl
      })
      return writer.end()

    }).then((updatedDoc) => {
      return this.put(dstUrl, {'Content-Type': 'application/n-triples'}, updatedDoc)
    })
  }
  createAndConnectNode(title, description, dstUrl, identity) {
    console.log('createAndConnectNode')
    console.log(title)
    console.log(description)
    console.log(dstUrl)
    console.log(identity)
    let nodeContainer = this._nodeContainerForIdentity(identity)
    let slug = Util.randomString(5)
    let newNodeUrl = `${nodeContainer}${slug}#${title.split(' ')[0].toLowerCase()}`
    return this.createNode(title, description, newNodeUrl, slug, nodeContainer)
      .then(() => {
        return this.connectNode(newNodeUrl, dstUrl)
      })
  }
  _nodeContainerForIdentity(identity) {
    let identityRoot = identity.match(/^(.*)\/profile\/card#me$/)[1]
    let cont =  `${identityRoot}/little-sister/graph-nodes/`
    return cont
  }
  // END OF NOT IMPLEMENTED ZONE

  fetchTriples(uri) {
    return this.get(uri)
      .then((xhr) => {
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
  }

  _getNeighbours(center, triples) {
    let possibleLinks = [FOAF.knows]
    let neighbours = triples.filter((t) => t.subject == center && possibleLinks.indexOf(t.predicate) >= 0)

    return new Promise ((resolve) => {
      let graphMap = []
      neighbours.map((URI, index) => {
        let tempNode = {}
        this.fetchTriples(URI.object)
        .then((triples) =>
        {
          tempNode['uri'] = URI.object
          tempNode['triples'] = triples
          graphMap.push(tempNode)
          if (index == neighbours.length - 1) {
            console.log('sending this on',graphMap)
            resolve(graphMap)
          }
        })
      })
    })
  }
// The duplication of code here has to go, I need to figure that out after I
// improve my promise wizardy skills
  _getUriGraphScheme(uri) {
    return new Promise((resolve) =>
    {
      this.fetchTriples(uri).then((res) =>
      {
        this._getNeighbours(uri, res.triples).then((result) =>
        {
          let schema = {}
          schema['center'] = {uri: uri,
                              triples: res.triples
                            }
          schema['adjacent'] = result
          console.log(schema,'this is me now')
          resolve(schema)
        })
      })
    })
  }

  _getWebIdGraphScheme() {
    let wia = new WebIDAgent()
    return new Promise((resolve) =>
    {
      wia.getWebID().then((uri) =>
      {
        this.fetchTriples(uri).then((res) =>
        {
          this._getNeighbours(uri, res.triples).then((result) =>
          {
            let schema = {}
            schema['center'] = {uri: uri,
                                triples: res.triples
                              }
            schema['adjacent'] = result
            console.log(schema,'this is me now')
            resolve(schema)
          })
        })
      })
    })
  }
}
export default GraphAgent
