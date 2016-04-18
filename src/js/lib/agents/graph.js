import N3 from 'n3'
import HTTPAgent from './http.js'
import WebIDAgent from './webid.js'
import {DC, FOAF, SIOC} from '../namespaces.js'
import {Parser, Writer} from '../rdf.js'
import Util from '../util.js'

let N3Util = N3.Util

class GraphAgent extends HTTPAgent {
  
//TODO maybe rewrite with solid?
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
          tempNode['triples'] = triples.triples
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
          console.log('I was called')
          let schema = {}
          schema['center'] = {uri: uri,
                              triples: res.triples
                            }
          schema['adjacent'] = result
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
