import { PublicProfileClaimMetadata } from 'cred-types-jolocom-core/types'

/**
 * @dev Simply using all claims required by the public profile
 */

export type IssuerPublicProfileSummary = PublicProfileClaimMetadata['claimInterface']

/**
 * @dev An identity summary is composed of a DID + all public info (currently public profile)
 */

export interface IdentitySummary {
  did: string
  publicProfile?: IssuerPublicProfileSummary
}

export interface RequestSummary {
  callbackURL: string
  requester: IdentitySummary
}

export interface PaymentRequestSummary extends RequestSummary {
  receiver: {
    did: string
    address: string
  }
  requestJWT: string
  amount: number
  description: string
}
