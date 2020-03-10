import { Interaction } from './interaction'
import { CredentialOffer } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { IdentitySummary } from '../../actions/sso/types'

// TODO @clauxx rename this
export interface InteractionState {
  [nonce: string]: Interaction
}

// TODO @clauxx make generic???
export interface  InteractionSummary {
  issuer: IdentitySummary
  state: any
}

export enum InteractionChannel {
  QR = 'QR',
  Deeplink = 'Deeplink',
  HTTP = 'HTTP',
  Bluetooth = 'Bluetooth',
  NFC = 'NFC',
}

export interface SignedCredentialWithMetadata extends CredentialOffer {
  signedCredential?: SignedCredential
}
