import rdf from 'rdflib'
import {PRED} from './namespaces.js'
// D3 Converter takes a node (a node in this context is an array of triples that
// describe an rdf document) and then, based on that returns an array where the
// triples are represented in a different format. This array can then be fed
// to D3 to draw a graph based on the data

class D3Converter {
  convertToD3(rank, node, i, n) {
    // We need to know the index of the node and the total amount of nodes
    // in order to be able to calculate their initial position, so that they are
    // possitioned in a circle
    this.i = i + 1
    this.n = n

    let uri = node.uri
    let connection = node.connection ? node.connection : null

    let props = {
      uri: uri,
      name: null,
      email: '',
      connection: connection,
      title: null,
      description: null,
      img: null,
      type: null,
      rank: 'neighbour',
      storage: null,
      confidential: node.confidential,
      socialMedia: '',
      mobilePhone: '',
      address: '',
      profession: '',
      company: '',
      url: ''
    }

    // We create a rdf.graph() object, and populate it with the triples, this
    // allows us to then parse them using the rdflib's function
    // rdf.graph().statementsMatching()
    let g = rdf.graph()
    console.log(node)
    node.forEach(triple => {
      g.add(triple.subject, triple.predicate, triple.object)

      let pred = triple.predicate.uri
      let obj = triple.object

      // Updating the attributes of the node object.
      // The resulting object will have all of it's props filled in, and will
      // be ready to be rendered by D3
      // Note, if a triple is not present, it will be set to null.
      // If the resource is a URI, it's value is stored next to the
      // 'uri' key in the object otherwise it's value is stored in the 'value'
      // key of the object. We need to make sure we are assigning the value
      // regardless of where it's stored
      // TODO Rewrite, this is terrible!
      if (triple.subject.uri === uri) {
        if (pred === PRED.givenName.uri) {
          props.name = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.familyName.uri) {
          props.familyName = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.fullName.uri) {
          props.fullName = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.email.uri) {
          props.email =
            obj.value
            ? obj.value.substring(obj.value.indexOf('mailto:') + 7,
              obj.value.length)
            : obj.uri.substring(obj.uri.indexOf('mailto:') + 7,
              obj.uri.length)
        }

        if (pred === PRED.title.uri || pred === PRED.title_DC.uri) {
          props.title = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.description.uri) {
          props.description = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.type.uri) {
          props.type = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.image.uri) {
          props.img = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.socialMedia.uri) {
          props.socialMedia = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.mobile.uri) {
          props.mobilePhone = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.address.uri) {
          props.address = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.profession.uri) {
          props.profession = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.company.uri) {
          props.company = obj.value ? obj.value : obj.uri
        }
        if (pred === PRED.url.uri) {
          props.url = obj.value ? obj.value : obj.uri
        }
        // Storage is used when adding files. Better to do it here then to send
        // extra requests upon upload.
        if (pred === PRED.storage.uri) {
          props.storage = obj.value ? obj.value : obj.uri
        }
      }
    })

    // @TODO Have a dedicated RDF type for bitcoin and passport nodes, so that
    // we don't need this hack.
    if (props.title === 'Passport') {
      props.type = 'passport'
    }
    if (node.unav) {
      props.unavailable = true
      return props
    }

    // We specify the rank of the node here. Center is the center node
    // and Adjacent is a neighbour, smaller node. This data is not absolute,
    // it obviously depends on the viewport. Used for visualization purposes.
    if (rank === 'a') {
      props.rank = 'neighbour'
    }

    if (rank === 'c') {
      props.rank = 'center'
    }

    if (!props.name && !props.familyName) {
      if (props.fullName) {
        let fName = props.fullName
        props.name = fName.substring(0, fName.indexOf(' '))
        props.familyName = fName.substring(props.name.length, fName.length)
      }
    }

    return props
  }
}

export default D3Converter
