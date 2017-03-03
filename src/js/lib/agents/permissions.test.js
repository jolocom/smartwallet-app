/* global describe: true, it: true */
var expect = require('chai').expect
import rdf from 'rdflib'
import PermAgent from './permissions'
import {PRED} from 'lib/namespaces'

describe('PermissionsAgent', function() {
  const URI = 'https://mockuri.com'
  const FILE_ONE = 'https://mockfileone.com'
  const FILE_TWO = 'https://mockfiletwo.com'
  const FILE_THREE = 'https://mockfilethree.com'
  const FILE_FOUR = 'https://mockfilefour.com'

  describe('#resolveNodeType', function() {
    it('Should correctly return when fetch fails', async function() {
      const pAgent = new PermAgent()
      const mockUri = 'https://mockuri.com/index'

      pAgent._getIndexUri = (uri) => 'https://mockuri.com/index'

      pAgent.findTriples = async(uri, subj, pred, obj) => {
        expect(uri).to.equal('https://mockuri.com/index')
        expect(subj).to.deep.equal(rdf.sym(uri))
        expect(pred).to.deep.equal(PRED.type)
        expect(obj).to.be.undefined

        return -1
      }

      expect(await pAgent.resolveNodeType(mockUri))
        .to.equal('typeNotDetected')
    })

    it('Should resolve the correct nodeTypes', async function() {
      const expectedMap = {
        [FILE_ONE]: {type: 'typeDocument', obj: PRED.Document},
        [FILE_TWO]: {type: 'typeImage', obj: PRED.Image},
        [FILE_THREE]: {type: 'typePerson', obj: PRED.Person},
        [FILE_FOUR]: {type: 'typePerson', obj: PRED.Person}
      }
      const responseMap = {}

      const temp = [FILE_ONE, FILE_TWO, FILE_THREE, FILE_FOUR]
      temp.forEach(uri => {
        responseMap[uri] = [{
          subject: rdf.sym(uri),
          predicate: PRED.type,
          object: expectedMap[uri].obj,
          uri
        }]
      })

      const pAgent = new PermAgent()
      pAgent.findTriples = async(uri, subj, pred, obj) => {
        expect(uri).to.equal(responseMap[uri][0].uri)
        expect(subj).to.deep.equal(rdf.sym(uri))
        expect(pred).to.deep.equal(PRED.type)
        expect(obj).to.be.undefined

        return responseMap[uri]
      }

      expect(await pAgent.resolveNodeType(FILE_ONE))
        .to.deep.equal(expectedMap[FILE_ONE].type)
      expect(await pAgent.resolveNodeType(FILE_TWO))
        .to.deep.equal(expectedMap[FILE_TWO].type)
      expect(await pAgent.resolveNodeType(FILE_THREE))
        .to.deep.equal(expectedMap[FILE_THREE].type)
      expect(await pAgent.resolveNodeType(FILE_FOUR))
        .to.deep.equal(expectedMap[FILE_FOUR].type)
    })
  })

  describe('#getSharedNodes', function() {
    it('Should correctly throw if no uri provided', async function() {
      expect(() => (new PermAgent())
        .getSharedNodes()).to.throw('No Uri supplied.')
    })

    it('Should correctly handle index GET fail', async function() {
      const pAgent = new PermAgent()
      pAgent._getIndexUri = (uri) => 'https://mockuri.com/index'
      pAgent.findTriples = async() => -1

      expect(await pAgent.getSharedNodes('mockuri.com')).to.deep.equal({})
    })

    it('Should correctly return shared nodes', async function() {
      const pAgent = new PermAgent()
      const expectedMap = {
        [FILE_ONE]: {uri: FILE_ONE, type: 'typeDocument'},
        [FILE_TWO]: {uri: FILE_TWO, type: 'typeImage'},
        [FILE_THREE]: {uri: FILE_THREE, type: 'typePerson'},
        [FILE_FOUR]: {uri: FILE_FOUR, type: 'typeNotDetected'}
      }
      pAgent._getIndexUri = (uri) => 'https://mockuri.com/index'

      pAgent.findTriples = async(indexUri, subj, pred, obj) => {
        expect(indexUri).to.equal('https://mockuri.com/index')
        expect(pred).to.be.undefined
        expect(obj).to.be.undefined

        return Object.keys(expectedMap).map(key => {
          return {
            subject: rdf.sym(URI),
            predicate: PRED.readPermission,
            object: rdf.sym(expectedMap[key].uri)
          }
        })
      }

      pAgent.resolveNodeType = async(nodeUri) => {
        expect(nodeUri).to.equal(expectedMap[nodeUri].uri)
        return expectedMap[nodeUri].type
      }

      const result = await pAgent.getSharedNodes(URI)
      expect(result).to.deep.equal({
        typeDocument: [{ perm: PRED.readPermission.uri, uri: FILE_ONE }],
        typeImage: [{ perm: PRED.readPermission.uri, uri: FILE_TWO }],
        typePerson: [{ perm: PRED.readPermission.uri, uri: FILE_THREE }],
        typeNotDetected: [{ perm: PRED.readPermission.uri, uri: FILE_FOUR }]
      })
    })
  })
})
