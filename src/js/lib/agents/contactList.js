import {PRED} from '../namespaces'
import LDPAgent from './ldp'
import Util from '../util'
import {Parser, Writer} from '../rdf'
import _ from 'lodash'
import rdf from 'rdflib'
import N3 from 'n3'

class ContactList extends LDPAgent {

  addContact(initiator, contactWebID, contactName, contactEmail) {
    console.log('Attempting to add contact: ', contactWebID)

    let contactList = `${Util.uriToProxied(initiator)}/little-sister/contactList`

    let writer = new Writer()

    writer.addTriple(contactWebID, PRED.givenName, contactName)
    writer.addTriple(contactWebID, PRED.email, contactEmail)

    return fetch((contactList), {
      method: 'PATCH',
      credentials: 'include',
      body: writer.end(),
      headers: {
        'Content-Type': 'text/turtle'
      }
    }).then(() => {
      console.log("Patch Success! Appended contact to list!")
    }).catch((err) => {
      console.error("ERROR APPLYING PATCH! ", err)
    })




  }
}
