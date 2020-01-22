import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { AppError, ErrorCode } from '../../lib/errors'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { receiveExternalCredential } from './index'
import { all, compose, isEmpty, isNil, map, either } from 'ramda'
import { httpAgent } from '../../lib/http'
import { JolocomLib } from 'jolocom-lib'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { ThunkAction } from 'src/store'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { withLoading, withErrorScreen } from '../modifiers'
import { generateIdentitySummary } from './utils'

export const consumeCredentialOfferRequest = (
  credOfferRequest: JSONWebToken<CredentialOfferRequest>,
  isDeepLinkInteraction: boolean = false,
): ThunkAction => async (
  dispatch,
  getState,
  { keyChainLib, identityWallet, registry },
) => {
  await identityWallet.validateJWT(credOfferRequest, undefined, registry)
  const { interactionToken } = credOfferRequest
  const { callbackURL } = interactionToken

  if (!areRequirementsEmpty(interactionToken)) {
    throw new Error('Input requests are not yet supported on the wallet')
  }

  const requester = await registry.resolve(keyIdToDid(credOfferRequest.issuer))

  const requesterSummary = generateIdentitySummary(requester)

  const selectedCredentialTypes = interactionToken.offeredTypes.map(type => ({
    type,
  }))

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
    { callbackURL, selectedCredentials: selectedCredentialTypes },
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

  return dispatch(
    withLoading(
      withErrorScreen(
        receiveExternalCredential(
          credentialReceive,
          requesterSummary,
          isDeepLinkInteraction,
          selectedMetadata,
        ),
        err => new AppError(ErrorCode.CredentialsReceiveFailed, err),
      ),
    ),
  )
}

const areRequirementsEmpty = (interactionToken: CredentialOfferRequest) =>
  compose(
    all(either(isNil, isEmpty)),
    map(interactionToken.getRequestedInputForType.bind(interactionToken)),
  )(interactionToken.offeredTypes)
