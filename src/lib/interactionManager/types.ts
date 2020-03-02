import { Interaction } from './interaction'
import { CredentialOffer } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

export interface InteractionState {
  [nonce: string]: Interaction
}

export enum InteractionChannel {
  QR = 'QR',
  Deeplink = 'Deeplink',
}

export interface CredentialOffering extends CredentialOffer {
  credential?: SignedCredential
  valid: boolean
}
