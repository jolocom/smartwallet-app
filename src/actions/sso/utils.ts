import { IdentitySummary, IssuerPublicProfileSummary } from './types'
import { Identity } from 'jolocom-lib/js/identity/identity'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import {
  all,
  compose,
  either,
  filter,
  includes,
  isEmpty,
  isNil,
  map,
} from 'ramda'
import { CredentialOfferResponseSelection } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { CredentialMetadataSummary } from '../../lib/storage/storage'

/**
 * Given an identity, returns an object satisfying the {@link IdentitySummary} interface.
 * @dev Currently used with the {@link IssuerCard} component
 * @note In case the identity does not contain a Public Profile credential,
 * the function will return a minimal default which can be rendered.
 * @param identity - Instance of identity to generate the summary for
 */

export const generateIdentitySummary = (
  identity: Identity,
): IdentitySummary => {
  const { publicProfile, did } = identity
  if (!publicProfile) {
    return {
      did,
    }
  }
  const { id, ...parsedProfile } = publicProfile.claim
  return {
    did,
    publicProfile: parsedProfile as IssuerPublicProfileSummary,
  }
}

export const areRequirementsEmpty = (
  interactionToken: CredentialOfferRequest,
) =>
  compose(
    all(either(isNil, isEmpty)),
    map(interactionToken.getRequestedInputForType.bind(interactionToken)),
  )(interactionToken.offeredTypes)

export const assembleCredentialDetails = (
  interactionToken: CredentialOfferRequest,
  issuerDid: string,
  selectedCredentialTypes: CredentialOfferResponseSelection[],
): CredentialMetadataSummary[] => {
  const { offeredTypes } = interactionToken

  return compose(
    map((type: string) => ({
      issuer: {
        did: issuerDid,
      },
      type,
      renderInfo: interactionToken.getRenderInfoForType(type) || {},
      metadata: interactionToken.getMetadataForType(type) || {},
    })),
    // @ts-ignore
    filter(selected => includes(selected, offeredTypes)),
    map((selected: CredentialOfferResponseSelection) => selected.type),
  )(selectedCredentialTypes)
}
