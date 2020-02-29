import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { JolocomLib } from 'jolocom-lib'
import { isNil, uniqBy } from 'ramda'
import { CredentialMetadataSummary } from '../storage/storage'
import { CredentialOffering } from './types'
import { Interaction } from './interaction'
import { CredentialOfferResponse } from 'jolocom-lib/js/interactionTokens/credentialOfferResponse'

export class CredentialOfferFlow {
  public ctx: Interaction
  public tokens: Array<JSONWebToken<JWTEncodable>> = []
  public credentialOfferingState: CredentialOffering[] = []

  public constructor(ctx: Interaction) {
    this.ctx = ctx
  }

  // TODO breaks abstraction
  public getToken<T extends JWTEncodable>(type: InteractionType) {
    const token = this.tokens.find(token => token.interactionType === type)

    if (!token) throw new Error('Token not found')

    // TODO fix type casting, breaks abstraction
    return token as JSONWebToken<T>
  }

  public getState() {
    return this.credentialOfferingState
  }

  public async handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    // TODO Push once all is good FIX
    this.tokens.push(token)
    switch (token.interactionType) {
      case InteractionType.CredentialOfferRequest:
        return this.consumeOfferRequest(token)
      case InteractionType.CredentialOfferResponse:
        return this.sendCredentialResponse(token as JSONWebToken<CredentialOfferResponse>)
      case InteractionType.CredentialsReceive:
        return this.consumeCredentialReceive(token)
      default:
        throw new Error('Interaction type not found')
    }
  }

  public consumeOfferRequest(token: JSONWebToken<JWTEncodable>) {
    const credOfferRequest = token as JSONWebToken<CredentialOfferRequest>

    this.setOffering(_ =>
      credOfferRequest.interactionToken.offeredCredentials.map(offer => ({
        ...offer,
        valid: true,
      })),
    )
  }

  public consumeCredentialReceive(token: JSONWebToken<JWTEncodable>) {
    const credentialsReceive = token as JSONWebToken<CredentialsReceive>
    this.updateOfferingWithCredentials(
      credentialsReceive.interactionToken.signedCredentials,
    )
  }

  public updateOfferingWithCredentials = (credentials: SignedCredential[]) => {
    this.setOffering(offeringState =>
      credentials.map(credential => {
        const type = credential.type[credential.type.length - 1]
        const offering = offeringState.find(offering => offering.type === type)
        if (!offering) {
          throw new Error('Received wrong credentials')
        }
        return {
          ...offering,
          credential,
        }
      }),
    )
  }

  public setOffering(
    factory: (state: CredentialOffering[]) => CredentialOffering[],
  ) {
    this.credentialOfferingState = factory(this.credentialOfferingState)
    return this.credentialOfferingState
  }

  public async createCredentialResponseToken(
    selectedOffering: CredentialOffering[],
  ) {
    const credentialOfferRequest = this.getToken<CredentialOfferRequest>(
      InteractionType.CredentialOfferRequest,
    )
    const credentialResponseAttr = {
      callbackURL: credentialOfferRequest.interactionToken.callbackURL,
      selectedCredentials: selectedOffering.map(offer => ({
        type: offer.type,
      })),
    }
    const credOfferResponse = await this.ctx.createInteractionToken(
      InteractionType.CredentialOfferResponse,
      credentialResponseAttr,
      credentialOfferRequest,
    )

    return credOfferResponse
  }

  // TODO Changed to private because can't tell where used, should go
  // through handleInteractionToken to make sure it's vallidated
  private async sendCredentialResponse(token: JSONWebToken<CredentialOfferResponse>) {
    const credentialsReceive = await this.ctx.sendPost<CredentialsReceive>(
      token.interactionToken.callbackURL,
      { token: token.encode() },
    )

    return this.handleInteractionToken(credentialsReceive)
  }

  public async validateOfferingDigestable() {
    const validatedOffering = await Promise.all(
      this.credentialOfferingState.map(async offering => {
        let valid: boolean
        if (isNil(offering.credential)) {
          valid = false
        } else {
          valid = await JolocomLib.util.validateDigestable(offering.credential)
        }
        return {
          ...offering,
          valid,
        }
      }),
    )
    this.setOffering(_ => validatedOffering)
  }

  public async verifyCredentialStored() {
    const verifiedOffering = await Promise.all(
      this.credentialOfferingState.map(async offering => {
        let valid: boolean
        if (isNil(offering.credential)) {
          valid = false
        } else {
          const storedCredential = await this.ctx.getStoredCredentialById(
            offering.credential.id,
          )
          valid = !storedCredential.length
        }
        return {
          ...offering,
          valid,
        }
      }),
    )
    this.setOffering(_ => verifiedOffering)
  }

  public verifyCredentialSubject(did: string) {
    this.setOffering(offering =>
      offering.map(offer => {
        let valid
        if (isNil(offer.credential)) {
          valid = false
        } else {
          valid = offer.credential.subject === did
        }
        return {
          ...offer,
          valid,
        }
      }),
    )
  }

  public async storeOfferedCredentials() {
    this.credentialOfferingState.map(async offering => {
      const credential = offering.credential
      if (credential) {
        await this.ctx.storeCredential(credential)
      }
    })
  }

  public async storeOfferMetadata() {
    const offerCredentialDetails: CredentialMetadataSummary[] = this.credentialOfferingState.map(
      ({ type, renderInfo, metadata }) => ({
        issuer: {
          did: this.ctx.issuerSummary.did,
        },
        type,
        renderInfo: renderInfo || {},
        metadata: metadata || {},
      }),
    )

    if (offerCredentialDetails) {
      const uniqCredentialDetails = uniqBy(
        detail => `${detail.issuer.did}${detail.type}`,
        offerCredentialDetails,
      )

      await Promise.all(
        uniqCredentialDetails.map(this.ctx.storeCredentialMetadata),
      )
    }
  }

  public async storeIssuerProfile() {
    //TODO @clauxx any particular reason to save summary only if pubProfile exists???
    const { issuerSummary } = this.ctx
    if (issuerSummary.publicProfile) {
      await this.ctx.storeIssuerProfile(issuerSummary)
    }
  }
}
