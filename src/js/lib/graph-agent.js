import N3 from 'n3'
import D3Converter from './d3-converter.js'
import WebAgent from './web-agent.js'


// abstraction of WebAgent for graph purposes
class GraphAgent {

  // Fetch user profile document and convert it to format which can be
  // rendered in d3 graph.
  //
  // @return {Promise} promise containing d3 data
  static fetchWebIdAndConvert() {
    return WebAgent.head(document.location.origin)
      .then((xhr) => {
        let webid = xhr.getResponseHeader('User')
        return GraphAgent.fetchAndConvert(webid)
      })
  }


  // Fetch rdf document and convert it to format which can be
  // rendered in d3 graph.
  //
  // @param {string} url document url
  //
  // @return {Promise} promise containing d3 data
  static fetchAndConvert(uri) {
    return WebAgent.get(uri)
      .then((xhr) => {
        return new Promise((resolve, reject) => {
          let triples = []
          let parser = N3.Parser()

          parser.parse(xhr.response, (err, triple, prefixes) => {
            if (triple) {
              triples.push(triple)
            } else {
              let d3graph = D3Converter.convertTriples(uri, triples)
              resolve(d3graph)
            }
          })
        })
      })
  }

}

export default GraphAgent
