/* global describe: true, it: true */
var expect = require('chai').expect
import $rdf from 'rdflib'
import { PRED } from 'lib/namespaces'
import LDPAgent from './ldp'

const DUMMY_JSON_HEADERS = {
  get: (field) => ({
    'Content-Type': 'application/json'
  })[field]
}
const DUMMY_TURTLE_HEADERS = {
  get: (field) => ({
    'Content-Type': 'application/json'
  })[field]
}

describe('LDPAgent', function () {
  describe('#createBasicContainer', function () {
    it('should be create a basic container (directory)', async function () {
      const agent = new LDPAgent()
      agent.normalHTTP._fetch = async (url, options) => {
        expect(options.method).to.equal('PUT')
        expect(url).to.equal('/test')
        expect(options.headers['Content-Type']).to.equal('text/turtle')
        expect(options.headers['Link'])
              .to.equal('<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"')
        expect(options.body).to.equal('')

        return {
          status: 200, json: () => ({ foo: 5 }),
          headers: DUMMY_JSON_HEADERS
        }
      }
      const result = await agent.createBasicContainer('/test')
      expect(result).to.deep.equal({ foo: 5 })
    })
  })

  describe('#findTriples', function () {
    it('it should be able to fetch and filter triples located at a URI',
      async function () {
        const agent = new LDPAgent()
        agent.proxiedHTTP._fetch = async (url, options) => {
          expect(options.method).to.equal('GET')
          expect(url).to.equal('http://foo.com/test')
          return {
            status: 200, ok: true, DUMMY_TURTLE_HEADERS,
            text: async () => `
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
<http://foo.com/profile/alice> foaf:name "Alice" .
<http://foo.com/profile/alice> foaf:knows <http://foo.com/profile/bob> .
<http://foo.com/profile/bob> foaf:name "Bob" .
`.trim()
          }
        }

        const result = await agent.findTriples('http://foo.com/test',
          $rdf.sym('http://foo.com/profile/alice'), PRED.knows, undefined)

        expect(result).to.have.lengthOf(1)
        expect(result[0].subject.value).to.equal('http://foo.com/profile/alice')
        expect(result[0].predicate.value)
              .to.equal('http://xmlns.com/foaf/0.1/knows')
        expect(result[0].object.value).to.equal('http://foo.com/profile/bob')
      }
    )

    it('should handle errors', async () => {
      const agent = new LDPAgent()
      agent.proxiedHTTP._fetch = async (url, options) => {
        expect(options.method).to.equal('GET')
        expect(url).to.equal('http://foo.com/test')
        return {
          status: 404, ok: false, statusText: 'Go away'
        }
      }

      const result = await agent.findTriples('http://foo.com/test',
        $rdf.sym('http://foo.com/profile/alice'), PRED.knows, undefined)
      expect(result).to.deep.equal([])
    })
  })

  describe('#findObjectsByTerm', function () {
    // TODO
  })

  describe('#fetchTriplesAtUri', function () {
    it('it should be able to fetch triples located at a URI',
      async function () {
        const agent = new LDPAgent()
        agent.proxiedHTTP._fetch = async (url, options) => {
          expect(options.method).to.equal('GET')
          expect(url).to.equal('http://foo.com/test')
          return {
            status: 200, ok: true, DUMMY_TURTLE_HEADERS,
            text: async () => `
@prefix foaf: <http://xmlns.com/foaf/0.1/> .
_:a foaf:name "Alice" .
_:a foaf:knows _:b .
_:b foaf:name "Bob" .
`.trim()
          }
        }

        const result = await agent.findTriples('http://foo.com/test')
        expect(result[1].predicate.value)
              .to.equal('http://xmlns.com/foaf/0.1/knows')
      }
    )
  })

  describe('#getAclUri', function () {
    it('should be able to extract ACL location from Link header',
      async function () {
        const agent = new LDPAgent()
        agent.proxiedHTTP._fetch = async (url, options) => {
          expect(options.method).to.equal('HEAD')
          expect(url).to.equal('http://foo.com/test')
          return {
            status: 200, ok: true, headers: {
              get: (field) => ({
                'Content-Type': 'text/rdf',
                'Link': '<testAcl>; rel="acl"'
              })[field]
            },
            text: async () => ''
          }
        }

        const result = await agent.getAclUri('http://foo.com/test')
        expect(result).to.equal('http://foo.com/testAcl')
      }
    )

    it('should guess in the case a Link header is not present', async () => {
      const agent = new LDPAgent()
      agent.proxiedHTTP._fetch = async (url, options) => {
        expect(options.method).to.equal('HEAD')
        expect(url).to.equal('http://foo.com/test')
        return {
          status: 200, ok: true, headers: {
            get: (field) => ({ 'Content-Type': 'text/rdf' })[field]
          },
          text: async () => ''
        }
      }

      const result = await agent.getAclUri('http://foo.com/test')
      expect(result).to.equal('http://foo.com/test.acl')
    })

    it('should guess in the case a rel=acl header is not present ' +
       'even if there are other Link headers', async () => {
      const agent = new LDPAgent()
      agent.proxiedHTTP._fetch = async (url, options) => {
        expect(options.method).to.equal('HEAD')
        expect(url).to.equal('http://foo.com/test')
        return {
          status: 200, ok: true, headers: {
            get: (field) => ({
              'Content-Type': 'text/rdf',
              'Link': 'something; rel="bla"'
            })[field]
          },
          text: async () => ''
        }
      }

      const result = await agent.getAclUri('http://foo.com/test')
      expect(result).to.equal('http://foo.com/test.acl')
    })
  })
})
