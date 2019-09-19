import { IssuerPublicProfileSummary } from './types'
import { Identity } from 'jolocom-lib/js/identity/identity'

export const parsePublicProfile = (identity: Identity) => {
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
