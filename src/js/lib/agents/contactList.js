import {PRED} from '../namespaces'
import LDPAgent from './ldp'
import Util from '../util'
import rdf from 'rdflib'

class ContactList extends LDPAgent {

  addContact(initiator, contactWebID, contactName) {
    console.log('Attempting to add contact: ', contactWebID)

    let contactList = `${Util.uriToProxied(initiator)},
    /little-sister/contactList`

    return fetch((contactList), {
      method: 'PATCH',
      credentials: 'include',
      body: `INSERT DATA {${rdf.st(initiator, PRED.knows, contactWebID)}+ " ."+
      ${rdf.st(contactWebID, PRED.givenName, contactName)}+" ."}`,
      headers: {
        'Content-Type': 'application/sparql-update'
      }
    }).then(() => {
      console.log('Patch Success! Appended contact to list!')
    }).catch((err) => {
      console.error('ERROR APPLYING PATCH! ', err)
    })
  }
}
