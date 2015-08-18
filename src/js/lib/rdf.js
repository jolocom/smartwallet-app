import N3 from 'n3'

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
    return new Promise((resolve, reject) => {
      let triples = []
      this.parser.parse(text, (err, triple, prefixes) => {
        if (triple) {
          triples.push(triple)
        } else {
          resolve({prefixes: prefixes, triples: triples})
        }
      })
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
