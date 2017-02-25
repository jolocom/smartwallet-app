import HTTPAgent from './http.js'
import {LDP} from '../namespaces.js'
import {Writer, Parser} from '../rdf.js'
import $rdf from 'rdflib'

// Linked-Data Platform related functions
class LDPAgent extends HTTPAgent { // TODO: Remove when done refactoring
  constructor() {
    super()
    this.proxiedHTTP = new HTTPAgent({proxy: true})
    this.normalHTTP = new HTTPAgent()
  }

  // create a directory on LDP server
  createBasicContainer(containerUrl) {
    let headers = {
      'Content-Type': 'text/turtle',
      'Link': `<${LDP.BasicContainer}>; rel="type"`
    }

    return this.normalHTTP.put(containerUrl, '', headers)
  }

  /**
   * @summary Find the triple in the RDF file at the uri.
   * @param {string} uri - uri of the $rdf file.
   * @param {object} subject - triple subject, undefined for wildcard.
   * @param {object} predicate - triple predicate, undefined for wildcard.
   * @param {object} object - triple object, undefined for wildcard.
   * @return {array | objects} - All triples matching the description.
   */

  findTriples(uri, subject, predicate, object) {
    let writer = new Writer()
    return this.fetchTriplesAtUri(uri).then((res) => {
      for (let t of res.triples) {
        writer.addTriple(t.subject, t.predicate, t.object)
      }
      return writer.find(subject, predicate, object)
    })
  }

  /* @summary Finds the objects related to the supplied characteristic.
   * @param {string} uri - The uri of the file to check
   * @param {string} value - The field name we are interested in
   * @return {array | objects} - All objects (in the $rdf sense) associated
   * with the value
   */

  findObjectsByTerm(uri, pred) {
    return new Promise((resolve, reject) => {
      if (!uri) {
        reject('No uri')
      } else {
        let user = $rdf.sym(uri) //  + '#me'
        let result = []
        this.findTriples(uri, user, pred, undefined).then((res) => {
          for (let triple of res) {
            result.push(triple.object)
          }
          resolve(result)
        })
      }
    })
  }

  // This takes a standard URI, it proxies the request itself.
  fetchTriplesAtUri(uri) {
    let parser = new Parser()
    return this.proxiedHTTP.get(uri).then((ans) => {
      if (!ans.ok) {
        throw new Error(ans.status)
      }

      return ans.text().then((res) => {
        return parser.parse(res, uri)
      })
    }).catch(() => {
      return {
        uri: uri,
        unav: true,
        connection: null,
        triples: []
      }
    })
  }

  /*
   * @summary Given a uri to a file, tries to get the uri of the file's ACL
   * @param {string} uri - the uri of the file
   * @return {string} aclUri - returns the correct acl uri if it can, otherwise
   *                           it defaults to uri + .acl
   */

  getAclUri(uri) {
    return this.proxiedHTTP.head(uri).then((result) => {
      let linkHeader = result.headers.get('Link')
      if (linkHeader) {
        let aclHeader = linkHeader.split(',').find((part) => {
          return part.indexOf('rel="acl"') > 0
        })
        if (aclHeader) {
          aclHeader = aclHeader.split(';')[0].replace(/<|>/g, '')
          // The Uri of the acl deduced succesfully
          return uri.substring(0, uri.lastIndexOf('/') + 1) + aclHeader
        }
      }

      return uri + '.acl'
    })
  }
}

export default LDPAgent
