// THIS FILE TAKES CARE OF CONVERTING TEXT TO RDF AND
// WRITING RDF TRIPLES TO TURTLE
// The parser takes text and converts it to turtle,
// returning an array of triples.
// The parser also requires a base uri parameter to resolve
// relative URIs correctly.
// The writer takes triples and writes them to a turtle file.
// Serializes it basically.

export class Graph {
  constructor() {
  }

  get(...args) {
    return this.find(...args)[0]
  }

  any(...args) {
    return this.g.any(...args)
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
    for (var x in triples) {
      this.add(triples[x])
    }
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

  serialize(uri) {
  }
}

export class Parser extends Graph {
  constructor(text, url) {
    super()

    if (text) {
      this.parse(text, url)
    }
  }
  // @TODO We never use prefixes, return only statements.
  parse(text, url) {
  }
}

export class Writer extends Graph {
  end(uri) {
    return this.serialize(uri)
  }
}
