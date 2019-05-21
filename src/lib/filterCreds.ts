import { Ordering, Filter } from './filter.d'
import { buildTransform } from './filter'

import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

const expiredFilter: Filter<SignedCredential> = (cred: SignedCredential) =>
  cred.expires.valueOf() >= new Date().valueOf()

const issuerFilter: (did: string) => Filter<SignedCredential> = (
  issuerDid: string,
) => (cred: SignedCredential) => cred.issuer === issuerDid

const typeFilter: (typ: string) => Filter<SignedCredential> = (typ: string) => (
  cred: SignedCredential,
) => cred.type.includes(typ)

const mostRecentOrder: Ordering<SignedCredential> = (
  c1: SignedCredential,
  c2: SignedCredential,
) => c1.issued.valueOf() - c2.issued.valueOf()

// These are some basic filters, if required they can be removed and the filtering/ordering construction functions can be exposed instead
export const filters = {
  filterByExpired: buildTransform<SignedCredential>([expiredFilter]),
  filterByIssuer: (did: string) =>
    buildTransform<SignedCredential>([issuerFilter(did)]),
  filterByType: (typ: string) =>
    buildTransform<SignedCredential>([typeFilter(typ)]),
  orderByRecent: buildTransform<SignedCredential>([mostRecentOrder]),
}
