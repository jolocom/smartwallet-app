import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { CredentialOfferResponse } from 'jolocom-lib/js/interactionTokens/credentialOfferResponse'
import { JolocomLib } from 'jolocom-lib'
import { isNil, uniqBy } from 'ramda'
import { CredentialMetadataSummary } from '../storage/storage'
import { CredentialOffering } from './types'
import { Interaction } from './interaction'

export class CredentialOfferFlow {
  public ctx: Interaction
  public tokens: Array<JSONWebToken<JWTEncodable>> = []
  public credentialOfferingState: CredentialOffering[] = []
  public callbackURL: string

  public constructor(
    ctx: Interaction,
    credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  ) {
    this.ctx = ctx
    this.callbackURL = credentialOfferRequest.interactionToken.callbackURL
    this.handleInteractionToken(credentialOfferRequest)
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

  public handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    switch (token.interactionType) {
      case InteractionType.CredentialOfferRequest:
        this.consumeOfferRequest(token)
        break
      case InteractionType.CredentialOfferResponse:
        break
      case InteractionType.CredentialsReceive:
        this.consumeCredentialReceive(token)
        break
      default:
        throw new Error('Interaction type not found')
    }
    this.tokens.push(token)
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

    this.handleInteractionToken(credOfferResponse)
    return credOfferResponse
  }

  public async sendCredentialResponse() {
    const credentialOfferResponse = this.getToken<CredentialOfferResponse>(
      InteractionType.CredentialOfferResponse,
    )
    const credentialsReceive = await this.ctx.sendPost<CredentialsReceive>(
      this.callbackURL,
      { token: credentialOfferResponse.encode() },
    )
    await this.ctx.validateJWT(credentialsReceive)

    this.handleInteractionToken(credentialsReceive)

    return credentialsReceive
  }

  public async validateOfferingDigestable() {
    const validatedOffering = await Promise.all(
      this.credentialOfferingState.map(async offering => {
        let valid
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
        let valid
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
        uniqCredentialDetails.map(await this.ctx.storeCredentialMetadata),
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
