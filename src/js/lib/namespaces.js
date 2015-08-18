// local rdf namespace mappings

const foaf  = 'http://xmlns.com/foaf/0.1/'
export const FOAF = {
  name: `${foaf}name`,
  mbox: `${foaf}mbox`,
  img: `${foaf}img`
}

const cert = 'http://www.w3.org/ns/auth/cert#'
export const CERT = {
  key: `${cert}key`,
  exponent: `${cert}exponent`,
  modulus: `${cert}modulus`
}

const dc = 'http://purl.org/dc/terms/'
export const DC = {
  title: `${dc}title`,
  description: `${dc}description`
}

const rdf = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#'
export const RDF = {
  type:`${rdf}type`
}

const sioc = 'http://rdfs.org/sioc/ns#'
export const SIOC = {
  containerOf:`${sioc}container_of`,
  hasContainer: `${sioc}has_container`
}
