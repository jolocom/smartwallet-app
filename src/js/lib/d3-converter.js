import N3 from 'n3'
import {DC, FOAF, RDF, SIOC, SSN} from '../lib/namespaces.js'
let N3Util = N3.Util

class D3Converter {
  static _getType(entity) {
    if (N3Util.isBlank(entity)) {
      return 'bnode'
    } else if (N3Util.isIRI(entity)) {
      return 'uri'
    } else {
      return 'literal'
    }
  }


  static _getValue(entity) {
    if (N3Util.isLiteral(entity)) {
      return N3Util.getLiteralValue(entity)
    } else {
      return entity
    }
  }

  static _getTitle(subject, triples) {
    // get type of subject
    // determine the type of title (foaf:name for people, dc:title for others, etc.)
    // find the title

    let type = null
    for (var t of triples) {
      if (t.subject == subject && t.predicate == RDF.type) {
        type = t.object
        break
      }
    }

    let title = subject
    if (type == FOAF.Person) {
      for (t of triples) {
        if (t.subject == subject && t.predicate == FOAF.name) {
          title = D3Converter._getValue(t.object)
        }
      }
    } else if (type === SSN.Sensor)  {
      for (t of triples) {
        if (t.subject == subject && t.predicate == SSN.hasValue) {
          title = D3Converter._getValue(t.object)
        }
      }
    } else {
      for (t of triples) {
        if (t.subject == subject && t.predicate == DC.title) {
          title = D3Converter._getValue(t.object)
        }
      }
    }

    return title
  }

  static _getDescription(subject, triples) {
    let desc = ''
    for (var t of triples) {
      if (t.subject == subject && t.predicate == DC.description) {
        desc = D3Converter._getValue(t.object)
      }
    }

    return desc
  }
p
  static _getNodeType(subject, triples) {
    let type = null
    for (var t of triples) {
      if (t.subject == subject && t.predicate == RDF.type) {
        type = t.object
        break
      }
    }

    let nodeType = 'node'
    if (type === FOAF.Person) {
      nodeType = 'contact'
    } else if (type === SSN.Sensor) {
      nodeType = 'sensor'
    }

    return nodeType
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

    // These are the only links which we will follow in the graph
    let validLinks = [SIOC.containerOf, SIOC.hasContainer, FOAF.knows]

    //triples which subject equal to center of the graph
    let allOutwards = targetTriples.filter((t) => t.subject == center && validLinks.indexOf(t.predicate) >= 0)
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

    // take care of the center
    let centerData = {
      subject: center,
      subjectType: 'uri',
      uri: center,
      title: D3Converter._getTitle(center, triples),
      description: D3Converter._getDescription(center, triples),
      nodeType: D3Converter._getNodeType(center, triples)
    }
    if(!(centerData.subject in connections)) {
      connections[centerData.subject] = cnt
      nodes.push({
        name: centerData.subject,
        type: centerData.subjectType,
        uri: centerData.uri,
        title: centerData.title,
        description: centerData.description,
        nodeType: centerData.nodeType
      })
      cnt += 1
    }

    // index nodes for connections
    for (var out of allOutwards) {
      if (!(out.subject in connections)) {
        connections[out.subject] = cnt
        nodes.push({
          name: out.subject,
          type: out.subjectType,
          uri: out.subject,
          title: D3Converter._getTitle(out.subject, triples),
          description: D3Converter._getDescription(out.subject, triples),
          nodeType: D3Converter._getNodeType(out.subject, triples)
        })
        cnt += 1
      }

      if (out.objectType != 'literal') {
        connections[out.object] = cnt
        nodes.push({
          name: out.object,
          type: out.objectType,
          uri: out.object,
          title: D3Converter._getTitle(out.object, triples),
          description: D3Converter._getDescription(out.object, triples),
          nodeType: D3Converter._getNodeType(out.object, triples)
        })
        cnt += 1
      }
    }

    // make node connections
    for (out of allOutwards) {
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
      center: center,
      nodes: nodes,
      links: links,
      literals: literals
    }
  }
}

export default D3Converter
