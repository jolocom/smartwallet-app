import {PRED} from '../namespaces'
import LDPAgent from './ldp'
import Util from '../util'
import {Writer} from '../rdf'
import $rdf from 'rdflib'

export default class ContactList extends LDPAgent {

  addContact(initiator, contactWebID, contactName) {
    const uri = `${initiator}/little-sister/contactList`

    const toAdd = new Writer()

    toAdd.add($rdf.st(initiator, PRED.knows, contactWebID))
    toAdd.add($rdf.st(contactWebID, PRED.givenName, contactName))

    return this.patch(this._proxify(uri), null, toAdd.all()).then(() => {
      console.log('Patch Success! Appended contact to list!')
    }).catch((err) => {
      console.error('ERROR APPLYING PATCH! ', err)
    })
  }
}
