import { IdentitySummary, IssuerPublicProfileSummary } from './types'
import { Identity } from 'jolocom-lib/js/identity/identity'

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
