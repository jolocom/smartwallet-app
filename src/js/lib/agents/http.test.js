/* global describe: true, it: true */
var assert = require('chai').assert
var expect = require('chai').expect
import HTTPAgent from './http'

describe('HTTPAgent', function() {
  describe('#_req()', function() {
    it('should be able to do a normal GET request', async function() {
      const fakeResponse = {status: 200, responseText: 'TEST',
                            headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}};
      
      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => fakeResponse
      const response = await agent._req('/test/', 'GET', null, {'X-Header1': 'Test'})
      expect(response).to.deep.equal(fakeResponse);
    })

    it('should be able parse a JSON request', async function() {
      const fakeResponse = {status: 200, json: () => ({foo: 5}),
                            headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}};
      
      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => fakeResponse
      const response = await agent._req('/test/', 'GET', null, {'X-Header1': 'Test'})
      expect(response).to.deep.equal({foo: 5});
    })

    it('should reject promise receiving an error HTTP status code', async () => {
      const fakeResponse = {status: 404, statusText: 'Not found'};
      
      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => fakeResponse
      const request = () => agent._req('/test/', 'GET', null, {'X-Header1': 'Test'})
      await expect(request()).to.be.rejectedWith(Error, 'Not found');
    })
  })

  describe('#get', () => {
    it('should be able to perform a GET request', async () => {
      const fakeResponse = {status: 200, responseText: 'TEST',
                            headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}};
      
      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('GET')
        return fakeResponse
      }
      const response = await agent.get('/test/', {'X-Header1': 'Test'})
      expect(response).to.deep.equal(fakeResponse);
    })
  })
  
  describe('#delete', () => {
    it('should be able to perform a DELETE request', async () => {
      const fakeResponse = {status: 200, responseText: 'TEST',
                            headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}};
      
      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('DELETE')
        return fakeResponse
      }
      const response = await agent.delete('/test/', {'X-Header1': 'Test'})
      expect(response).to.deep.equal(fakeResponse);
    })
  })
  
  describe('#put', () => {
    it('should be able to perform a PUT request', async () => {
      const fakeResponse = {status: 200, responseText: 'TEST',
                            headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}};
      
      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('PUT')
        return fakeResponse
      }
      const response = await agent.put('/test/', {'X-Header1': 'Test'})
      expect(response).to.deep.equal(fakeResponse);
    })
  })
  
  describe('#post', () => {
    it('should be able to perform a POST request', async () => {
      const fakeResponse = {status: 200, responseText: 'TEST',
                            headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}};
      
      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('POST')
        return fakeResponse
      }
      const response = await agent.post('/test/', {'X-Header1': 'Test'})
      expect(response).to.deep.equal(fakeResponse);
    })
  })

  describe('#head', () => {
    it('should be able to perform a HEAD request', async () => {
      const fakeResponse = {status: 200, responseText: 'TEST',
                            headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}};
      
      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('HEAD')
        return fakeResponse
      }
      const response = await agent.head('/test/', {'X-Header1': 'Test'})
      expect(response).to.deep.equal(fakeResponse);
    })
  })

  describe('#patch', () => {
    it('should be able to perform a PATCH request', async () => {
      const fakeResponse = {status: 200, responseText: 'TEST',
                            headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}};
      
      const agent = new HTTPAgent()
      agent._fetch = async (url, options) => {
        expect(url).to.equal('/test/')
        expect(options.method).to.equal('PATCH')
        expect(options.headers['Content-Type']).to.equal('application/sparql-update')
        return fakeResponse
      }
      const response = await agent.patch('/test/', {'X-Header1': 'Test'})
      expect(response).to.deep.equal(fakeResponse);
    })
  })


})
