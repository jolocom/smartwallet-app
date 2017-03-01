import {PRED} from '../namespaces'
import LDPAgent from './ldp'
import {Writer} from '../rdf'
import $rdf from 'rdflib'

export default class ContactList {
  constructor() {
    this.ldpAgent = new LDPAgent()
  }

  addContact(initiator, contactWebId, contactName) {
    if (!initiator || !contactWebId || !contactName) {
      throw new Error('Not enough arguments')
    }

    const uri = `${initiator}/little-sister/contactList`
    const toAdd = new Writer()
    // @TODO initiator and contactWebId should both be
    // rdf.sym()
    toAdd.add($rdf.st(initiator, PRED.knows, contactWebId))
    toAdd.add($rdf.st(contactWebId, PRED.givenName, contactName))

    return this.patch(this._proxify(uri), [], toAdd.all())
      .catch(() => {
        throw new Error('Error applying patch')
      })
  }

  patch(uri, toDel, toAdd) {
    return this.ldpAgent.patch(uri, toDel, toAdd)
  }

  _proxify(uri) {
    return this.ldpAgent._proxify(uri)
  }
}
