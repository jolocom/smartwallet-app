/* global describe: true, it: true */
import {expect} from 'chai'
import {PRED} from 'lib/namespaces'
import SolidWalletAgent from 'lib/agents/solid-wallet'

describe.only('SolidWalletAgent', () => {
  const WEBID = 'https://test.com/profile/card'
  const EMAIL = 'test@mock.com'

  describe('#setEntry', () => {
/* MOCK FILES DEFINED HERE */
    const emailEntryBody = `\
@prefix : <#>.
@prefix pro: <./>.
@prefix n0: <http://xmlns.com/foaf/0.1/>.

pro:email123
n0:mbox "test@mock.com"; n0:primaryTopic "https://test.com/profile/card".
`
    const emailEntryAclBody = `\
@prefix : <#>.
@prefix em: <email123.acl#>.
@prefix n0: <http://www.w3.org/ns/auth/acl#>.
@prefix pro: <./>.

em:owner
    a n0:Authorization;
    n0:accessTo pro:email123;
    n0:agent pro:card;
    n0:mode n0:Control, n0:Read, n0:Write.
`
    const phoneEntryBody = ''
    const phoneEntryAclBody = ''

    const triples = [
      {
        object: {
          id: 0,
          termType: 'BlankNode',
          value: '123'
        },
        predicate: {
          termType: 'NamedNode',
          value: 'http://xmlns.com/foaf/0.1/mbox'
        },
        subject: {
          termType: 'NamedNode',
          value: 'https://test.com/profile/card'
        },
        why: {
          termType: 'NamedNode',
          value: 'chrome:theSession'
        }
      },
      {
        object: {
          termType: 'Literal',
          value: '123'
        },
        predicate: {
          termType: 'NamedNode',
          value: 'https://schema.org/identifier'
        },
        subject: {
          id: 0,
          termType: 'BlankNode',
          value: '123'
        },
        why: {
          termType: 'NamedNode',
          value: 'chrome:theSession'
        }
      },
      {
        object: {
          termType: 'NamedNode',
          value: emailEntryUrl
        },
        predicate: {
          termType: 'NamedNode',
          value: 'http://www.w3.org/2000/01/rdf-schema#seeAlso'
        },
        subject: {
          id: 0,
          termType: 'BlankNode',
          value: '123'
        },
        why: {
          termType: 'NamedNode',
          value: 'chrome:theSession'
        }
      }
    ]

/* END OF MOCK FILE DEFINITION */

    const emailEntryUrl = 'https://test.com/profile/email123'
    const emailEntryAclUrl = 'https://test.com/profile/email123.acl'
    const phoneEntryUrl = 'https://test.com/profile/phone123'
    const phoneEntryAclUrl = 'https://test.com/profile/phone123.acl'

    const putArgumentsMap = {
      [phoneEntryUrl]: phoneEntryBody,
      [emailEntryUrl]: emailEntryBody,
      [emailEntryAclUrl]: emailEntryAclBody,
      [phoneEntryAclUrl]: phoneEntryAclBody
    }

    const SolidWallet = new SolidWalletAgent()
    SolidWallet._genRandomAttrId = () => { return '123' }
    const mockHttpAgent = {
      patch: async (url, toDelete, toInsert) => {
        it('Should patch the correct file', () => {
          expect(url).to.equal(WEBID)
        })
        it('Should not attempt to delete anything', () => {
          expect(toDelete).to.deep.equal([])
        })

        it('Should patch the card with three email triples', () => {
          expect(toInsert.length).to.deep.equal(triples.length)
        })

        it('should add a bNode as an email to the card', () => {
          expect(toInsert[0].object.termType).to.equal('BlankNode')
          expect(toInsert[0].predicate).to.deep.equal(PRED.email)
          expect(toInsert[0].subject.value).to.equal(WEBID)
        })

        it('should assign correct bNode identifier', () => {
          expect(toInsert[1].object.value).to.equal('123')
          expect(toInsert[1].predicate).to.deep.equal(PRED.identifier)
          expect(toInsert[1].subject.id).to.equal(0)
        })

        it('should identify the seeAlso URI for the Blank Node', () => {
          expect(toInsert[2].object.value)
          .to.equal(emailEntryUrl)
          expect(toInsert[2].predicate).to.deep.equal(PRED.seeAlso)
          expect(toInsert[2].subject.id).to.deep.equal(0)
        })
        return
      },

      // Make tests more explicit TODO
      put: async (url, body) => {
        it('Should put the entry file to correct url', () => {
          expect(putArgumentsMap[url]).to.not.be.undefined
        })

        it('Should put the correct entry file', () => {
          expect(body).to.equal(putArgumentsMap[url])
        })

        return
      }
    }

    SolidWallet.http = mockHttpAgent
    return SolidWallet.setEmail(WEBID, EMAIL)
  })
})
