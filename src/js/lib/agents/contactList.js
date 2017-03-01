import {PRED} from '../namespaces'
import HTTPAgent from './http'
import {Writer} from '../rdf'
import $rdf from 'rdflib'

export default class ContactList {

  constructor() {
    this.http = new HTTPAgent({proxy: true})
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
    return this.patch(uri, [], toAdd.all())
  }

  patch(uri, toDel, toAdd) {
    return this.http.patch(uri, toDel, toAdd)
  }
}
