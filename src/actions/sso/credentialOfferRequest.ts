import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { all, compose, either, isEmpty, isNil, map } from 'ramda'
import { httpAgent } from '../../lib/http'
import { JolocomLib } from 'jolocom-lib'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { BackendMiddleware } from '../../backendMiddleware'
import { convertToDecoratedClaim } from '../account'
import {
  CredentialReceiveSummary,
  ExternalCredentialSummary,
  IdentitySummary,
} from './types'

export const formatCredentialOfferRequest = (
  credOfferRequest: JSONWebToken<CredentialOfferRequest>,
  requesterSummary: IdentitySummary,
  receivedCredentials: ExternalCredentialSummary[],
): CredentialReceiveSummary => ({
  requestJWT: credOfferRequest.encode(),
  requester: requesterSummary,
  external: receivedCredentials,
})

export const assembleCredentialOffer = async (
  backendMiddleware: BackendMiddleware,
  credOfferRequest: JSONWebToken<CredentialOfferRequest>,
  requester: IdentitySummary,
): Promise<ExternalCredentialSummary[]> => {
  const {
    keyChainLib,
    identityWallet,
    registry,
    storageLib,
  } = backendMiddleware
  const { interactionToken } = credOfferRequest
  const { callbackURL } = interactionToken
  const selectedCredentialTypes = interactionToken.offeredTypes.map(type => ({
    type,
  }))

  if (!areRequirementsEmpty(interactionToken)) {
    throw new Error('Input requests are not yet supported on the wallet')
  }

  const selectedMetadata = interactionToken.offeredTypes.map(type => ({
    issuer: {
      did: keyIdToDid(credOfferRequest.issuer),
    },
    type,
    renderInfo: interactionToken.getRenderInfoForType(type) || {},
    metadata: interactionToken.getMetadataForType(type) || {},
  }))

  const password = await keyChainLib.getPassword()

  const credOfferResponse = await identityWallet.create.interactionTokens.response.offer(
    {
      callbackURL,
      selectedCredentials: selectedCredentialTypes,
    },
    password,
    credOfferRequest,
  )

  const res = await httpAgent.postRequest<{ token: string }>(
    callbackURL,
    { 'Content-Type': 'application/json' },
    { token: credOfferResponse.encode() },
  )

  const credentialReceive = JolocomLib.parse.interactionToken.fromJWT<
    CredentialsReceive
  >(res.token)

  await identityWallet.validateJWT(credentialReceive, undefined, registry)

  const providedCredentials =
    credentialReceive.interactionToken.signedCredentials

  const validationResults = await JolocomLib.util.validateDigestables(
    providedCredentials,
  )

  // TODO Error Code
  if (validationResults.includes(false)) {
    throw new Error('Invalid credentials received')
  }

  if (selectedMetadata) {
    await Promise.all(selectedMetadata.map(storageLib.store.credentialMetadata))
  }

  if (requester) {
    await storageLib.store.issuerProfile(requester)
  }

  // TODO change convertToDecoratedClaim to (metadata) => (cred): decoratedClaim
  // the types of the cred metadata arrays where it is use differ too much to do it simply right now
  const asDecoratedCredentials = providedCredentials.map(cred => {
    const md = selectedMetadata
      ? selectedMetadata.filter(mds => cred.type.includes(mds.type))
      : undefined

    const renderInfo = md && md.length ? md[0].renderInfo : undefined

    return {
      ...convertToDecoratedClaim(cred),
      renderInfo,
    }
  })

  return providedCredentials.map((cred, i) => ({
    credential: cred,
    decoratedClaim: asDecoratedCredentials[i],
  }))
}

const areRequirementsEmpty = (interactionToken: CredentialOfferRequest) =>
  compose(
    all(either(isNil, isEmpty)),
    map(interactionToken.getRequestedInputForType.bind(interactionToken)),
  )(interactionToken.offeredTypes)
