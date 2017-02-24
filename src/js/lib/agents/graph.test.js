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
    const centerNode = {
      uri: 'https://centernode.com/profile/card',
      storage: 'https://centernode.com/files'
    }

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
    }, {
      subject: rdf.sym(uri),
      predicate: PRED.storage,
      object: rdf.sym(centerNode.storage),
      why: rdf.sym('chrome:theSession')
    }, {
      subject: rdf.sym(uri),
      predicate: PRED.maker,
      object: rdf.sym(centerNode.uri),
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
        nodeType,
        centerNode
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
      gAgent._fetch = async(uri) => {
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

  describe('#deleteFile', function() {
    it('Should send a delete request', function() {
      const gAgent = new GraphAgent()
      const fileUri = 'https://testfile.com/first'
      gAgent.deleteFile = (uri) => {
        expect(uri).to.equal(fileUri)
      }
      gAgent.deleteFile(fileUri)
    })
  })

  describe('#createNode', function() {
    const gAgent = new GraphAgent()
    const originalAddImg = gAgent.addImage

    gAgent.randomString = () => 'abcde'
    gAgent.createAcl = (uri, user, confidential) => {
      expect(uri).to.equal(newNodeUri)
      expect(user).to.equal(currentUser)
      expect(confidential).to.be.nodeInfo.confidential
    }
    gAgent.put = async(uri, body, headers) => {
      expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' + newNodeUri)
      expect(headers).to.deep.equal({
        'Content-Type': 'text/turtle'
      })
      expect(body)
        .to.equal(_bodyFor(nodeInfo.nodeType, newNodeUri, nodeInfo.image))
    }
    gAgent.linkNodes = async(start, type, end, render) => {
      expect(start).to.equal(centerNode.uri)
      expect(type).to.equal('generic')
      expect(end).to.equal(newNodeUri)
      expect(render).to.be.false
    }

    const currentUser = 'https://testuser.com/profile/card#me'
    const centerNode = {
      uri: 'https://centernodeuri.com/',
      storage: 'https://centernodeuri.com/storage/'
    }
    const newNodeUri = centerNode.storage + 'abcde'
    const nodeInfo = {
      title: 'title',
      description: 'description is here',
      confidential: false,
      nodeType: 'default',
      image: false
    }

    const _bodyFor = (nodeType, uri, image) => {
      const typeMap = {
        'default': PRED.Document,
        'image': PRED.Image
      }

      const expectedWriter = new Writer()
      const statements = [
        {pred: PRED.type, obj: typeMap[nodeType]},
        {pred: PRED.title, obj: rdf.literal(nodeInfo.title)},
        {pred: PRED.description, obj: rdf.literal(nodeInfo.description)},
        {pred: PRED.storage, obj: rdf.sym(centerNode.storage)},
        {pred: PRED.maker, obj: rdf.sym(centerNode.uri)}
      ]

      statements.forEach(trip => {
        expectedWriter.add({
          subject: rdf.sym(uri),
          predicate: trip.pred,
          object: trip.obj
        })
      })

      if (image) {
        expectedWriter.addTriple({
          subject: rdf.sym(uri),
          predicate: PRED.image,
          object: rdf.literal(image)
        })
      }

      return expectedWriter.end()
    }
    // A lot of references passed around at the moment.
    it('Should create public basic node with no image', async function() {
      gAgent.addImage = async() => {
        expect(true).to.be.false
      }
      gAgent.createNode(currentUser, centerNode, nodeInfo)
      gAgent.addImage = originalAddImg
    })

    it('Should create private basic node with no image', async function() {
      gAgent.addImage = async() => {
        expect(true).to.be.false
      }
      nodeInfo.confidential = true
      await gAgent.createNode(currentUser, centerNode, nodeInfo)
      nodeInfo.confidential = false
      gAgent.addImage = originalAddImg
    })

    it('Should create public basic node with image', async function() {
      nodeInfo.image = 'https://imagelink.com'
      nodeInfo.confidential = false
      nodeInfo.nodeType = 'default'

      await gAgent.createNode(currentUser, centerNode, nodeInfo)

      nodeInfo.nodeType = 'default'
      nodeInfo.image = false
    })

    it('Should create private basic node with image', async function() {
      nodeInfo.image = 'https://imagelink.com'
      nodeInfo.confidential = true
      nodeInfo.nodeType = 'default'

      await gAgent.createNode(currentUser, centerNode, nodeInfo)

      nodeInfo.nodeType = 'default'
      nodeInfo.image = false
    })

    it('Should create pubilic image node with image', async function() {
      nodeInfo.image = 'https://imagelink.com'
      nodeInfo.confidential = false
      nodeInfo.nodeType = 'image'

      await gAgent.createNode(currentUser, centerNode, nodeInfo)

      nodeInfo.nodeType = 'default'
      nodeInfo.image = false
    })
  })

  describe('#storeFile', function() {
    it('Should correcly store a public file', async function() {

    })
  })
})
