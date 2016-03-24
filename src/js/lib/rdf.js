import N3 from 'n3'
import rdf from '/home/fuchs/Documents/work/rdf_refractor/little-sister/node_modules/rdflib/dist/rdflib-node.js'

// N3.parser- promise version
export class Parser {
  // @see https://github.com/RubenVerborgh/N3.js#parsing
  constructor(params) {
    if (params) {
      this.parser = N3.Parser(params)
    } else {
      this.parser = N3.Parser()
    }
  }

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


// N3.writer - promise version
export class Writer {

  // @see https://github.com/RubenVerborgh/N3.js#writing
  constructor(params) {
    if (params) {
      this.writer = N3.Writer(params)
    } else {
      this.writer = N3.Writer()
    }
  }

  addTriple(triple) {
    this.writer.addTriple(triple)
  }

  end() {
    return new Promise((resolve, reject) => {
      this.writer.end((err, res) => {
        if (err)
          reject(err)
        else
          resolve(res)
      })
    })
  }
}
