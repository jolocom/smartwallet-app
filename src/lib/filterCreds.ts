
import { Transformation, Ordering, Filter } from './filter.d'
import { transform, filterToTransformation, orderingToTransformation } from './filter'

import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

const filterCreds = (creds: SignedCredential[], filters: Transformation<SignedCredential>[]): SignedCredential[] =>
    transform<SignedCredential>(creds, filters);

const expiredFilter: Filter<SignedCredential> = (cred: SignedCredential) =>
    cred.expires.valueOf() >= new Date().valueOf()

const issuerFilter: (did: string) => Filter<SignedCredential> = (issuerDid: string) =>
    (cred: SignedCredential) =>
    cred.issuer === issuerDid

const typeFilter: (typ: string) => Filter<SignedCredential> = (typ: string) =>
    (cred: SignedCredential) =>
    cred.type.includes(typ)

const mostRecentOrder: Ordering<SignedCredential> = (c1: SignedCredential, c2: SignedCredential) =>
    c1.issued.valueOf() - c2.issued.valueOf()

// These are some basic filters, if required they can be removed and the filtering/ordering construction functions can be exposed instead
export const filters = { filterExpired: (creds: SignedCredential[]) => filterCreds(creds, [filterToTransformation(expiredFilter)]),
                         filterByIssuer: (did: string) => (creds: SignedCredential[]) => filterCreds(creds, [filterToTransformation(issuerFilter(did))]),
                         filterByType: (typ: string) => (creds: SignedCredential[]) => filterCreds(creds, [filterToTransformation(typeFilter(typ))]),
                         orderByRecent: (creds: SignedCredential[]) => filterCreds(creds, [orderingToTransformation(mostRecentOrder)]) }
