// local rdf namespace mappings
import rdf from 'rdflib'
const cert = 'http://www.w3.org/ns/auth/cert#'

let SCHEMA = rdf.Namespace('https://schema.org/')
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let TERMS = rdf.Namespace('http://www.w3.org/ns/solid/terms#')
let NIC = rdf.Namespace('http://www.w3.org/ns/pim/space#')

let DC = rdf.Namespace('http://purl.org/dc/terms/')
let RDF = rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#')
let SIOC = rdf.Namespace('http://rdfs.org/sioc/ns#')

export const PRED = {
  givenName: FOAF('givenName'), 
  familyName: FOAF('familyName'), 
  fullName: FOAF('name'),
  image: FOAF('img'),
  email: FOAF('mbox'),
  inbox: TERMS('inbox'),
  storage: NIC('storage'),
  knows: FOAF('knows'),
  isRelatedTo: SCHEMA('isRelatedTo'),
  
  title: DC('title'),
  description: DC('description'),
  type: RDF('type'),
  
  maker: FOAF('maker'),
  primaryTopic: FOAF('primaryTopic'),
  hasOwner: SIOC('hasOwner'),
  hasSubscriber: SIOC('hasSubscriber'),
  spaceOf: SIOC('spaceOf'),
  post: SIOC('Post'),
  hasCreator: SIOC('hasCreator'),
  content: SIOC('content'),
  created: DC('created'),
  hasContainer: SIOC('hasContainer'),
  containerOf: SIOC('containerOf'),
  
  isRelatedTo: SCHEMA('isRelatedTo'),
  Document: FOAF('Document'),
  Image: FOAF('Image'),
  Agent: FOAF('Agent'),
  Thread: SIOC('Thread'),
  
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
