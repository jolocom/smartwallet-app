/* global describe: true, it: true */
import {expect} from 'chai'
import {Parser} from 'lib/rdf'
import {PRED} from 'lib/namespaces'
import SolidAgent from 'lib/agents/solid-wallet'

describe('solidAgentAgent', () => {
  const WEBID = 'https://test.com/profile/card'
  const EMAIL = 'test@mock.com'

  describe.only('#getUserInformation', () => {
    it('Should correctly throw if no arguments are passed', () => {
      const solidAgent = new SolidAgent()
      const msg = 'Invalid arguments'
      expect(() => solidAgent.getUserInformation()).to.throw(msg)
    })

    it('Should correctly fetch and parse user info', async () => {
      const firstPhoneFileResp = `\
        @prefix pro: <./>.
        @prefix n0: <http://xmlns.com/foaf/0.1/>.

        pro:phone123 
          n0:phone "+49 176 12345678";
          n0:primaryTopic pro:card.
      `
      const firstEmailFileResp = `\
        @prefix pro: <./>.
        @prefix n0: <http://xmlns.com/foaf/0.1/>.

        pro:email123 
          n0:mbox "test@jolocom.com";
          n0:primaryTopic pro:card.
        `

      const secondEmailFileResp = `\
        @prefix pro: <./>.
        @prefix n0: <http://xmlns.com/foaf/0.1/>.

        pro:email456 
          n0:mbox "test2@jolocom.com";
          n0:primaryTopic pro:card.
        `

      const userCardResp = `\
        @prefix pro: <./>.
        @prefix n0: <http://xmlns.com/foaf/0.1/>.
        @prefix rd: <http://www.w3.org/2000/01/rdf-schema#>.
        @prefix schem: <https://schema.org/>.
     
        pro:card
          a n0:PersonalProfileDocument;
          n0:primaryTopic <#me>.
        <#me>
          a n0:Person;
          n0:mbox [ rd:seeAlso pro:email123; schem:identifier "123" ];
          n0:mbox [ rd:seeAlso pro:email456; schem:identifier "456" ];
          n0:phone [ rd:seeAlso pro:phone123; schem:identifier "123" ];
          n0:mbox "test3@jolocom.com";
          n0:name "Test".`

      const respMap = {
        [WEBID]: userCardResp,
        'https://test.com/profile/email123': firstEmailFileResp,
        'https://test.com/profile/email456': secondEmailFileResp,
        'https://test.com/profile/phone123': firstPhoneFileResp
      }

      const expectedUserInfo = {
        webId: WEBID,
        username: {
          value: 'Test',
          verified: false
        },
        contact: {
          phone: [{
            number: '+49 176 12345678',
            id: '123'
          }],
          email: [{
            address: 'test@jolocom.com',
            id: '123'
          },
          {
            address: 'test2@jolocom.com',
            id: '456'
          },
          {
            address: 'test3@jolocom.com',
            id: null
          }]
        },
        Reputation: 0,
        passport: {
          number: null,
          givenName: null,
          familyName: null,
          birthDate: null,
          gender: null,
          street: null,
          streetAndNumber: null,
          city: null,
          zip: null,
          state: null,
          country: null
        }
      }

      const solidAgent = new SolidAgent()
      solidAgent.ldp.fetchTriplesAtUri = async (uri) => {
        return (new Parser()).parse(respMap[uri], uri)
      }

      const userInfo = await solidAgent.getUserInformation(WEBID)
      expect(userInfo).to.deep.equal(expectedUserInfo)
    })
  })

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

    const solidAgent = new SolidAgent()
    solidAgent._genRandomAttrId = () => { return '123' }

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
        it(`Should put the ${name} to correct url`, (done) => {
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

    solidAgent.http = mockHttpAgent
    solidAgent.setPhone(WEBID, EMAIL)

    const entryPut = putArgumentsMap[phoneEntryUrl].wasPut
    const entryAclPut = putArgumentsMap[phoneEntryAclUrl].wasPut

    it('Should put both the phone entry file, and it\'s acl ', () => {
      expect(entryPut && entryAclPut).to.be.true
    })

    it('Should throw if no arguments are passed', () => {
      const msg = 'Invalid arguments'
      expect(() => solidAgent.setPhone()).to.throw(msg)
      expect(() => solidAgent.setPhone(WEBID)).to.throw(msg)
      expect(() => solidAgent.setPhone(undefined, WEBID)).to.throw(msg)
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

    const solidAgent = new SolidAgent()
    solidAgent._genRandomAttrId = () => { return '123' }
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
        const {expectedBody, name} = putArgumentsMap[url]
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

    solidAgent.http = mockHttpAgent
    solidAgent.setEmail(WEBID, EMAIL)

    const entryPut = putArgumentsMap[emailEntryUrl].wasPut
    const entryAclPut = putArgumentsMap[emailEntryAclUrl].wasPut

    it('Should put both the email entry file, and it\'s acl ', () => {
      expect(entryPut && entryAclPut).to.be.true
    })

    it('Should throw if no arguments are passed', () => {
      const msg = 'Invalid arguments'
      expect(() => solidAgent.setPhone()).to.throw(msg)
      expect(() => solidAgent.setPhone(WEBID)).to.throw(msg)
      expect(() => solidAgent.setPhone(undefined, WEBID)).to.throw(msg)
    })
  })
})
