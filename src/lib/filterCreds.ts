import { buildTransform, Filter, Ordering } from './filter'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { complement } from 'ramda'

const expiredFilter: Filter<SignedCredential> = cred =>
  cred.expires.valueOf() < new Date().valueOf()

const validFilter: Filter<SignedCredential> = complement(expiredFilter)

const issuerFilter = (issuerDid: string): Filter<SignedCredential> => cred =>
  cred.issuer === issuerDid

const typeFilter = (typ: string): Filter<SignedCredential> => cred =>
  cred.type.includes(typ)

const mostRecentOrder: Ordering<SignedCredential> = (c1, c2) =>
  c2.issued.valueOf() - c1.issued.valueOf()

/**
 * @dev Some basic predefined filters, if required they can be removed
 * and the filtering / ordering construction functions can be exposed instead
 */

export const filters = {
  filterByExpired: buildTransform([expiredFilter]),
  filterByValid: buildTransform([validFilter]),
  filterByIssuer: (did: string) => buildTransform([issuerFilter(did)]),
  filterByType: (typ: string) => buildTransform([typeFilter(typ)]),
  orderByRecent: buildTransform([mostRecentOrder]),
  documentFilter: (documentTypes: string[]) =>
    buildTransform(documentTypes.map(typeFilter)),
}
