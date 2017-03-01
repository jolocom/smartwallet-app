/* global describe: true, it: true */
var expect = require('chai').expect
import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'
import ContactListAgent from './contactList'

describe('ContactListAgent', function() {
  describe('#addContact', function () {
    it('Should throw if no arguments are passed', async function() {
      const cAgent = new ContactListAgent()
      expect(() => cAgent.addContact())
        .to.throw('Not enough arguments')
    })

    it('Should correctly add a contact to contact list', async function() {
      const cAgent = new ContactListAgent()
      const initWebId = 'https://init.com/card'
      const contWebId = 'https://contact.com/card'
      const contName = 'Mark Musterman'
      const expectedUri = 'https://proxy.jolocom.de/proxy?url=' +
        initWebId + '/little-sister/contactList'

      cAgent.patch = async(uri, toDel, toAdd) => {
        expect(uri).to.equal(expectedUri)
        expect(toDel).to.deep.equal([])

        expect(toAdd).to.deep.equal([{
          subject: rdf.literal(initWebId),
          predicate: PRED.knows,
          object: rdf.literal(contWebId),
          why: rdf.sym('chrome:theSession')
        }, {
          subject: rdf.literal(contWebId),
          predicate: PRED.givenName,
          object: rdf.literal(contName),
          why: rdf.sym('chrome:theSession')
        }])

        return
      }
      await cAgent.addContact(initWebId, contWebId, contName)
    })
  })
})

