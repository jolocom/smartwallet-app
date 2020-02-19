import { Interaction } from './interaction'
import { CredentialOfferFlow } from './credentialOfferFlow'
import { CredentialOffer } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { CredentialRequestFlow } from './credentialRequestFlow'

export interface InteractionState {
  [nonce: string]: Interaction
}

export type InteractionFlows = CredentialOfferFlow | CredentialRequestFlow

export enum InteractionChannel {
  QR = 'QR',
  Deeplink = 'Deeplink',
}

export interface CredentialOffering extends CredentialOffer {
  credential?: SignedCredential
  valid: boolean
}
