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
  convertToD3(rank, node, i, n) {
    if(node.unav){
      return {
        uri : node.uri,
        rank: 'unavailable',
        x: STYLES.width / 2 + 40,
        y: STYLES.height / 2 + 40
      }
    }
    // We need to know the index of the node and the total amount of nodes
    // in order to be able to calculate their initial position, so that they are
    // possitioned in a circle
    this.i = i + 1
    this.n = n

    let uri = node.uri
    let connection = node.connection ? node.connection : null

    let props = {
      uri: uri,
      name:null,
      connection: connection,
      title:null,
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
    if (i && n) {
      let angle = (2 * Math.PI) / this.n
      let halfwidth = STYLES.width / 2
      let halfheight = STYLES.height / 2

      props.x = Math.sin(angle * this.i) * STYLES.largeNodeSize * 0.5 + halfwidth
      props.y = Math.cos(angle * this.i) * STYLES.largeNodeSize * 0.5 + halfheight
    } else if (!i && !n && rank =='a') {
      // This takes care of nodes that are added dynamically, the mid + 30 is
      // the optimal position for spawning new nodes dynamically
      props.x = STYLES.width / 2 + 60
      props.y = STYLES.height / 2 + 60
    }
    // Updating the attributes of the node object. The resulting object will have
    // all of it's props filled in, and will be ready to be rendered by D3
    // Note, if a triple is not present, it will be set to null.

    // If the resource is a URI, it's value is stored next to the 'uri' key in the object
    // otherwise it's value is stored in the 'value' key of the object. We need to make
    // sure we are assigning the value regardless of where it's stored
    let name = g.statementsMatching(undefined, FOAF('givenName'), undefined)
    if (name.length > 0) props.name = name[0].object.value ? name[0].object.value : name[0].object.uri
    else props.name = null

    let familyName = g.statementsMatching(undefined, FOAF('familyName'), undefined)
    if (familyName.length > 0) props.familyName = familyName[0].object.value ? familyName[0].object.value : familyName[0].object.uri
    else props.familyName = null

    let fullName = g.statementsMatching(undefined, FOAF('name'), undefined)
    if (fullName.length > 0) props.fullName = fullName[0].object.value ? fullName[0].object.value : fullName[0].object.uri
    else props.fullName = null

    let title = g.statementsMatching(undefined, DC('title'), undefined)
    if (title.length > 0) props.title = title[0].object.value ? title[0].object.value : title[0].object.uri
    else props.img = null

    let description = g.statementsMatching(undefined, DC('description'), undefined)
    if (description.length > 0) props.description = description[0].object.value ? description[0].object.value : description[0].object.uri
    else props.description = null

    let type = g.statementsMatching(undefined, RDF('type'), undefined)
    if (type.length > 0) props.type = type[0].object.value ? type[0].object.value : type[0].object.uri
    else props.type = null

    let image = g.statementsMatching(undefined, FOAF('img'), undefined)
    if (image.length > 0) props.img = image[0].object.value ? image[0].object.value : image[0].object.uri
    else props.img = null

    // We specify the rank of the node here. Center is the center node and Adjacent is a neighbour, smaller node
    // This data is not absolute, it obviously depends on the viewport. Used for visualization purposes.
    if (rank == 'a') props.rank = 'adjacent'
    if (rank == 'c') props.rank = 'center'

    if(!props.name && !props.familyName)
      if(props.fullName){
        props.name = props.fullName.substring(0, props.fullName.indexOf(' '))
        props.familyName = props.fullName.substring(props.name.length,props.fullName.length -1)
      }
    return props
  }
}

export default D3Converter
