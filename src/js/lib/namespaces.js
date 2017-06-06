// local rdf namespace mappings
import rdf from 'rdflib'
const ACL = rdf.Namespace('http://www.w3.org/ns/auth/acl#')
const DC = rdf.Namespace('http://purl.org/dc/terms/')
const FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
const NIC = rdf.Namespace('http://www.w3.org/ns/pim/space#')
// let PURL = rdf.Namespace('http://purl.org/iot/vocab/m3-lite#')
const SCHEMA = rdf.Namespace('https://schema.org/')
const SCHEMA_HTTP = rdf.Namespace('http://schema.org/')
const RDF = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
const SIOC = rdf.Namespace('http://rdfs.org/sioc/ns#')
const TERMS = rdf.Namespace('http://www.w3.org/ns/solid/terms#')
const RD = rdf.Namespace('http://www.w3.org/2000/01/rdf-schema#')
const DBPEDIA = rdf.Namespace('http://dbpedia.org/page/')
const DBPEDIA_OWL = rdf.Namespace('http://dbpedia.org/ontology/')
const PERSON_CORE = rdf.Namespace('https://www.w3.org/ns/person#')
const VCARD = rdf.Namespace('https://www.w3.org/2006/vcard/ns#')
const VOAG = rdf
  .Namespace('http://voag.linkedmodel.org/2.0/doc/2015/SCHEMA_voag-v2.0#voag_')

export const XSD = rdf.Namespace('http://www.w3.org/2001/XMLSchema#')
export const PRED = {
  givenName: FOAF('givenName'),
  familyName: FOAF('familyName'),
  gender: FOAF('gender'),
  male: VCARD('Male'),
  female: VCARD('Female'),
  birthDate: SCHEMA('birthDate'),
  birthPlace: SCHEMA('birthPlace'),
  countryOfBirth: PERSON_CORE('countryOfBirth'),
  fullName: FOAF('name'),
  image: FOAF('img'),
  email: FOAF('mbox'),
  socialMedia: FOAF('accountName'),
  mobile: FOAF('phone'),
  address: SCHEMA('address'),
  street: VCARD('street-address'),
  zip: VCARD('postal-code'),
  city: DBPEDIA_OWL('city'),
  state: DBPEDIA_OWL('state'),
  country: DBPEDIA_OWL('country'),
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
  expiresBy: SCHEMA('expires'),
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
  passport: DBPEDIA('Passport'),
  idCard: DBPEDIA('Identity_document'),
  //
  ownedBy: VOAG('ownedBy'),
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
