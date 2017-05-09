// local rdf namespace mappings
import rdf from 'rdflib'
const cert = 'http://www.w3.org/ns/auth/cert#'

let ACL = rdf.Namespace('http://www.w3.org/ns/auth/acl#')
let DC = rdf.Namespace('http://purl.org/dc/terms/')
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let NIC = rdf.Namespace('http://www.w3.org/ns/pim/space#')
let PURL = rdf.Namespace('http://purl.org/iot/vocab/m3-lite#')
let SCHEMA = rdf.Namespace('https://schema.org/')
let SCHEMA_HTTP = rdf.Namespace('http://schema.org/')
let RDF = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
let SIOC = rdf.Namespace('http://rdfs.org/sioc/ns#')
let TERMS = rdf.Namespace('http://www.w3.org/ns/solid/terms#')
let RD = rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')

export const XSD = rdf.Namespace('http://www.w3.org/2001/XMLSchema#')
export const PRED = {
  givenName: FOAF('givenName'),
  familyName: FOAF('familyName'),
  fullName: FOAF('name'),
  image: FOAF('img'),
  email: FOAF('mbox'),
  socialMedia: FOAF('accountName'),
  mobile: FOAF('phone'),
  address: FOAF('based_near'), // TEMP pred
  profession: FOAF('currentProject'), // TEMP pred
  company: FOAF('workplaceHomepage'), // TEMP pred
  url: FOAF('homepage'), // TEMP pred
  creditCard: FOAF('holdsAccount'), // TEMP pred
  inbox: TERMS('inbox'),
  storage: NIC('storage'),
  knows: FOAF('knows'),
  isRelatedTo: SCHEMA('isRelatedTo'),
  seeAlso: RD('seeAlso'),
  profileDoc: FOAF('PersonalProfileDocument'),
  isRelatedTo_HTTP: SCHEMA_HTTP('isRelatedTo'),
  identifier: SCHEMA('identifier'),
  // --
  title: DC('title'),
  title_DC: DC('title'),
  description: DC('description'),
  type: RDF('type'),
  // --
  maker: FOAF('maker'),
  primaryTopic: FOAF('primaryTopic'),
  hasOwner: SIOC('hasOwner'),
  hasSubscriber: SIOC('hasSubscriber'),
  spaceOf: SIOC('spaceOf'),
  space: SIOC('space'),
  post: SIOC('Post'),
  hasCreator: SIOC('hasCreator'),
  modified: DC('modified'),
  content: SIOC('content'),
  created: DC('created'),

  hasContainer: SIOC('hasContainer'),
  containerOf: SIOC('containerOf'),
  // --
  attachment: SIOC('attachment'),
  Document: FOAF('Document'),
  Image: FOAF('Image'),
  Agent: FOAF('Agent'),
  Person: FOAF('Person'),
  Thread: SIOC('Thread'),
  // --
  passport: PURL('Passport'),
  // ACL RELATED
  auth: ACL('Authorization'),
  access: ACL('accessTo'),
  agent: ACL('agent'),
  agentClass: ACL('agentClass'),
  mode: ACL('mode'),
  control: ACL('Control'),
  read: ACL('Read'),
  write: ACL('Write'),
  // INDEX FILE RELATED
  readPermission: SCHEMA('ReadPermission'),
  writePermission: SCHEMA('WritePermission'),
  owns: SCHEMA('owns')
}

export const CERT = {
  exponent: `${cert}exponent`,
  key: `${cert}key`,
  modulus: `${cert}modulus`
}

const ldp = 'http://www.w3.org/ns/ldp#'
export const LDP = {
  BasicContainer: `${ldp}BasicContainer`
}

const ssn = 'http://purl.oclc.org/NET/ssnx/ssn#'
export const SSN = {
  hasValue: `${ssn}hasValue`,
  observes: `${ssn}observes`,
  Sensor: `${ssn}Sensor`
}

export const SOLID = {
  Notification: TERMS('Notification'),
  read: TERMS('read')
}

/*
in the other files:

import {PRED, NODE_TYPES} from 'namespaces.js'

NODE_TYPES[PRED.PERSON].nodeColor etc

default?
NodeTypes[PRED.Person]
  ? NodeTypes[PRED.Person].nodeColor : STYLES.defaultNodeColor

STYLES.js?

mix of logic (component names, validation, form) and interface (colors)

*/

export const NODE_TYPES = {

}
//
//
//
//
//
//
// NodeTypes.register(FOAF('Person'), {
//  /**
//   * Node color in the graph
//   */
//  nodeColor: '#829abe',
//
//  /**
//   * Node color in the graph
//   */
//  textColor: '#ffffff',
//
//  /**
//   * Optional, icon used in the graph
//   */
//  icon: 'person',
//
//  /**
//   * Optional, value to render, can be a text value or image
//   */
//  titleField: 'name'
//
//  /**
//   *  Full screen react component
//   */
//  component: Person,
//
//  /**
//   * Schema can be used to create the node creation form, validate values
//   * Available validators:
//   * https://github.com/christianalfoni/formsy-react/blob/master/
//   * API.md#validators
//   */
//  schema: {
//    name: {
//      predicate: FOAF('name'),
//      label: 'Name',
//      validations: 'isWords' /* optional, Formsy validation rule */
//    },
//    description: {
//      predicate: DC('description'),
//      label: 'Description'
//    },
//    image: {
//
//    }
//  },
//
//  access: ['public', 'private'],
//
//  defaultAccess: ['public']
// })
