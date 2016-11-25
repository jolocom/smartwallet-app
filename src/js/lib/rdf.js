// THIS FILE TAKES CARE OF CONVERTING TEXT TO RDF AND
// WRITING RDF TRIPLES TO TURTLE
// The parser takes text and converts it to turtle,
// returning an array of triples.
// The parser also requires a base uri parameter to resolve
// relative URIs correctly.
// The writer takes triples and writes them to a turtle file.
// Serializes it basically.

import $rdf from 'rdflib'

export class Graph {
  constructor() {
    this.g = $rdf.graph()
  }

  parse(text, url) {
    let payload = []

    $rdf.parse(text, this.g, url, 'text/turtle')

    for (let i in this.g.statements) {
      let statement = this.g.statements[i]
      payload.push({
        object: statement.object,
        predicate: statement.predicate,
        subject: statement.subject
      })
    }

    return ({prefixes: {}, triples: payload})
  }

  find(sub, pred, obj) {
    return this.g.statementsMatching(sub, pred, obj)
  }

  all() {
    return this.find(undefined, undefined, undefined)
  }

  add(...args) {
    this.addTriple(...args)
  }

  addAll(triples) {
    this.g.addAll(triples)
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

  serialize() {
    return $rdf.serialize(undefined, this.g, undefined, 'text/turtle')
  }
}

export class Parser extends Graph {}

export class Writer extends Graph {
  end() {
    return this.serialize()
  }
}
