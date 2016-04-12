import rdf from 'rdflib'
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let DC = rdf.Namespace('http://purl.org/dc/terms/')
let RDF = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
import STYLES from 'styles/app.js'

class D3Converter {
  convertToD3(node, i, n) {
    this.i = i + 1
    this.n = n
    let uri = node.uri

    let converted = {
      uri: uri,
      name:null,
      description:null,
      img:null,
      type:null,
      x: null,
      y: null
    }

    let g = rdf.graph()
    for (let i = 0; i < node.triples.length; i++) {
      let temp = node.triples[i]
      g.add(temp.subject, temp.predicate, temp.object)
    }

    let angle = (2 * Math.PI) / this.n

    let halfwidth = STYLES.width / 2
    let halfheight = STYLES.height / 2

    converted.x = Math.sin(angle * this.i) * halfwidth + halfwidth
    converted.y =(Math.cos(angle * this.i) * halfwidth + halfheight)

    converted.name = g.statementsMatching(uri, FOAF('name').uri, undefined)[0].object.value
    converted.description = g.statementsMatching(uri, DC('description').uri, undefined)[0].object.value
    converted.type = g.statementsMatching(uri, RDF('type').uri, undefined)[0].object.value
    return converted
  }

}


export default D3Converter
