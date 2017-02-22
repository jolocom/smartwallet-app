/* global describe: true, it: true */
var expect = require('chai').expect
import {Writer} from 'lib/rdf'
import {PRED} from 'lib/namespaces'
import GraphAgent from './graph'
import rdf from 'rdflib'

describe('GraphAgent', function() {
  describe('#baseNode', function() {
    const gAgent = new GraphAgent()
    const uri = 'https://testuri.com/'
    const title = 'Test Name'
    const description = 'Description. With some characters.'

    const expected = [{
      subject: rdf.sym(uri),
      predicate: PRED.title,
      object: rdf.literal(title),
      why: rdf.sym('chrome:theSession')
    }, {
      subject: rdf.sym(uri),
      predicate: PRED.description,
      object: rdf.literal(description),
      why: rdf.sym('chrome:theSession')
    }]

    const nodeTypeMap = {
      default: PRED.Document,
      passport: PRED.Document,
      confidential: PRED.Document,
      image: PRED.Image
    }

    const checkType = (nodeType, triples) => {
      triples.push({
        subject: rdf.sym(uri),
        predicate: PRED.type,
        object: nodeTypeMap[nodeType],
        why: rdf.sym('chrome:theSession')
      })

      expect(gAgent.baseNode(
        uri,
        new Writer(),
        title,
        description,
        nodeType
      ).g.statements).to.deep.equal(expected)
      triples.pop()
    }

    it('Should populate default node boilerplate', function() {
      checkType('default', expected)
    })

    it('Should populate image node boilerplate', function() {
      checkType('image', expected)
    })

    it('Should populate passport node boilerplate', function() {
      checkType('passport', expected)
    })

    it('Should populate confidential node boilerplate', function() {
      checkType('confidential', expected)
    })
  })
})
