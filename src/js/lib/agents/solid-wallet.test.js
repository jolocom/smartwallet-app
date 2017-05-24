/* global describe: true, it: true */
import {expect} from 'chai'
import {Parser} from 'lib/rdf'
import {PRED} from 'lib/namespaces'
import SolidAgent from 'lib/agents/solid-wallet'

describe.only('solidAgentAgent', () => {
  const WEBID = 'https://test.com/profile/card'
  const EMAIL = 'test@mock.com'

  describe('#getUserInformation', () => {
    const emptyUserProfile = {
      webId: '',
      username: {
        value: '',
        verified: false
      },
      contact: {
        phone: [],
        email: []
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

    it('Should correctly process invalid argument', async() => {
      const solidAgent = new SolidAgent()
      return solidAgent.getUserInformation().then(res => {
        expect(res).to.deep.equal(emptyUserProfile)
      })
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
          n0:name "Test";

          n0:mbox <#email123>;
          n0:mbox <#email456>;
          n0:phone <#phone123>.

        <#email123>
          schem:identifier "123";
          rd:seeAlso <https://test.com/profile/email123>.

        <#email456>
          schem:identifier "456";
          rd:seeAlso <https://test.com/profile/email456>.

        <#phone123>
          schem:identifier "123";
          rd:seeAlso <https://test.com/profile/phone123>.`

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
            verified: false,
            id: '123'
          }],
          email: [{
            address: 'test@jolocom.com',
            verified: false,
            id: '123'
          },
          {
            address: 'test2@jolocom.com',
            verified: false,
            id: '456'
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
        it('Should attempt to patch the correct file', (done) => {
          expect(url).to.equal(WEBID)
          done()
        })

        it('Should not attempt to delete anything', (done) => {
          expect(toDelete).to.deep.equal([])
          done()
        })

        it('Should append three tripples', done => {
          expect(toInsert.length).to.equal(3)
          done()
        })

        it('Should contain the correct add query', (done) => {
          expect(toInsert[0].subject.value)
            .to.equal('https://test.com/profile/card')
          expect(toInsert[0].predicate)
            .to.deep.equal(PRED.mobile)
          expect(toInsert[0].object.value)
            .to.equal('https://test.com/profile/card#phone123')

          expect(toInsert[1].subject.value)
            .to.equal('https://test.com/profile/card#phone123')
          expect(toInsert[1].predicate)
            .to.deep.equal(PRED.identifier)
          expect(toInsert[1].object.value)
            .to.equal('123')

          expect(toInsert[2].subject.value)
            .to.equal('https://test.com/profile/card#phone123')
          expect(toInsert[2].predicate)
            .to.deep.equal(PRED.seeAlso)
          expect(toInsert[2].object.value)
            .to.equal('https://test.com/profile/phone123')
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
        it('Should patch the correct file', (done) => {
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

        it('Should patch with the correct email triples', (done) => {
          expect(toInsert[0].subject.value).to.equal(WEBID)
          expect(toInsert[0].predicate).to.deep.equal(PRED.email)
          expect(toInsert[0].object.value)
            .to.equal('https://test.com/profile/card#email123')

          expect(toInsert[1].subject.value)
            .to.equal('https://test.com/profile/card#email123')
          expect(toInsert[1].predicate).to.deep.equal(PRED.identifier)
          expect(toInsert[1].object.value)
            .to.equal('123')

          expect(toInsert[2].subject.value)
            .to.equal('https://test.com/profile/card#email123')
          expect(toInsert[2].predicate).to.deep.equal(PRED.seeAlso)
          expect(toInsert[2].object.value)
            .to.equal('https://test.com/profile/email123')
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
  })

  describe('#deleteEntry', () => {
    const entryUrl = 'https://test.com/profile/email123'
    const entryAclUrl = 'https://test.com/profile/email123.acl'
    const deleteArgumentsMap = {
      [entryUrl]: {
        name: 'entry file',
        wasDeleted: false
      },
      [entryAclUrl]: {
        name: 'acl file',
        wasDeleted: false
      }
    }
    const mockHttpAgent = {
      delete: async (url) => {
        const {name} = deleteArgumentsMap[url]
        it(`Should put the ${name} to correct url`, (done) => {
          expect(deleteArgumentsMap[url]).to.not.be.undefined
          done()
        })
        deleteArgumentsMap[url].wasDeleted = true
        return
      },
      patch: async (url, toDelete, toInsert) => {
        it('Should patch the correct file', (done) => {
          expect(url).to.equal(WEBID)
          done()
        })
        it('Should not attempt to insert anything', (done) => {
          expect(toInsert).to.deep.equal(undefined)
          done()
        })
      }
    }
    const solidAgent = new SolidAgent()
    solidAgent.http = mockHttpAgent
    solidAgent.deleteEntry(WEBID, 'email', '123')

    const entryDelete = deleteArgumentsMap[entryUrl].wasDeleted
    const entryAclDelete = deleteArgumentsMap[entryAclUrl].wasDeleted

    it('Should delete both the entry file, and it\'s acl ', () => {
      expect(entryDelete && entryAclDelete).to.be.true
    })
  })
  describe('#updateEntry', () => {
    const entryUrl = 'https://test.com/profile/email123'
    const putArgumentsMap = {
      [entryUrl]: {
        name: 'entry file',
        wasPut: false
      }
    }
    const mockHttpAgent = {
      put: async (url) => {
        const {name} = putArgumentsMap[url]
        it(`Should put the ${name} to correct url`, (done) => {
          expect(putArgumentsMap[url]).to.not.be.undefined
          done()
        })
      }
    }
    const solidAgent = new SolidAgent()
    solidAgent.http = mockHttpAgent
    solidAgent.updateEntry(WEBID, 'email', '123', EMAIL)
  })
})
