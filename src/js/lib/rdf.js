/*
 The parser takes text and converts it to turtle,
 returning an array of triples.
 The parser also requires a base uri parameter to resolve
 relative URIs correctly.
 The writer takes triples and writes them to a turtle file.
 Serializes it basically.
*/

import rdf from 'rdflib'

export class Parser {
  parse(text, url) {
    let payload = []
    rdf.parse(text, rdf.graph(), url, 'text/turtle', (err, triples) => {
      if (err) {
        return {
          triples: []
        }
      }
      for (let i in triples.statements) {
        let statement = triples.statements[i]
        payload.push({
          object: statement.object,
          predicate: statement.predicate,
          subject: statement.subject
        })
      }
    })
    return ({
      prefixes: {},
      triples: payload
    })
  }
}

export class Writer {

  constructor() {
    this.g = rdf.graph()
  }

  find(sub, pred, obj) {
    return this.g.statementsMatching(sub, pred, obj)
  }

  addTriple(...args) {
    let subject, predicate, object
    // Allow to pass a single object
    if (args.length === 1) {
      ({subject, predicate, object} = args[0])
    } else {
      ([subject, predicate, object] = args)
    }
    this.g.add(subject, predicate, object)
  }

  end() {
    return rdf.serialize(undefined, this.g, undefined, 'text/turtle')
  }
}
