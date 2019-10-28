import { PublicProfileClaimMetadata } from 'cred-types-jolocom-core/types'

/* Simply using all claims required by the public profile */
export type IssuerPublicProfileSummary = PublicProfileClaimMetadata['claimInterface']

/* An identity summary is composed of a DID + all public info (currently public profile) */
export interface IdentitySummary {
  did: string
  publicProfile?: IssuerPublicProfileSummary
}
