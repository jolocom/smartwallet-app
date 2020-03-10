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

// TODO @clauxx rename all to "state" instead of "summary"
export interface AuthenticationRequestSummary {
  description: string
}

export interface PaymentRequestSummary extends RequestSummary {
  receiver: {
    did: string
    address: string
  }
  amount: number
  description: string
}

export interface CredentialRequestSummary extends RequestSummary {
  availableCredentials: CredentialTypeSummary[]
}

export interface CredentialTypeSummary {
  type: string
  values: string[]
  verifications: CredentialVerificationSummary[]
}

export interface CredentialVerificationSummary {
  id: string
  issuer: IdentitySummary
  selfSigned: boolean
  expires: string | undefined | Date
}
