/* global describe: true, it: true */
var expect = require('chai').expect
import {Writer} from '../rdf'
import HTTPAgent from './http'

const DUMMY_JSON_HEADERS = {
  get: (field) => ({
    'Content-Type': 'application/json'
  })[field]
}
const DUMMY_HTML_HEADERS = {
  get: (field) => ({
    'Content-Type': 'text/html'
  })[field]
}

describe('HTTPAgent', function() {
  describe('#_req()', function() {
    it('should be able to do a normal GET request', async function() {
      const fakeResponse = {
        status: 200, responseText: 'TEST',
        headers: DUMMY_HTML_HEADERS}

      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => fakeResponse
      const response = await agent._req('/test/', 'GET', null,
                                        {'X-Header1': 'Test'})
      expect(response).to.deep.equal(fakeResponse)
    })

    it('should be able parse a JSON request', async function() {
      const fakeResponse = {
        status: 200, json: () => ({foo: 5}),
        headers: DUMMY_JSON_HEADERS}

      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => fakeResponse
      const response = await agent._req('/test/', 'GET', null)
      expect(response).to.deep.equal({foo: 5})
    })

    it('should reject promise receiving an error HTTP status code',
      async () => {
        const fakeResponse = {status: 404, statusText: 'Not found'}

        const agent = new HTTPAgent()
        agent._fetch = async (url, options) => fakeResponse
        const request = () => agent._req('/test/', 'GET', null)
        await expect(request()).to.be.rejectedWith(Error, 'Not found')
      }
    )

    it('should reject promise receiving an error HTTP status code',
      async () => {
        const fakeResponse = {status: 404, statusText: 'Not found'}

        const agent = new HTTPAgent()
        agent._fetch = async (url, options) => fakeResponse
        const request = () => agent._req('/test/', 'GET', null)
        await expect(request()).to.be.rejectedWith(Error, 'Not found')
      }
    )

    it('should not proxy by default', async () => {
      const fakeResponse = {
        status: 200, responseText: 'TEST',
        headers: DUMMY_HTML_HEADERS}

      const agent = new HTTPAgent()
      expect(agent._proxyURL).to.be.null
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        return fakeResponse
      }
      await agent._req('/test/', 'GET', null)
    })

    it('should correctly detect proxy URL and proxy requests if requested',
      async () => {
        const fakeResponse = {
          status: 200, responseText: 'TEST',
          headers: DUMMY_HTML_HEADERS}

        // TODO: monkey patching settings doesn't work

        // const oldProxy = settings.proxy;
        // settings.proxy = 'http://test-proxy';
        let agent
        try {
          agent = new HTTPAgent({proxy: true})
        } finally {
        //   settings.proxy = oldProxy
        }
        // // expect(agent._proxyURL).to.equal('http://test-proxy')

        agent._proxyURL = 'http://test-proxy'
        agent._fetch = async (url, options) => {
          expect(url).to.equal('http://test-proxy/proxy?url=/test/')
          return fakeResponse
        }
        await agent._req('/test/', 'GET', null)
      }
    )
  })

  describe('#get', () => {
    it('should be able to perform a GET request', async () => {
      const fakeResponse = {
        status: 200, responseText: 'TEST',
        headers: DUMMY_HTML_HEADERS}

      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('GET')
        return fakeResponse
      }
      const response = await agent.get('/test/')
      expect(response).to.deep.equal(fakeResponse)
    })
  })

  describe('#delete', () => {
    it('should be able to perform a DELETE request', async () => {
      const fakeResponse = {
        status: 200, responseText: 'TEST',
        headers: DUMMY_HTML_HEADERS}

      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('DELETE')
        return fakeResponse
      }
      const response = await agent.delete('/test/')
      expect(response).to.deep.equal(fakeResponse)
    })
  })

  describe('#put', () => {
    it('should be able to perform a PUT request', async () => {
      const fakeResponse = {
        status: 200, responseText: 'TEST',
        headers: DUMMY_HTML_HEADERS}

      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('PUT')
        return fakeResponse
      }
      const response = await agent.put('/test/')
      expect(response).to.deep.equal(fakeResponse)
    })
  })

  describe('#post', () => {
    it('should be able to perform a POST request', async () => {
      const fakeResponse = {
        status: 200, responseText: 'TEST',
        headers: DUMMY_HTML_HEADERS}

      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('POST')
        return fakeResponse
      }
      const response = await agent.post('/test/')
      expect(response).to.deep.equal(fakeResponse)
    })
  })

  describe('#head', () => {
    it('should be able to perform a HEAD request', async () => {
      const fakeResponse = {
        status: 200, responseText: 'TEST',
        headers: DUMMY_HTML_HEADERS}

      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('HEAD')
        return fakeResponse
      }
      const response = await agent.head('/test/')
      expect(response).to.deep.equal(fakeResponse)
    })
  })

  describe('#patch', () => {
    it('should be able to perform a PATCH request', async () => {
      const fakeResponse = {
        status: 200, responseText: 'TEST',
        headers: DUMMY_HTML_HEADERS}

      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('PATCH')
        expect(options.body).to.equal(
          'DELETE DATA { "remSubject" "remPredicate" "remObject"  };\n' +
          'INSERT DATA { "insSubject" "insPredicate" "insObject"  };\n')
        expect(options.headers['Content-Type'])
              .to.equal('application/sparql-update')
        return fakeResponse
      }

      const toRemove = new Writer()
      toRemove.add('remSubject', 'remPredicate', 'remObject')
      const toInsert = new Writer()
      toInsert.add('insSubject', 'insPredicate', 'insObject')

      const response = await agent.patch('/test/', toRemove.all(),
                                         toInsert.all())
      expect(response).to.deep.equal(fakeResponse)
    })
  })
})
