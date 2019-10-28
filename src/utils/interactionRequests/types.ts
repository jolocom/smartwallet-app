import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { IdentitySummary } from '../../actions/sso/types'

export interface RequestSummary {
  requester: IdentitySummary
  request: JSONWebToken<JWTEncodable>
}

export interface AuthenticationRequestSummary extends RequestSummary {
  description: string
  callbackURL: string
}

export interface PaymentRequestSummary extends RequestSummary {
  callbackURL: string
  receiver: {
    did: string
    address: string
  }
  amount: number
  description: string
}

export interface CredentialOfferSummary extends RequestSummary {
  callbackURL: string
}

export interface CredentialReceiveSummary extends CredentialOfferSummary {}

export interface CredentialRequestSummary extends RequestSummary {
  callbackURL: string
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
