/* global describe: true, it: true */
var expect = require('chai').expect

import ContactListAgent from './contactList'
import {Writer} from '../rdf'
import {PRED} from '../namespaces'

// BASIC BOILER PLATE
describe('ContactListAgent', function() {
  describe('#addContact', function () {
    it('should correctly add a contact to contact list', async function() {
      const CLAgent = new ContactListAgent()
      const writer = new Writer()
      const initiatorWebID = 'A'
      const contactWebID = 'B'
      const contactName = 'C'
      CLAgent.addContact(initiatorWebID, contactWebID, contactName)
      const res = await writer.find('A', PRED.knows, 'B')
      expect(res).to.equal(true)
    })
  })
})
