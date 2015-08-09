import _ from 'lodash'
import url from 'url'
import N3 from 'n3'
import {CERT, FOAF, RDF} from '../lib/namespaces.js'

let N3Util = N3.Util

class D3Converter {
  static _getType(entity) {
    if (N3Util.isBlank(entity)) {
      return 'bnode'
    } else if (N3Util.isIRI(entity)) {
      return "uri"
    } else {
      return "literal"
    }
  }


  static _getValue(entity) {
    if (N3Util.isLiteral(entity)) {
      return N3Util.getLiteralValue(entity)
    } else {
      return entity
    }
  }

  //TODO: this is bullshit- should simplify
  static convertTriples(center, triples) {
    console.log('Converting triples to D3 graph data')
    let targetTriples = triples.map((t) => {
      // mailto links are not crawlable, so we convert them to literals for crawlable graph purposes
      if (t.predicate == FOAF.mbox) {
        t.object = N3Util.createLiteral(t.object)
        return t
      }
      return t
    })

    //extract and convert literals to appropriate format
    //TODO: would probably be more efficient with lodash
    //TODO: we used to deal with absolute-only URIs. Does it affect anything?
    let literals = targetTriples.filter((t) => N3Util.isLiteral(t.object))
      .reduce((acc, t) => {
        let converted = {
          p: t.predicate,
          o: N3Util.getLiteralValue(t.object),
          l: N3Util.getLiteralLanguage(t.object),
          d: N3Util.getLiteralType(t.object)
        }
        if(!(t.subject in acc)) {
          acc[t.subject] = []
        }
        acc[t.subject].push(converted)
        return acc
      }, {})

    console.log('literals')
    console.log(literals)

    //triples which subject equal to center of the graph
    let centerFragment = url.parse(center).hash
    let allOutwards = targetTriples.filter((t) => t.subject == centerFragment && t.predicate != RDF.type)
      .map((t) => {
        return {
          subject: D3Converter._getValue(t.subject),
          subjectType: D3Converter._getType(t.subject),
          predicate: D3Converter._getValue(t.predicate),
          object: D3Converter._getValue(t.object),
          objectType: D3Converter._getType(t.object)
        }
      })
    console.log('all outwards')
    console.log(allOutwards)

    let nodes = []
    let links = []
    let preds = {}
    let connections = {}

    let cnt = 0

    // TODO: title and description

    // index nodes for connections
    for (var out of allOutwards) {
      if (!(out.subject in connections)) {
        connections[out.subject] = cnt
        nodes.push({
          name: out.subject,
          type: out.subjectType,
          uri: out.subject,
          title: out.subject,
          description: out.subject
        })
        cnt += 1
      }

      if (out.objectType != 'literal') {
        connections[out.object] = cnt
        nodes.push({
          name: out.object,
          type: out.objectType,
          uri: out.object,
          title: out.object,
          description: out.object
        })
        cnt += 1
      }
    }

    // make node connections
    for (var out of allOutwards) {
      if (out.objectType != 'literal') {
        let key = `${out.subject} ${out.object}`
        let pr = (key in preds) ? preds[key] : ''
        preds[key] = `${pr} ${out.predicate}`
        links.push({
          source: (out.subject in connections) ? connections[out.subject] : -1,
          target: (out.object in connections) ? connections[out.object] : -1,
          name: preds[key],
          value: 10
        })
      }
    }

    return {
      nodes: nodes,
      links: links,
      literals: literals
    }
  }
}

export default D3Converter
