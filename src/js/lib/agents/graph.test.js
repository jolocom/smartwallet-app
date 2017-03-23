/* global describe: true, it: true, beforeEach: true */
var expect = require('chai').expect
import {Writer} from 'lib/rdf'
import {PRED} from 'lib/namespaces'
import GraphAgent from './graph'
import rdf from 'rdflib'

describe('GraphAgent', function() {
  const WEBID = 'https://mockwebid.com/card'
  const PROXY_URL = 'https://proxy.jolocom.de/proxy?url='

  describe('#baseNode', function() {
    beforeEach(function() {
      this.gAgent = new GraphAgent()
    })

    const title = 'Test Name'
    const desc = 'Description. With some characters.'
    const centerNode = {
      uri: 'https://centernode.com/profile/card',
      storage: 'https://centernode.com/files'
    }

    const expected = [{
      subject: rdf.sym(WEBID),
      predicate: PRED.title,
      object: rdf.literal(title),
      why: rdf.sym('chrome:theSession')
    }, {
      subject: rdf.sym(WEBID),
      predicate: PRED.description,
      object: rdf.literal(desc),
      why: rdf.sym('chrome:theSession')
    }, {
      subject: rdf.sym(WEBID),
      predicate: PRED.storage,
      object: rdf.sym(centerNode.storage),
      why: rdf.sym('chrome:theSession')
    }, {
      subject: rdf.sym(WEBID),
      predicate: PRED.maker,
      object: rdf.sym(centerNode.uri),
      why: rdf.sym('chrome:theSession')
    }]

    it('Should populate default node boilerplate', function() {
      const type = 'default'
      const w = new Writer()

      const nodeTypeTrip = [{
        subject: rdf.sym(WEBID),
        predicate: PRED.type,
        object: PRED.Document,
        why: rdf.sym('chrome:theSession')
      }]

      const result = this.gAgent.baseNode(
        WEBID, w, title, desc, type, centerNode
      )
      expect(result.g.statements).to.deep.equal(expected.concat(nodeTypeTrip))
    })

    it('Should populate image node boilerplate', function() {
      const type = 'image'
      const w = new Writer()
      const nodeTypeTrip = [{
        subject: rdf.sym(WEBID),
        predicate: PRED.type,
        object: PRED.Image,
        why: rdf.sym('chrome:theSession')
      }]

      const result = this.gAgent.baseNode(
        WEBID, w, title, desc, type, centerNode
      )
      expect(result.g.statements).to.deep.equal(expected.concat(nodeTypeTrip))
    })

    it('Should populate passport node boilerplate', function() {
      const type = 'passport'
      const w = new Writer()
      const nodeTypeTrip = [{
        subject: rdf.sym(WEBID),
        predicate: PRED.type,
        object: PRED.Document,
        why: rdf.sym('chrome:theSession')
      }]

      const result = this.gAgent.baseNode(
        WEBID, w, title, desc, type, centerNode
      )
      expect(result.g.statements).to.deep.equal(expected.concat(nodeTypeTrip))
    })

    it('Should populate confidential node boilerplate', function() {
      const type = 'confidential'
      const w = new Writer()
      const nodeTypeTrip = [{
        subject: rdf.sym(WEBID),
        predicate: PRED.type,
        object: PRED.Document,
        why: rdf.sym('chrome:theSession')
      }]

      const result = this.gAgent.baseNode(
        WEBID, w, title, desc, type, centerNode
      )
      expect(result.g.statements).to.deep.equal(expected.concat(nodeTypeTrip))
    })

    it('Should throw if not enough arguments are provided', function() {
      expect(() => {
        this.gAgent.baseNode()
      }).to.throw('baseNode: not enough arguments')
      expect(() => {
        this.gAgent.baseNode(undefined, new Writer(), title, desc, 'default')
      }).to.throw('baseNode: not enough arguments')
      expect(() => {
        this.gAgent.baseNode('test', undefined, title, desc, 'default')
      }).to.throw('baseNode: not enough arguments')
      expect(() => {
        this.gAgent.baseNode('test', new Writer(), title, desc, undefined)
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

        gAgent.addImage(WEBID, container, writer, image, confidential)
        expect(writer.g.statements).to.deep.equal([{
          subject: rdf.sym(WEBID),
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
    const imgUri = 'https://mockuri.com/image.jpg'

    it('Should correctly detect bad status code', async function() {
      const gAgent = new GraphAgent()
      const testNode = {img: imgUri}

      gAgent._fetch = async(uri) => {
        expect(uri).to.equal(PROXY_URL + imgUri)
        return {
          status: 403
        }
      }
      await gAgent.checkImages([testNode])
      expect(testNode).to.deep.equal({
        img: ''
      })
    })

    it('Should correctly detect network error', async function() {
      const gAgent = new GraphAgent()
      const testNode = {img: imgUri}

      gAgent._fetch = async(uri) => {
        expect(uri).to.equal(PROXY_URL + imgUri)
        throw new Error()
      }
      await gAgent.checkImages([testNode])
      expect(testNode).to.deep.equal({
        img: ''
      })
    })

    it('Should leave available images untouched', async function() {
      const gAgent = new GraphAgent()
      const testNode = {img: imgUri}

      gAgent.head = async(uri) => {
        expect(uri).to.equal(PROXY_URL + imgUri)
        return {
          status: 200,
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
    beforeEach(function() {
      this.gAgent = new GraphAgent()
      this.gAgent.randomString = () => 'abcde'
      this.gAgent.createAcl = async(uri, user, confidential) => {
        expect(uri).to.equal(newNodeUri)
        expect(user).to.equal(WEBID)
        expect(confidential).to.equal(nodeInfo.confidential)
      }
      this.gAgent.put = async(uri, body, headers) => {
        expect(uri).to.equal(PROXY_URL + newNodeUri)
        expect(headers).to.deep.equal({
          'Content-Type': 'text/turtle'
        })
        expect(body)
          .to.equal(_bodyFor(nodeInfo.nodeType, newNodeUri, nodeInfo.image))
      }
      this.gAgent.linkNodes = async(start, type, end) => {
        expect(start).to.equal(center.uri)
        expect(type).to.equal('generic')
        expect(end).to.equal(newNodeUri)
      }
    })

    const center = {
      uri: WEBID,
      storage: 'https://centernodeuri.com/storage/'
    }
    const newNodeUri = center.storage + 'abcde'
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
        {pred: PRED.storage, obj: rdf.sym(center.storage)},
        {pred: PRED.maker, obj: rdf.sym(center.uri)}
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
      this.gAgent.addImage = async() => {
        expect(true).to.be.false
      }

      this.gAgent.createNode(WEBID, center, nodeInfo)
    })

    it('Should create private basic node with no image', async function() {
      this.gAgent.addImage = async() => {
        expect(true).to.be.false
      }
      nodeInfo.confidential = true
      await this.gAgent.createNode(WEBID, center, nodeInfo)
      nodeInfo.confidential = false
    })

    it('Should create public basic node with image', async function() {
      nodeInfo.image = 'https://imagelink.com'
      nodeInfo.confidential = false
      nodeInfo.nodeType = 'default'

      await this.gAgent.createNode(WEBID, center, nodeInfo)

      nodeInfo.nodeType = 'default'
      nodeInfo.image = false
    })

    it('Should create private basic node with image', async function() {
      nodeInfo.image = 'https://imagelink.com'
      nodeInfo.confidential = true
      nodeInfo.nodeType = 'default'

      await this.gAgent.createNode(WEBID, center, nodeInfo)

      nodeInfo.nodeType = 'default'
      nodeInfo.image = false
    })

    it('Should create pubilic image node with image', async function() {
      nodeInfo.image = 'https://imagelink.com'
      nodeInfo.confidential = false
      nodeInfo.nodeType = 'image'

      await this.gAgent.createNode(WEBID, center, nodeInfo)

      nodeInfo.nodeType = 'default'
      nodeInfo.image = false
    })
  })

  describe('#storeFile', function() {
    const mockFile = {name: 'mockName'}

    it('Should store public file with provided uri', async function() {
      const mockDestination = 'https://mockwebid.com/files/x'
      const mockConfidential = false
      const gAgent = new GraphAgent()

      gAgent._getWebId = () => WEBID
      gAgent.createAcl = async(finalUri, webId, confidential) => {
        expect(finalUri).to.equal(mockDestination)
        expect(webId).to.equal(WEBID)
        expect(confidential).to.be.false
        return
      }

      gAgent.put = async(uri, file, headers) => {
        expect(uri)
          .to.equal(PROXY_URL + mockDestination)
        expect(file).to.deep.equal(mockFile)
        expect(headers).to.deep.equal({
          'Content-Type': 'image'
        })
        return
      }

      await gAgent.storeFile(mockDestination, null, mockFile, mockConfidential)
    })

    it('Should store private file given the container uri ', async function() {
      const mockDstCont = 'https://mockwebid.com/'
      const expectedDestination = `${mockDstCont}files/abcde`
      const mockConfidential = true
      const gAgent = new GraphAgent()

      gAgent._getWebId = () => WEBID

      gAgent.randomString = () => 'abcde'

      gAgent.createAcl = async(finalUri, webId, confidential) => {
        expect(finalUri).to.equal(expectedDestination)
        expect(webId).to.equal(WEBID)
        expect(confidential).to.be.true
        return
      }

      gAgent.put = async(uri, file, headers) => {
        expect(uri)
          .to.equal(PROXY_URL + expectedDestination)
        expect(file).to.deep.equal(mockFile)
        expect(headers).to.deep.equal({
          'Content-Type': 'image'
        })
        return
      }

      await gAgent.storeFile('', mockDstCont, mockFile, mockConfidential)
    })
  })

  describe('#createAcl', function() {
    const tripleMap = [
      {pred: PRED.type, obj: [PRED.auth]},
      {pred: PRED.access, obj: [rdf.sym(WEBID), rdf.sym(WEBID + '.acl')]},
      {pred: PRED.agent, obj: [rdf.sym(WEBID)]},
      {pred: PRED.mode, obj: [PRED.read, PRED.write, PRED.control]}
    ]

    it('Should correctly create private acl', async function() {
      const writer = new Writer()
      const gAgent = new GraphAgent()

      tripleMap.forEach(st => {
        st.obj.forEach(obj => {
          writer.addTriple(rdf.sym(WEBID + 'acl#owner'), st.pred, obj)
        })
      })

      gAgent.put = async(finUri, body, headers) => {
        expect(finUri).to.equal(`${PROXY_URL}${WEBID}.acl`)
        expect(headers).to.deep.equal({
          'Content-Type': 'text/turtle'
        })
        expect(body).to.equal(writer.end())
      }

      await gAgent.createAcl(WEBID, WEBID, false)
    })

    it('Should correctly create public acl', async function() {
      const writer = new Writer()
      const all = rdf.sym(WEBID + '.acl#readall')
      const gAgent = new GraphAgent()

      gAgent.put = async(finUri, body, headers) => {
        expect(finUri).to.equal(`${PROXY_URL}${WEBID}.acl`)
        expect(headers).to.deep.equal({
          'Content-Type': 'text/turtle'
        })
        expect(body).to.equal(writer.end())
      }

      tripleMap.forEach(st => {
        st.obj.forEach(obj => {
          writer.addTriple(rdf.sym(WEBID + 'acl#owner'), st.pred, obj)
        })
      })

      writer.addTriple(all, PRED.type, PRED.auth)
      writer.addTriple(all, PRED.access, rdf.sym(WEBID))
      writer.addTriple(all, PRED.agentClass, PRED.Agent)
      writer.addTriple(all, PRED.mode, PRED.read)

      gAgent.createAcl(WEBID, WEBID, true)
    })
  })

  describe('#writeTriple', function() {
    const triples = [{
      subject: rdf.sym(WEBID),
      predicate: PRED.type,
      object: PRED.Document
    }]

    it('Should add new triple correctly', async function() {
      const gAgent = new GraphAgent()

      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(uri).to.equal(WEBID)
        return []
      }

      gAgent.patch = async(uri, toDel, toAdd) => {
        const g = rdf.graph()
        g.addAll(triples)

        expect(toAdd).to.deep.equal(g.statements)
        expect(toDel).to.deep.equal([])
        expect(uri).to.equal(PROXY_URL + WEBID)
      }

      await gAgent.writeTriples(WEBID, triples)
    })

    it('Should not add duplicate triple', async function() {
      const gAgent = new GraphAgent()

      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(uri).to.equal(WEBID)
        return triples
      }

      gAgent.patch = async(uri, toDel, toAdd) => {
        expect(toAdd).to.deep.equal([])
        expect(toDel).to.deep.equal([])
        expect(uri).to.equal(PROXY_URL + WEBID)
      }

      await gAgent.writeTriples(WEBID, triples)
    })
  })

  describe('#deleteTriples', function() {
    it('Should correctly attempt to delete a triple', async function() {
      const gAgent = new GraphAgent()
      const expected = [{
        subject: rdf.sym('subjectUri'),
        predicate: PRED.knows,
        object: rdf.sym('objectUri'),
        why: rdf.sym('chrome:theSession')
      }]

      gAgent.patch = async(uri, toDel, toAdd) => {
        expect(uri).to.equal(PROXY_URL + WEBID)
        expect(toAdd).to.deep.equal([])
        expect(toDel).to.deep.equal(expected)
      }

      const {subject, predicate, object} = expected[0]
      await gAgent.deleteTriples(WEBID, subject, predicate, object)
    })

    it('Should correctly attempt to delete more triples', async function() {
      const gAgent = new GraphAgent()
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
        expect(uri).to.equal(PROXY_URL + WEBID)
        expect(toAdd).to.deep.equal([])
        expect(toDel).to.deep.equal(expected)
      }

      await gAgent.deleteTriples({uri: WEBID, triples: expected})
    })
  })

  describe('#getNeighbours', function() {
    it('Should correctly handle node with no neighours', async function() {
      const gAgent = new GraphAgent()
      const triples = []
      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(false).to.be.true
      }

      await gAgent.getNeighbours(triples)
    })

    it('Should correctly get the neighbours of a profile', async function() {
      const gAgent = new GraphAgent()
      const usrOne = 'https://testuserone.com/card'
      const usrTwo = 'https://testusertwo.com/card'

      const triples = [{
        subject: rdf.sym(WEBID),
        predicate: PRED.type,
        object: PRED.Document,
        why: rdf.sym('chrome:theSession')
      }, {
        subject: rdf.sym(WEBID),
        predicate: PRED.knows,
        object: rdf.sym(usrOne),
        why: rdf.sym('chrome:theSession')
      }, {
        subject: rdf.sym(WEBID),
        predicate: PRED.knows,
        object: rdf.sym(usrTwo),
        why: rdf.sym('chrome:theSession')
      }]

      const responseMap = {
        [usrOne]: {
          uri: usrOne,
          triples: [{
            subject: rdf.sym(usrOne),
            predicate: PRED.type,
            object: PRED.Document,
            why: rdf.sym('chrome:theSession')
          }]
        },
        [usrTwo]: {
          uri: usrTwo,
          triples: [{
            subject: rdf.sym(usrTwo),
            predicate: PRED.type,
            object: PRED.Document,
            why: rdf.sym('chrome:theSession')
          }]
        }
      }

      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(uri).to.equal(responseMap[uri].uri)
        return responseMap[uri]
      }

      const result = await gAgent.getNeighbours(triples)

      const userOneTripls = responseMap[usrOne].triples
      const userTwoTripls = responseMap[usrTwo].triples

      expect(result).to.deep.equal([userOneTripls, userTwoTripls])
    })
  })

  describe('#getFileModel', function() {
    it('Should retrieve and convert a rdf file.', async function() {
      const gAgent = new GraphAgent()
      const tripsToBeAdded = [
        {pred: PRED.address, obj: 'MockStr 1'},
        {pred: PRED.company, obj: 'MockCompany'},
        {pred: PRED.description, obj: 'MockDescription'},
        {pred: PRED.email, obj: 'mailto:mock@mock.com'},
        {pred: PRED.image, obj: 'Avatar.jpg'},
        {pred: PRED.mobile, obj: '555-555-555'},
        {pred: PRED.givenName, obj: 'John'},
        {pred: PRED.profession, obj: 'PseudoMocker'},
        {pred: PRED.socialMedia, obj: 'fb.com/googleplus'},
        {pred: PRED.url, obj: 'mockhomepage.com'}
      ]

      gAgent.fetchTriplesAtUri = async(uri) => {
        expect(uri).to.equal(WEBID)

        const trips = tripsToBeAdded.map(t => {
          return {
            subject: rdf.sym(WEBID),
            predicate: t.pred,
            object: rdf.literal(t.obj),
            why: rdf.sym('chrome:theSession')
          }
        })
        return {triples: trips}
      }

      const result = await gAgent.getFileModel(WEBID)
      expect(result).to.deep.equal(
        [{
          address: 'MockStr 1',
          company: 'MockCompany',
          confidential: undefined,
          connection: null,
          description: 'MockDescription',
          email: 'mock@mock.com',
          img: 'Avatar.jpg',
          mobilePhone: '555-555-555',
          name: 'John',
          profession: 'PseudoMocker',
          rank: 'neighbour',
          socialMedia: 'fb.com/googleplus',
          storage: null,
          title: null,
          type: null,
          uri: WEBID,
          url: 'mockhomepage.com'
        }]
      )
    })
  })

  describe('#linkNodes', function() {
    const start = 'https://startnode.com/card'
    const type = 'generic'
    const end = 'https://endnode.com/card'

    const expectedPayload = [{
      subject: rdf.sym(start),
      predicate: PRED.isRelatedTo,
      object: rdf.sym(end)
    }]

    it('Should correctly link 2 nodes', async function() {
      const gAgent = new GraphAgent()

      gAgent.head = async(uri) => {}

      gAgent.writeTriples = async(uri, payload) => {
        expect(uri).to.equal(start)
        expect(payload).to.deep.equal(expectedPayload)
      }

      await gAgent.linkNodes(start, type, end)
    })

    it('Should not link when files are not available', async function() {
      const gAgent = new GraphAgent()

      gAgent.head = async(uri) => {
        throw new Error()
      }

      gAgent.writeTriples = async(uri, payload) => {
        expect(uri).to.equal(start)
        expect(payload).to.deep.equal([])
      }

      await gAgent.linkNodes(start, type, end)
    })
  })

  describe('#convertToNodes', function() {
    it('Should correctly convert triples to node', async function() {
      const triples = [[
        {
          subject: rdf.sym(WEBID),
          predicate: PRED.title,
          object: rdf.literal('Mock Title'),
          why: rdf.sym('chrome:theSession')
        }, {
          subject: rdf.sym(WEBID),
          predicate: PRED.description,
          object: rdf.literal('Mock Description'),
          why: rdf.sym('chrome:theSession')
        }
      ]]
      triples[0].uri = WEBID

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
          uri: WEBID,
          url: ''
        }
      ])
    })
  })
})
