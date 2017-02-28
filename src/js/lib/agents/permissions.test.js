/* global describe: true, it: true */
var expect = require('chai').expect
import rdf from 'rdflib'
import PermAgent from './permissions'
import {PRED} from 'lib/namespaces'

describe('PermissionsAgent', function() {
  const uri = 'https://mockuri.com'
  const fileOne = 'https://mockfileone.com'
  const fileTwo = 'https://mockfiletwo.com'
  const fileThree = 'https://mockfilethree.com'
  const fileFour = 'https://mockfilefour.com'

  describe('#resolveNodeType', function() {
    it('Should correctly return when fetch fails', async function() {
      const pAgent = new PermAgent()
      const mockUri = 'https://mockuri.com'

      pAgent.findTriples = async(uri, subj, pred, obj) => {
        expect(uri).to.equal(mockUri)
        expect(subj).to.deep.equal(rdf.sym(uri))
        expect(pred).to.deep.equal(PRED.type)
        expect(obj).to.be.undefined

        return -1
      }

      expect(await pAgent.resolveNodeType(mockUri)).to.equal('typeNotDetected')
    })
    it('Should resolve the correct nodeTypes', async function() {
      const expectedMap = {
        [fileOne]: {type: 'typeDocument', obj: PRED.Document},
        [fileTwo]: {type: 'typeImage', obj: PRED.Image},
        [fileThree]: {type: 'typePerson', obj: PRED.Person},
        [fileFour]: {type: 'typePerson', obj: PRED.Person}
      }
      const responseMap = {}

      const temp = [fileOne, fileTwo, fileThree, fileFour]
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

      expect(await pAgent.resolveNodeType(fileOne))
        .to.deep.equal(expectedMap[fileOne].type)
      expect(await pAgent.resolveNodeType(fileTwo))
        .to.deep.equal(expectedMap[fileTwo].type)
      expect(await pAgent.resolveNodeType(fileThree))
        .to.deep.equal(expectedMap[fileThree].type)
      expect(await pAgent.resolveNodeType(fileFour))
        .to.deep.equal(expectedMap[fileFour].type)
    })
  })

  describe('#getSharedNodes', async function() {
    it('Should correctly throw if no uri provided', async function() {
      expect(() => (new PermAgent())
        .getSharedNodes()).to.throw('No Uri supplied.')
    })

    it('Should correctly handle index GET fail', async function() {
      const pAgent = new PermAgent()
      pAgent._getIndexUri = () => 'https://indexmock.com'
      pAgent.findTriples = async() => -1

      expect(await pAgent.getSharedNodes('mockuri.com')).to.deep.equal({})
    })
    it('Should correctly return shared nodes', async function() {
      const pAgent = new PermAgent()
      const expectedMap = {
        [fileOne]: {uri: fileOne, type: 'typeDocument'},
        [fileTwo]: {uri: fileTwo, type: 'typeImage'},
        [fileThree]: {uri: fileThree, type: 'typePerson'},
        [fileFour]: {uri: fileFour, type: 'typeNotDetected'}
      }
      pAgent._getIndexUri = (uri) => 'mockIndexFile'

      pAgent.findTriples = async(indexUri, subj, pred, obj) => {
        expect(indexUri).to.equal('mockIndexFile')
        expect(pred).to.be.undefined
        expect(obj).to.be.undefined

        return Object.keys(expectedMap).map(key => {
          return {
            subject: rdf.sym(uri),
            predicate: PRED.readPermission,
            object: rdf.sym(expectedMap[key].uri)
          }
        })
      }

      pAgent.resolveNodeType = async(nodeUri) => {
        expect(nodeUri).to.equal(expectedMap[nodeUri].uri)
        return expectedMap[nodeUri].type
      }

      const result = await pAgent.getSharedNodes(uri)
      expect(result).to.deep.equal({
        typeDocument: [{ perm: PRED.readPermission.uri, uri: fileOne }],
        typeImage: [{ perm: PRED.readPermission.uri, uri: fileTwo }],
        typePerson: [{ perm: PRED.readPermission.uri, uri: fileThree }],
        typeNotDetected: [{ perm: PRED.readPermission.uri, uri: fileFour }]
      })
    })
  })
})
