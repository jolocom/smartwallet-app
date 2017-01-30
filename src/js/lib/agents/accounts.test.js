/* global describe: true, it: true */
var assert = require('chai').assert
var expect = require('chai').expect
import * as sinon from 'sinon';
import AccountsAgent from './accounts'

describe('AccountsAgent', function() {
  describe('#register', function() {
    it('should be able to register an account', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(options.method).to.equal('POST')
            expect(options.body).to.equal('username=user&password=pass&email=email&name=name')
            expect(url).to.equal('/register')
            return {
                status: 200, json: () => ({foo: 5}),
                headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}
            }
        }
        const result = await agent.register('user', 'pass', 'email', 'name')
        expect(result).to.deep.equal({foo: 5})
    })
  })
  
  describe('#updateEmail', function() {
    it('should be able to update email', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(url).to.equal('http://my-test-id')
            expect(options.method).to.equal('PATCH')
            expect(options.body).to.equal(
                'INSERT DATA { <http://my-test-id> <http://xmlns.com/foaf/0.1/mbox> <mailto:test@test.com>  };\n')
            expect(options.headers['Content-Type']).to.equal('application/sparql-update')
            
            return ({status: 200, responseText: 'TEST',
                     headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}})
        }
        const result = await agent.updateEmail('http://my-test-id', 'test@test.com')
    })
  })
  
  describe('#checkLogin', function() {
    it('should be able to check if the user is (still) logged in', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(url).to.equal('http://my-test-id')
            expect(options.method).to.equal('PATCH')
            expect(options.body).to.equal('')
            expect(options.headers['Content-Type']).to.equal('application/sparql-update')
            
            return ({status: 200, responseText: 'TEST',
                     headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}})
        }
        const result = await agent.checkLogin('http://my-test-id')
    })
  })
  
  describe('#login', function() {
    it('should be able to log in a user', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(options.method).to.equal('POST')
            expect(options.body).to.equal('username=user&password=pass')
            expect(url).to.equal('/login')
            expect(options.headers['Content-Type']).to.equal('application/x-www-form-urlencoded; charset=UTF-8')
            return {
                status: 200, json: () => ({foo: 5}),
                headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}
            }
        }
        const result = await agent.login('user', 'pass')
        expect(result).to.deep.equal({foo: 5})
    })

    it('should correctly handle login failures', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(options.method).to.equal('POST')
            expect(options.body).to.equal('username=user&password=pass')
            expect(url).to.equal('/login')
            expect(options.headers['Content-Type']).to.equal('application/x-www-form-urlencoded; charset=UTF-8')
            return ({status: 403, statusText: 'Nope',
                     headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}})
        }
        await expect(agent.login('user', 'pass')).to.be.rejectedWith(Error, 'Nope')
    })
  })

  describe('#logout', function() {
    it('should be able to log out a user', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(options.method).to.equal('POST')
            expect(options.body).to.be.null
            expect(url).to.equal('/logout')
            expect(options.headers['Content-Type']).to.equal('application/x-www-form-urlencoded; charset=UTF-8')
            return {
                status: 200, json: () => ({foo: 5}),
                headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}
            }
        }
        const result = await agent.logout()
        expect(result).to.deep.equal({foo: 5})
    })
  })

  describe('#verifyEmail', function() {
    it('should be able verify an e-mail address', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(url).to.equal('/verifyemail')
            expect(options.method).to.equal('POST')
            expect(options.body).to.equal('username=http%3A%2F%2Fmy-test-id&code=verysecret')
            expect(options.headers['Content-Type']).to.equal('application/x-www-form-urlencoded; charset=UTF-8')
            
            return {
                status: 200, json: () => ({email: 'yougot@mail.com'}),
                headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}
            }
        }
        const result = await agent.verifyEmail('http://my-test-id', 'verysecret') // Is this it's normal usage
        expect(result.email).to.equal('yougot@mail.com')
    })

    it('should correctly handle verification failures', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(url).to.equal('/verifyemail')
            expect(options.method).to.equal('POST')
            expect(options.body).to.equal('username=http%3A%2F%2Fmy-test-id&code=verysecret')
            expect(options.headers['Content-Type']).to.equal('application/x-www-form-urlencoded; charset=UTF-8')
            return ({status: 403, statusText: 'Nope',
                     headers: {get: (field) => ({'Content-Type': 'text/html'})[field]}})
        }
        await expect(agent.verifyEmail('http://my-test-id', 'verysecret')).to.be.rejectedWith(Error, 'Nope')
    })
  })

  describe('#initInbox', function() {
    it('should correctly initialize the inbox', async function() {
        const inboxFetch = async (url, options) => {
            expect(options.method).to.equal('PUT')
            expect(options.body).to.equal(
                '@prefix n0: <http://xmlns.com/foaf/0.1/>.\n' +
                '@prefix n: <http://rdfs.org/sioc/ns#>.\n\n   ' +
                '"" n0:maker "http://myid/profile/card#me"; n0:primaryTopic <#inbox> .\n' +
                '   "#inbox" a n:space .\n')
            expect(options.headers['Content-Type']).to.equal('text/turtle')
            return {status: 200, json: () => ({foo: 5}),
                    headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}}
        }
        const inboxACLFetch = async (url, options) => {
            expect(options.method).to.equal('PUT')

            // TODO: Very ugly, discuss better way too test ACL writing
            expect(options.body).to.equal('@prefix n0: <http://www.w3.org/ns/auth/acl#>.\n@prefix lit: <http://myid/little-sister/>.\n@prefix c: <http://myid/profile/card#>.\n@prefix n1: <http://xmlns.com/foaf/0.1/>.\n\n<#owner>\n    a    n0:Authorization;\n    n0:accessTo\n       <http://myid/little-sister/inbox.acl>, lit:inbox;\n    n0:agent\n       c:me;\n    n0:mode\n       n0:Control, n0:Read, n0:Write.\n<#append>\n    a    n0:Authorization;\n    n0:accessTo\n       lit:inbox;\n    n0:agentClass\n       n1:Agent;\n    n0:mode\n       n0:Append.\n')
            expect(options.headers['Content-Type']).to.equal('text/turtle')
            return {status: 200, json: () => ({foo: 5}),
                    headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}}
        }
        const unreadFetch = async (url, options) => {
            expect(options.method).to.equal('PUT')
            expect(options.headers['Content-Type']).to.equal('text/turtle')
            expect(options.body).to.equal(
                '@prefix n0: <http://xmlns.com/foaf/0.1/>.\n' +
                '@prefix n: <http://rdfs.org/sioc/ns#>.\n\n' +
                '   "" n0:maker "http://myid/profile/card#me"; n0:primaryTopic <#unread-messages> .\n' +
                '   "#unread-messages" a n:space .\n')
            return {status: 200, json: () => ({foo: 5}),
                    headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}}
        }
        const unreadACLFetch = async (url, options) => {
            expect(options.method).to.equal('PUT')
            expect(options.headers['Content-Type']).to.equal('text/turtle')
            return {status: 200, json: () => ({foo: 5}),
                    headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}}
        }
        const fetches = {
            'http://myid/little-sister/inbox': inboxFetch,
            'http://myid/little-sister/inbox.acl': inboxACLFetch,
            'http://myid/little-sister/unread-messages': unreadFetch,
            'http://myid/little-sister/unread-messages.acl': unreadACLFetch
        };

        const agent = new AccountsAgent
        agent.http._fetch = (url, options) => {
            const fetch = fetches[url]
            fetch.called = true
            return fetch(url, options)
        }
        await agent.initInbox('http://myid/profile/card#me')

        expect(Object.values(fetches).map((fetch => fetch.called))).to.deep.equal([true, true, true, true])
    })
  })
  
  describe('#initIndex', function() {
    it('should correctly create the index for a user', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(url).to.equal('http://myid/little-sister/index/info')
            expect(options.method).to.equal('PUT')
            expect(options.body).to.equal('These files keep track of what was shared with your friends.')
            expect(options.headers['Content-Type']).to.equal('text/turtle')
            return {status: 200, json: () => ({foo: 5}),
                    headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}}
        }
        const result = await agent.initIndex('http://myid/profile/card#me')
    })
  })
  
  describe('#initDisclaimer', function() {
    it('should correctly initialize the disclaimer for a user', async function() {
        const agent = new AccountsAgent
        agent.http._fetch = async (url, options) => {
            expect(url).to.equal('http://myid/little-sister/disclaimer')
            expect(options.method).to.equal('PUT')
            expect(options.body).to.equal('Files in this folder are needed for features of the Little-Sister app.')
            expect(options.headers['Content-Type']).to.equal('text/turtle')
            return {status: 200, json: () => ({foo: 5}),
                    headers: {get: (field) => ({'Content-Type': 'application/json'})[field]}}
        }
        const result = await agent.initDisclaimer('http://myid/profile/card#me')
    })
  })
})
