// THIS FILE TAKES CARE OF CONVERTING TEXT TO RDF AND WRITING RDF TRIPLES TO TURTLE
// The parser takes text and converts it to turtle, returning an array of triples.
// The writer takes triples and writes them to a turtle file. Serializes it basically.

import rdf from 'rdflib'

export class Parser {

  parse(text) {
    return new Promise((resolve) =>{
      let uri = 'https://localhost:8443'
      let payload = []
      rdf.parse(text, rdf.graph(), uri, 'text/turtle', (err, triples) => {
        for (let i in triples.statements) {
          let one = {
            object: triples.statements[i].object.uri,
            predicate: triples.statements[i].predicate.uri,
            subject: triples.statements[i].subject.uri
          }
          if (!one.object)
            one.object = triples.statements[i].object.value
          payload.push(one)
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
    this.g.add(subj,pred,obj)
  }

  end() {
    return new Promise((resolve, reject) => {
      rdf.serialize(undefined, this.g, undefined, 'text/turtle', (err, str) => {
        if (err)
          reject(err)
        else
          resolve(str)
      })
    })
  }
}
