/* global describe: true, it: true */
import {expect} from 'chai'
import {PRED} from 'lib/namespaces'
import SolidWalletAgent from 'lib/agents/solid-wallet'

describe.only('SolidWalletAgent', () => {
  const WEBID = 'https://test.com/profile/card'
  const EMAIL = 'test@mock.com'

  describe('#setPhone', () => {
    const phoneEntryBody = `\
@prefix : <#>.
@prefix pro: <./>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.\n
pro:phone123 n0:phone "test@mock.com"; n0:primaryTopic pro:card.\n\n`

    const phoneEntryAclBody = `\
@prefix : <#>.
@prefix pho: <phone123.acl#>.
@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix pro: <./>.

pho:owner
    a n0:Authorization;
    n0:accessTo pro:phone123;
    n0:agent pro:card;
    n0:mode n0:Control, n0:Read, n0:Write.
`

    const phoneEntryUrl = 'https://test.com/profile/phone123'
    const phoneEntryAclUrl = 'https://test.com/profile/phone123.acl'

    const putArgumentsMap = {
      [phoneEntryUrl]: {
        expectedBody: phoneEntryBody,
        name: 'entry',
        wasPut: false
      },
      [phoneEntryAclUrl]: {
        expectedBody: phoneEntryAclBody,
        name: 'acl file',
        wasPut: false
      }
    }

    const SolidWallet = new SolidWalletAgent()
    SolidWallet._genRandomAttrId = () => { return '123' }

    const mockHttpAgent = {
      patch: async (url, toDelete, toInsert) => {
        it('Should patch the profile file correctly', (done) => {
          expect(url).to.equal(WEBID)
          done()
        })

        it('Should not attempt to delete anything', (done) => {
          expect(toDelete).to.deep.equal([])
          done()
        })

        it('Should patch the card with three phone triples', (done) => {
          expect(toInsert.length).to.deep.equal(3)
          done()
        })

        it('should add a bNode as an phone to the card', (done) => {
          expect(toInsert[0].object.termType).to.equal('BlankNode')
          expect(toInsert[0].predicate).to.deep.equal(PRED.mobile)
          expect(toInsert[0].subject.value).to.equal(WEBID)
          done()
        })

        it('should assign correct bNode identifier', (done) => {
          expect(toInsert[1].object.value).to.equal('123')
          expect(toInsert[1].predicate).to.deep.equal(PRED.identifier)
          expect(toInsert[1].subject.id).to.equal(0)
          done()
        })

        it('should identify the seeAlso URI for the Blank Node', (done) => {
          expect(toInsert[2].object.value)
          .to.equal(phoneEntryUrl)
          expect(toInsert[2].predicate).to.deep.equal(PRED.seeAlso)
          expect(toInsert[2].subject.id).to.deep.equal(0)
          done()
        })
        return
      },

      put: async (url, body) => {
        const {name, expectedBody} = putArgumentsMap[url]
        it(`Should put the entry ${name} to correct url`, (done) => {
          expect(expectedBody).to.not.be.undefined
          done()
        })

        it(`Should put the correct ${name} file`, (done) => {
          expect(body).to.equal(expectedBody)
          done()
        })

        putArgumentsMap[url].wasPut = true
        return
      }
    }

    SolidWallet.http = mockHttpAgent
    SolidWallet.setPhone(WEBID, EMAIL)

    const entryPut = putArgumentsMap[phoneEntryUrl].wasPut
    const entryAclPut = putArgumentsMap[phoneEntryAclUrl].wasPut

    it('Should put both the phone entry file, and it\'s acl ', () => {
      expect(entryPut && entryAclPut).to.be.true
    })
  })

  describe('#setEmail', () => {
/* MOCK FILES DEFINED HERE */
    const emailEntryUrl = 'https://test.com/profile/email123'
    const emailEntryAclUrl = 'https://test.com/profile/email123.acl'
    const emailEntryBody = `\
@prefix : <#>.
@prefix pro: <./>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.

pro:email123 n0:mbox "test@mock.com"; n0:primaryTopic pro:card.\n\n`

    const emailEntryAclBody = `\
@prefix : <#>.
@prefix em: <email123.acl#>.
@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix pro: <./>.

em:owner
    a n0:Authorization;
    n0:accessTo pro:email123;
    n0:agent pro:card;
    n0:mode n0:Control, n0:Read, n0:Write.\n`
/* END OF MOCK FILE DEFINITION */

    const putArgumentsMap = {
      [emailEntryUrl]: {
        name: 'entry file',
        expectedBody: emailEntryBody,
        wasPut: false
      },
      [emailEntryAclUrl]: {
        name: 'acl file',
        expectedBody: emailEntryAclBody,
        wasPut: false
      }
    }

    const SolidWallet = new SolidWalletAgent()
    SolidWallet._genRandomAttrId = () => { return '123' }
    const mockHttpAgent = {
      patch: async (url, toDelete, toInsert) => {
        it('Should patch the profile file correctly', (done) => {
          expect(url).to.equal(WEBID)
          done()
        })

        it('Should not attempt to delete anything', (done) => {
          expect(toDelete).to.deep.equal([])
          done()
        })

        it('Should patch the card with three email triples', (done) => {
          expect(toInsert.length).to.deep.equal(3)
          done()
        })

        it('should add a bNode as an email to the card', (done) => {
          expect(toInsert[0].object.termType).to.equal('BlankNode')
          expect(toInsert[0].predicate).to.deep.equal(PRED.email)
          expect(toInsert[0].subject.value).to.equal(WEBID)
          done()
        })

        it('should assign correct bNode identifier', (done) => {
          expect(toInsert[1].object.value).to.equal('123')
          expect(toInsert[1].predicate).to.deep.equal(PRED.identifier)
          expect(toInsert[1].subject.id).to.equal(1)
          done()
        })

        it('should identify the seeAlso URI for the Blank Node', (done) => {
          expect(toInsert[2].object.value)
          .to.equal(emailEntryUrl)
          expect(toInsert[2].predicate).to.deep.equal(PRED.seeAlso)
          expect(toInsert[2].subject.id).to.equal(1)
          done()
        })
        return
      },

      put: async (url, body) => {
        const {expectedBody} = putArgumentsMap[url]
        it(`Should put the ${name} to correct url`, (done) => {
          expect(putArgumentsMap[url]).to.not.be.undefined
          done()
        })

        it(`Should put the correct ${name}`, (done) => {
          expect(body).to.equal(expectedBody)
          done()
        })
        putArgumentsMap[url].wasPut = true
        return
      }
    }

    SolidWallet.http = mockHttpAgent
    SolidWallet.setEmail(WEBID, EMAIL)

    const entryPut = putArgumentsMap[emailEntryUrl].wasPut
    const entryAclPut = putArgumentsMap[emailEntryAclUrl].wasPut

    it('Should put both the email entry file, and it\'s acl ', () => {
      expect(entryPut && entryAclPut).to.be.true
    })
  })
})
