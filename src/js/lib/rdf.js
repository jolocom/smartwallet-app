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

  addTriple(triple) {
    rdf.serialize(undefined, triple, undefined,'text/turtle',(string) => this.g.add(string))}

  end() {
    return new Promise((resolve,reject) => 
       resolve(this.g))
    }
}

