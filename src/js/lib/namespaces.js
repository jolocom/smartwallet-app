// local rdf namespace mappings

import rdflib from 'rdflib'

export const FOAF = rdflib.Namespace('http://xmlns.com/foaf/0.1/')

const cert = 'http://www.w3.org/ns/auth/cert#'
export const CERT = {
  exponent: `${cert}exponent`,
  key: `${cert}key`,
  modulus: `${cert}modulus`
}

const dc = 'http://purl.org/dc/terms/'
export const DC = {
  created: `${dc}created`,
  description: `${dc}description`,
  title: `${dc}title`
}

const ldp = 'http://www.w3.org/ns/ldp#'
export const LDP = {
  BasicContainer: `${ldp}BasicContainer`
}

const rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
export const RDF = {
  type:`${rdf}type`
}

const sioc = 'http://rdfs.org/sioc/ns#'
export const SIOC = {
  Container: `${sioc}Container`,
  Post: `${sioc}Post`,
  Space: `${sioc}Space`,
  Thread: `${sioc}Thread`,
  containerOf:`${sioc}container_of`,
  content: `${sioc}content`,
  hasContainer: `${sioc}has_container`,
  hasCreator: `${sioc}has_creator`,
  hasOwner: `${sioc}has_owner`,
  hasReply: `${sioc}has_reply`,
  hasSpace: `${sioc}has_space`,
  hasSubscriber: `${sioc}has_subscriber`,
  spaceOf: `${sioc}space_of`
}

const ssn = 'http://purl.oclc.org/NET/ssnx/ssn#'
export const SSN = {
  hasValue: `${ssn}hasValue`,
  observes: `${ssn}observes`,
  Sensor: `${ssn}Sensor`
}
