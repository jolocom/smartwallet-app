import { DecoratedClaims } from 'src/reducers/account'
import { complement, compose, equals, includes, or } from 'ramda'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

const DOC_TYPES = [
  'IdCard',
  'Passport',
  'DrivingLicense',
  'Certificate',
  'EventTicket',
  'Proof Of Driving License Credential',
]

const isIncludedIn = <T>(list: T[]) => (element: T) => includes(element, list)

const isDocument = ({ credentialType, renderInfo = {} }: DecoratedClaims) =>
  compose(
    or(equals(renderInfo.renderAs, CredentialRenderTypes.document)),
    isIncludedIn(DOC_TYPES),
  )(credentialType)

export const getDocumentClaims = (claims: DecoratedClaims[]) =>
  claims.filter(isDocument)
export const getNonDocumentClaims = (claims: DecoratedClaims[]) =>
  claims.filter(complement(isDocument))
