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

    if (node.unav) {
      props.unavailable = true
      return props
    }

    node.forEach(triple => {
      let pred = triple.predicate.uri
      let obj = triple.object.value ? triple.object.value : triple.object.uri

      // Updating the attributes of the node object.
      // The resulting object will have all of it's props filled in, and will
      // be ready to be rendered by D3
      // Note, if a triple is not present, it will be set to null.
      // If the resource is a URI, it's value is stored next to the
      // 'uri' key in the object otherwise it's value is stored in the 'value'
      // key of the object. We need to make sure we are assigning the value
      // regardless of where it's stored
      const predMap = {}
      predMap[PRED.givenName.uri] = 'name'
      predMap[PRED.familyName.uri] = 'familyName'
      predMap[PRED.fullName.uri] = 'fullName'
      predMap[PRED.email.uri] = 'email'
      predMap[PRED.title.uri] = 'title'
      predMap[PRED.title_DC.uri] = 'title'
      predMap[PRED.description.uri] = 'description'
      predMap[PRED.type.uri] = 'type'
      predMap[PRED.image.uri] = 'img'
      predMap[PRED.socialMedia.uri] = 'socialMedia'
      predMap[PRED.mobile.uri] = 'mobilePhone'
      predMap[PRED.address.uri] = 'address'
      predMap[PRED.profession.uri] = 'profession'
      predMap[PRED.company.uri] = 'company'
      predMap[PRED.url.uri] = 'url'
      predMap[PRED.storage.uri] = 'storage'

      if (predMap[pred]) {
        if (predMap[pred] === 'email') {
          props[predMap[pred]] = obj.substring(obj.indexOf('mailto:') + 7)
        } else {
          props[predMap[pred]] = obj
        }
      }
    })

    // @TODO Have a dedicated RDF type for bitcoin and passport nodes, so that
    // we don't need this hack.
    if (props.title === 'Passport') {
      props.type = 'passport'
    }

    // We specify the rank of the node here. Center is the center node
    // and Adjacent is a neighbour, smaller node. This data is not absolute,
    // it obviously depends on the viewport. Used for visualization purposes.
    if (rank === 'a') {
      props.rank = 'neighbour'
    } else if (rank === 'c') {
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
