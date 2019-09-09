import { DecoratedClaims } from 'src/reducers/account'
import { compose, includes, or, equals, complement } from 'ramda'

const DOC_TYPES = [
  'IdCard',
  'Passport',
  'DrivingLicense',
  'Certificate',
  'EventTicket',
  'Proof Of Driving License Credential',
]

const isIncludedIn = <T>(list: T[]) => (element: T) => includes(element, list)

/** @TODO Housekeeping - We should compare against DOC_TYPES using the `type`
 *    of a credential instead of the `credentialType` (which is formatted for render)
 */
const isDocument = ({ credentialType, renderInfo = {} }: DecoratedClaims) =>
  compose(
    // @ts-ignore
    or(equals(renderInfo.renderAs, 'document')),
    isIncludedIn(DOC_TYPES),
  )(credentialType)

export const getDocumentClaims = (claims: DecoratedClaims[]) =>
  claims.filter(isDocument)
export const getNonDocumentClaims = (claims: DecoratedClaims[]) =>
  claims.filter(complement(isDocument))
