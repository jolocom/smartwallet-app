/* global describe: true, it: true */
var expect = require('chai').expect
import {Writer} from 'lib/rdf'
import {PRED} from 'lib/namespaces'
import GraphAgent from './graph'
import rdf from 'rdflib'

describe('GraphAgent', function() {
  const MOCK_WEBID = 'https://mockwebid.com/card'

  describe('#baseNode', function() {
    const gAgent = new GraphAgent()
    const title = 'Test Name'
    const description = 'Description. With some characters.'
    const centerNode = {
      uri: 'https://centernode.com/profile/card',
      storage: 'https://centernode.com/files'
    }

    const expected = [{
      subject: rdf.sym(MOCK_WEBID),
      predicate: PRED.title,
      object: rdf.literal(title),
      why: rdf.sym('chrome:theSession')
    }, {
      subject: rdf.sym(MOCK_WEBID),
      predicate: PRED.description,
      object: rdf.literal(description),
      why: rdf.sym('chrome:theSession')
    }, {
      subject: rdf.sym(MOCK_WEBID),
      predicate: PRED.storage,
      object: rdf.sym(centerNode.storage),
      why: rdf.sym('chrome:theSession')
    }, {
      subject: rdf.sym(MOCK_WEBID),
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
        subject: rdf.sym(MOCK_WEBID),
        predicate: PRED.type,
        object: nodeTypeMap[nodeType],
        why: rdf.sym('chrome:theSession')
      })

      expect(gAgent.baseNode(
        MOCK_WEBID,
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

  describe('#addImage', function() {
    const gAgent = new GraphAgent()
    const container = 'https://test.com/files/'
    const confidential = false

    it('Should correctly add triple when passed uri to image',
      async function() {
        const writer = new Writer()
        const image = 'https://someimage.com/bg.jpg'
        gAgent.storeFile = (imgUri, container, writer, image, confidential) => {
          expect(true).to.be.false
        }

        gAgent.addImage(MOCK_WEBID, container, writer, image, confidential)
        expect(writer.g.statements).to.deep.equal([{
          subject: rdf.sym(MOCK_WEBID),
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

  describe('#checkImages', function() {
    it('Should correctly detect unavailable images', async function() {
      const gAgent = new GraphAgent()
      const imgUri = 'https://mockuri.com/omage.jpg'
      const testNode = {img: imgUri}

      gAgent._fetch = async(uri) => {
        expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' + imgUri)
        return {
          status: 403
        }
      }

      await gAgent.checkImages([testNode])
      expect(testNode).to.deep.equal({
        img: ''
      })

      testNode.img = imgUri
      gAgent._fetch = async(uri) => {
        expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' + imgUri)
        throw new Error()
      }

      await gAgent.checkImages([testNode])
      expect(testNode).to.deep.equal({
        img: ''
      })
    })

    it('Should leave available immages untouched', async function() {
      const gAgent = new GraphAgent()
      const imgUri = 'https://mockuri.com/omage.jpg'
      const testNode = {img: imgUri}

      gAgent.head = async(uri) => {
        expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' + imgUri)
        return {
          ok: true
        }
      }

      await gAgent.checkImages([testNode])
      expect(testNode).to.deep.equal({
        img: imgUri
      })
    })
  })

  describe('#deleteFile', function() {
    it('Should send a delete request', function() {
      const gAgent = new GraphAgent()
      const fileUri = 'https://mockuser.com/mockfile'
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
    gAgent.createAcl = async(uri, user, confidential) => {
      expect(uri).to.equal(newNodeUri)
      expect(user).to.equal(MOCK_WEBID)
      expect(confidential).to.equal(nodeInfo.confidential)
    }
    gAgent.put = async(uri, body, headers) => {
      expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' + newNodeUri)
      expect(headers).to.deep.equal({
        'Content-Type': 'text/turtle'
      })
      expect(body)
        .to.equal(_bodyFor(nodeInfo.nodeType, newNodeUri, nodeInfo.image))
    }
    gAgent.linkNodes = async(start, type, end) => {
      expect(start).to.equal(centerNode.uri)
      expect(type).to.equal('generic')
      expect(end).to.equal(newNodeUri)
    }

    const centerNode = {
      uri: MOCK_WEBID,
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
      gAgent.createNode(MOCK_WEBID, centerNode, nodeInfo)
      gAgent.addImage = originalAddImg
    })

    it('Should create private basic node with no image', async function() {
      gAgent.addImage = async() => {
        expect(true).to.be.false
      }
      nodeInfo.confidential = true
      await gAgent.createNode(MOCK_WEBID, centerNode, nodeInfo)
      nodeInfo.confidential = false
      gAgent.addImage = originalAddImg
    })

    it('Should create public basic node with image', async function() {
      nodeInfo.image = 'https://imagelink.com'
      nodeInfo.confidential = false
      nodeInfo.nodeType = 'default'

      await gAgent.createNode(MOCK_WEBID, centerNode, nodeInfo)

      nodeInfo.nodeType = 'default'
      nodeInfo.image = false
    })

    it('Should create private basic node with image', async function() {
      nodeInfo.image = 'https://imagelink.com'
      nodeInfo.confidential = true
      nodeInfo.nodeType = 'default'

      await gAgent.createNode(MOCK_WEBID, centerNode, nodeInfo)

      nodeInfo.nodeType = 'default'
      nodeInfo.image = false
    })

    it('Should create pubilic image node with image', async function() {
      nodeInfo.image = 'https://imagelink.com'
      nodeInfo.confidential = false
      nodeInfo.nodeType = 'image'

      await gAgent.createNode(MOCK_WEBID, centerNode, nodeInfo)

      nodeInfo.nodeType = 'default'
      nodeInfo.image = false
    })
  })

  describe('#storeFile', function() {
    it('Should correcly store a public and private files', async function() {
      const mockFile = {name: 'mockName'}
      const mockDstCont = 'https://mockwebid.com/'
      let mockDestination = 'https://mockwebid.com/files/x'
      let mockConfidential = false

      const gAgent = new GraphAgent()
      gAgent._getWebId = () => MOCK_WEBID
      gAgent.createAcl = async(finalUri, webId, confidential) => {
        expect(finalUri).to.equal(mockDestination)
        expect(webId).to.equal(MOCK_WEBID)
        expect(confidential).to.equal(mockConfidential)
      }
      gAgent.put = async(uri, file, headers) => {
        expect(uri)
          .to.equal('https://proxy.jolocom.de/proxy?url=' + mockDestination)
        expect(file).to.deep.equal(mockFile)
        expect(headers).to.deep.equal({
          'Content-Type': 'image'
        })
      }
      gAgent.randomString = () => 'abcde'
      await gAgent.storeFile(mockDestination, null, mockFile, mockConfidential)

      mockConfidential = true
      mockDestination = `${mockDstCont}files/abcde`

      await gAgent.storeFile(null, mockDstCont, mockFile, mockConfidential)
    })
  })

  describe('#createAcl', function() {
    const gAgent = new GraphAgent()
    const uri = 'https://mockfile.com/card'
    const writer = new Writer()

    const tripleMap = [
      {pred: PRED.type, obj: [PRED.auth]},
      {pred: PRED.access, obj: [rdf.sym(uri), rdf.sym(uri + '.acl')]},
      {pred: PRED.agent, obj: [rdf.sym(MOCK_WEBID)]},
      {pred: PRED.mode, obj: [PRED.read, PRED.write, PRED.control]}
    ]

    gAgent.put = async(finUri, body, headers) => {
      expect(finUri).to.equal(`https://proxy.jolocom.de/proxy?url=${uri}.acl`)
      expect(headers).to.deep.equal({
        'Content-Type': 'text/turtle'
      })
      expect(body).to.equal(writer.end())
    }

    it('Should correctly create private acl', async function() {
      tripleMap.forEach(st => {
        st.obj.forEach(obj => {
          writer.addTriple(rdf.sym(uri + 'acl#owner'), st.pred, obj)
        })
      })
      gAgent.createAcl(uri, MOCK_WEBID, false)
    })

    it('Should correctly create public acl', async function() {
      const all = rdf.sym(uri + '.acl#readall')
      writer.addTriple(all, PRED.type, PRED.auth)
      writer.addTriple(all, PRED.access, rdf.sym(uri))
      writer.addTriple(all, PRED.agentClass, PRED.Agent)
      writer.addTriple(all, PRED.mode, PRED.read)
      gAgent.createAcl(uri, MOCK_WEBID, true)
    })
  })

  describe('#writeTriple', function() {
    const gAgent = new GraphAgent()
    const destination = 'https://testfile.com/card'
    const triples = [{
      subject: rdf.sym(MOCK_WEBID),
      predicate: PRED.type,
      object: PRED.Document
    }]

    it('Should add new triple correctly', async function() {
      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(uri).to.equal(destination)
        return []
      }
      gAgent.patch = async(uri, toDel, toAdd) => {
        const g = rdf.graph()
        g.addAll(triples)

        expect(toAdd).to.deep.equal(g.statements)
        expect(toDel).to.deep.equal([])
        expect(uri)
          .to.equal('https://proxy.jolocom.de/proxy?url=' + destination)
      }

      await gAgent.writeTriples(destination, triples)
    })

    it('Should not add duplicate triple', async function() {
      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(uri).to.equal(destination)
        return triples
      }

      gAgent.patch = async(uri, toDel, toAdd) => {
        expect(toAdd).to.deep.equal([])
        expect(toDel).to.deep.equal([])
        expect(uri)
          .to.equal('https://proxy.jolocom.de/proxy?url=' + destination)
      }

      await gAgent.writeTriples(destination, triples)
    })
  })

  describe('#deleteTriples', function() {
    const gAgent = new GraphAgent()

    it('Should correctly attempt to delete a triple', async function() {
      const expected = [{
        subject: rdf.literal('subjectUri'),
        predicate: PRED.knows,
        object: rdf.sym('https://testuser'),
        why: rdf.sym('chrome:theSession')
      }]

      gAgent.patch = async(uri, toDel, toAdd) => {
        expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' + MOCK_WEBID)
        expect(toAdd).to.deep.equal([])
        expect(toDel).to.deep.equal(expected)
      }

      gAgent.deleteTriples(
        MOCK_WEBID,
        expected[0].subject,
        expected[0].predicate,
        expected[0].object
      )
    })

    it('Should correctly attempt to delete more triples', async function() {
      const expected = [{
        subject: rdf.literal('subjectUri'),
        predicate: PRED.knows,
        object: rdf.sym('https://testuser'),
        why: rdf.sym('chrome:theSession')
      }, {
        subject: rdf.literal('secondSubjectUri'),
        predicate: PRED.knows,
        object: rdf.sym('https://testusertwo'),
        why: rdf.sym('chrome:theSession')
      }]

      gAgent.patch = async(uri, toDel, toAdd) => {
        expect(uri).to.equal('https://proxy.jolocom.de/proxy?url=' + MOCK_WEBID)
        expect(toAdd).to.deep.equal([])
        expect(toDel).to.deep.equal(expected)
      }
      gAgent.deleteTriples({uri: MOCK_WEBID, triples: expected})
    })
  })
  describe('#getNeighbours', function() {
    it('Should correctly handle node with no neighours', async function() {
      const gAgent = new GraphAgent()
      const triples = []
      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(false).to.be.true
      }

      gAgent.getNeighbours(triples)
    })

    it('Should correctly get the neighbours of a profile', async function() {
      const gAgent = new GraphAgent()
      const usrOne = 'https://testuserone'
      const usrTwo = 'https://testusertwo'

      const triples = [{
        subject: rdf.literal('subjectUri'),
        predicate: PRED.type,
        object: PRED.Document,
        why: rdf.sym('chrome:theSession')
      }, {
        subject: rdf.literal('secondSubjectUri'),
        predicate: PRED.knows,
        object: rdf.sym(usrOne),
        why: rdf.sym('chrome:theSession')
      }, {
        subject: rdf.literal('secondSubjectUri'),
        predicate: PRED.knows,
        object: rdf.sym(usrTwo),
        why: rdf.sym('chrome:theSession')
      }]

      const responseMap = {
        [usrOne]: {
          triples: [{
            subject: rdf.sym(usrOne),
            predicate: PRED.type,
            object: PRED.Document,
            why: rdf.sym('chrome:theSession')
          }]
        },
        [usrTwo]: {
          triples: [{
            subject: rdf.sym(usrTwo),
            predicate: PRED.type,
            object: PRED.Document,
            why: rdf.sym('chrome:theSession')
          }]
        }
      }

      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(uri)
          .to.equal(responseMap[uri].triples[0].subject.uri)
        return responseMap[uri]
      }

      const result = await gAgent.getNeighbours(triples)
      expect(result).to
        .deep.equal([responseMap[usrOne].triples, responseMap[usrTwo].triples])
    })
  })

  // @TODO Perhaps test all potential fields
  describe('#getFileModel', function() {
    it('Should retrieve and convert a rdf file.', async function() {
      const gAgent = new GraphAgent()
      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(uri).to.equal(MOCK_WEBID)
        return {
          triples: [{
            subject: rdf.sym(MOCK_WEBID),
            predicate: PRED.type,
            object: PRED.Document,
            why: rdf.sym('chrome:theSession')
          }]
        }
      }

      const result = await gAgent.getFileModel(MOCK_WEBID)
      expect(result).to.deep.equal(
        [{
          address: '',
          company: '',
          confidential: undefined,
          connection: null,
          description: null,
          email: '',
          img: null,
          mobilePhone: '',
          name: null,
          profession: '',
          rank: 'neighbour',
          socialMedia: '',
          storage: null,
          title: null,
          type: 'http://xmlns.com/foaf/0.1/Document',
          uri: 'https://mockresource.com/profile/card',
          url: ''
        }]
      )
    })
  })

  describe('#linkNodes', function() {
    const gAgent = new GraphAgent()
    const start = 'https://startnode.com/card'
    const type = 'generic'
    const end = 'https://endnode.com/card'

    const expectedPayload = [{
      subject: rdf.sym(start),
      predicate: PRED.isRelatedTo,
      object: rdf.sym(end)
    }]

    gAgent.head = async(uri) => {}
    gAgent.writeTriples = async(uri, payload) => {
      expect(uri).to.equal(start)
      expect(payload).to.deep.equal(expectedPayload)
    }

    it('Should correctly link 2 nodes', async function() {
      gAgent.linkNodes(start, type, end)
    })

    it('Should not link in case resoruces are not available',
      async function() {
        gAgent.head = async(uri) => {
          throw new Error()
        }

        gAgent.writeTriples = async(uri, payload) => {
          expect(uri).to.equal(start)
          expect(payload).to.deep.equal([])
        }

        gAgent.linkNodes(start, type, end)
      })
  })

  describe('#convertToNodes', function() {
    it('Should correctly convert triples to node', async function() {
      const triples = [[
        {
          subject: rdf.sym(MOCK_WEBID),
          predicate: PRED.title,
          object: rdf.literal('Mock Title'),
          why: rdf.sym('chrome:theSession')
        }, {
          subject: rdf.sym(MOCK_WEBID),
          predicate: PRED.description,
          object: rdf.literal('Mock Description'),
          why: rdf.sym('chrome:theSession')
        }
      ]]
      triples[0].uri = MOCK_WEBID

      expect((new GraphAgent()).convertToNodes('a', triples)).to.deep.equal([
        {
          address: '',
          company: '',
          confidential: undefined,
          connection: null,
          description: 'Mock Description',
          email: '',
          img: null,
          mobilePhone: '',
          name: null,
          profession: '',
          rank: 'neighbour',
          socialMedia: '',
          storage: null,
          title: 'Mock Title',
          type: null,
          uri: MOCK_WEBID,
          url: ''
        }
      ])
    })
  })
})
