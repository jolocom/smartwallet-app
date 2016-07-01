// THIS FILE TAKES CARE OF CONVERTING TEXT TO RDF AND WRITING RDF TRIPLES TO TURTLE
// The parser takes text and converts it to turtle, returning an array of triples.
// The parser also requires a base uri parameter to resolve relative URIs correctly.
// The writer takes triples and writes them to a turtle file. Serializes it basically.
import rdf from 'rdflib'

export class Parser {
  parse(text, url) {
    return new Promise((resolve) =>{
      let payload = []
      // Keep an eye on this TODO
      // if (url) url = url.substring(0, url.indexOf('box.me/')+7)
      rdf.parse(text, rdf.graph(), url, 'text/turtle', (err, triples) => {
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

  addTriple(...args) {
    // Allow to pass a single object
    let {subject, predicate, object} = args.length === 1 ? args[0] : args

    // We don't want to write a triple that already exists into the rdf file.
    if (this.g.statementsMatching(subject, predicate, object).length > 0){
      console.warn('Triple already present in the rdf file, Ignoring')
      return false
    } else if (subject === object) {
      console.warn('You cannot link to yourself')
      return false
    }
    else {
      this.g.add(subject, predicate, object)
      return true
    }
  }

  end() {
    return rdf.serialize(undefined, this.g, undefined, 'text/turtle')
  }
}
