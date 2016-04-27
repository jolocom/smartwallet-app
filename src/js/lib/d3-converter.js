import rdf from 'rdflib'
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let DC = rdf.Namespace('http://purl.org/dc/terms/')
let RDF = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
import STYLES from 'styles/app.js'

// D3 Converter takes a node (a node in this context is an array of triples that
// describe an rdf document) and then, based on that returns an array where the
// triples are represented in a different format. This array can then be fed
// to D3 to draw a graph based on the data

class D3Converter {
  convertToD3(node, i, n) {
    // We need to know the index of the node and the total amount of nodes
    // in order to be able to calculate their initial position, so that they are
    // possitioned in a circle
    this.i = i + 1
    this.n = n

    let uri = node.uri

    let props = {
      uri: null,
      name:null,
      description:null,
      img:null,
      type:null,
      rank: null,
      x: null,
      y: null
    }

    // We create a rdf.graph() object, and populate it with the triples, this
    // allows us to then parse them using the rdflib's function
    // rdf.graph().statementsMatching()

    let g = rdf.graph()
    for (let i = 0; i < node.length; i++) {
      g.add(node[i].subject, node[i].predicate, node[i].object)
    }
    // Calculating the coordinates of the nodes so we can put them in a circle
    let angle = (2 * Math.PI) / this.n
    let halfwidth = STYLES.width / 2
    let halfheight = STYLES.height / 2

    props.x = Math.sin(angle * this.i) * halfwidth + halfwidth
    props.y =(Math.cos(angle * this.i) * halfwidth + halfheight)

    // Updating the attributes of the node object. The resulting object will have
    // all of it's props filled in, and will be ready to be rendered by D3
    // Note, if a triple is not present, it will be set to null.
    props.uri = uri

    // If the resource is a URI, it's value is stored next to the 'uri' key in the object
    // otherwise it's value is stored in the 'value' key of the object. We need to make
    // sure we are assigning the value regardless of where it's stored
    let name = g.statementsMatching(undefined, FOAF('name'), undefined)
    if (name.length > 0) props.name = name[0].object.value ? name[0].object.value : name[0].object.uri
    else props.name = null

    let description = g.statementsMatching(undefined, DC('description'), undefined)
    if (description.length > 0) props.description = description[0].object.value ? description[0].object.value : description[0].object.uri
    else props.description = null

    let type = g.statementsMatching(undefined, RDF('type'), undefined)
    if (type.length > 0) props.type = type[0].object.value ? type[0].object.value : type[0].object.uri
    else props.type = null

  //This labels the nodes as center and adjacent, a bit hacky, but it works allright
    if (i) props.rank = 'adjacent'
    if (!i) props.rank = 'center'

    return props
  }
}

export default D3Converter
