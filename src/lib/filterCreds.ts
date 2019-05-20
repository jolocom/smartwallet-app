
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

const mostRecentOrder: Ordering<SignedCredential> = (c1: SignedCredential, c2: SignedCredential) =>
    c1.issued.valueOf() - c2.issued.valueOf()

export const filters = { filterExpired: (creds: SignedCredential[]) => filterCreds(creds, [filterToTransformation(expiredFilter)]),
                         filterByIssuer: (did: string) => (creds: SignedCredential[]) => filterCreds(creds, [filterToTransformation(issuerFilter(did))]),
                         orderByRecent: (creds: SignedCredential[]) => filterCreds(creds, [orderingToTransformation(mostRecentOrder)]) }
