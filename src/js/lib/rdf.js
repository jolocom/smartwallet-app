// THIS FILE TAKES CARE OF CONVERTING TEXT TO RDF AND WRITING RDF TRIPLES TO TURTLE
// The parser takes text and converts it to turtle, returning an array of triples.
// The writer takes triples and writes them to a turtle file. Serializes it basically.

import rdf from 'rdflib'

export class Parser {
  parse(text) {
    return new Promise((resolve) =>{
      let payload = []
      rdf.parse(text, rdf.graph(), 'http://ogog.og', 'text/turtle', (err, triples) => {
        for (let i in triples.statements) {
          let statement = triples.statements[i]
          payload.push({
            object: statement.object,
            predicate: statement.predicate,
            subject: statement.subject
          })
        }
      })
      resolve({ prefixes: {}, triples: payload})
    })
  }
}

export class Writer {
  constructor(){
    this.g = rdf.graph()
  }

  addTriple(subj, pred, obj) {
    console.log(subj, pred, obj, 'this probably throws an erro')
    this.g.add(subj,pred,obj)
  }

  end() {
    console.log(rdf.serialize(undefined, this.g, undefined, 'text/turtle'))
    return rdf.serialize(undefined, this.g, undefined, 'text/turtle')
  }
}
