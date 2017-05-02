/* global describe: true, it: true */
import {expect} from 'chai'
import rdf from 'rdflib'
import SolidWalletAgent from 'lib/agents/solid-wallet'
import {PRED} from 'lib/namespaces.js'

describe('SolidWalletAgent', () => {
  const WEBID = 'https://test.com/profile/card'
  const EMAIL = 'test@mock.com'

  describe('#setEntry', () => {
    let triples = [
      {
        object: {
          id: 1,
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
          id: 1,
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
          value: 'https://test.com/profile/email123'
        },
        predicate: {
          termType: 'NamedNode',
          value: 'http://www.w3.org/2000/01/rdf-schema#seeAlso'
        },
        subject: {
          id: 1,
          termType: 'BlankNode',
          value: '123'
        },
        why: {
          termType: 'NamedNode',
          value: 'chrome:theSession'
        }
      }
    ]
    const newNode = rdf.blankNode('123')
    // TODO, can this backfire?
    newNode.id += 1
    const SolidWallet = new SolidWalletAgent(WEBID)
    const mockHttpAgent = {
      patch: (url, toDelete, toInsert) => {
        return toInsert
      }
    }
    SolidWallet.http = mockHttpAgent
    SolidWallet._genAtrId = () => { return '123' }
    let additions = SolidWallet.setEntry('email', EMAIL)
    it('Should add three new triples for a new email', () => {
      expect(additions.length).to.deep.equal(triples.length)
    })
    it('should add a Blank Node as an email to the card', () => {
      expect(additions[0].object.termType).to.deep
      .equal('BlankNode')
      expect(additions[0].predicate).to.deep
      .equal(PRED.email)
      expect(additions[0].subject.value).to.deep.equal(WEBID)
    })
    it('should identify the Blank Node as a Literal', () => {
      expect(additions[1].object.termType).to.deep
      .equal('Literal')
      expect(additions[1].predicate).to.deep
      .equal(PRED.identifier)
      expect(additions[1].subject.termType).to.deep.equal('BlankNode')
    })
    it('should identify the seeAlso URI for the Blank Node', () => {
      expect(additions[2].object.value).to.deep
      .equal('https://test.com/profile/email123')
      expect(additions[2].predicate).to.deep.equal(PRED.seeAlso)
      expect(additions[2].subject.termType).to.deep.equal('BlankNode')
    })
  })
})
