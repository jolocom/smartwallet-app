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

    it('Should throw if not enough arguments are provided', function() {
      expect(() => {
        gAgent.baseNode()
      }).to.throw('baseNode: not enough arguments')
      expect(() => {
        gAgent.baseNode(undefined, new Writer(), title, description, 'default')
      }).to.throw('baseNode: not enough arguments')
      expect(() => {
        gAgent.baseNode('test', undefined, title, description, 'default')
      }).to.throw('baseNode: not enough arguments')
      expect(() => {
        gAgent.baseNode('test', new Writer(), title, description, undefined)
      }).to.throw('baseNode: not enough arguments')
    })
  })

  // @TODO Add test for uploading instanceof File
  describe('#addImage', function() {
    const gAgent = new GraphAgent()
    const uri = 'https://test.com/profile/card#me'
    const container = 'https://test.com/files/'
    const confidential = false

    it('Should correctly add triple when passed uri to image',
      async function() {
        const writer = new Writer()
        const image = 'https://someimage.com/bg.jpg'
        gAgent.storeFile = (imgUri, container, writer, image, confidential) => {
          expect(true).to.be.false
        }

        gAgent.addImage(uri, container, writer, image, confidential)
        expect(writer.g.statements).to.deep.equal([{
          subject: rdf.sym(uri),
          predicate: PRED.image,
          object: rdf.literal(image),
          why: rdf.sym('chrome:theSession')
        }])
      }
    )
    it('Should correctly throw if no arguments are passed', function() {
      expect(() => gAgent.addImage()).to.throw('addImage: not enough arguments')
    })
  })

  describe('#testImages', function() {
    it('Should correctly detect unavailable images', async function() {
      const gAgent = new GraphAgent()
      const testNode = {img: 'https://randomuri.com/image.jpg'}

      gAgent._fetch = async(uri) => {
        expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' +
          'https://randomuri.com/image.jpg')
        return {
          status: 403
        }
      }

      await gAgent.checkImages([testNode])
      expect(testNode).to.deep.equal({
        img: ''
      })

      testNode.img = 'https://randomuri.com/image.jpg'
      gAgent._fetch = (uri) => {
        expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' +
          'https://randomuri.com/image.jpg')
        throw new Error()
      }

      await gAgent.checkImages([testNode])
      expect(testNode).to.deep.equal({
        img: ''
      })
    })

    it('Should leave available immages untouched', async function() {
      const gAgent = new GraphAgent()
      const testNode = {img: 'https://randomuri.com/image.jpg'}

      gAgent.head = async(uri) => {
        expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' +
          'https://randomuri.com/image.jpg')
        return {
          ok: true
        }
      }

      await gAgent.checkImages([testNode])
      expect(testNode).to.deep.equal({
        img: 'https://randomuri.com/image.jpg'
      })
    })
  })
})
