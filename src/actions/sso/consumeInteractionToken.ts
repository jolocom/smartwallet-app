import { ThunkAction } from '../../store'
import { routeList } from '../../routeList'
import { JolocomLib } from 'jolocom-lib'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { interactionHandlers } from '../../lib/storage/interactionTokens'
import { AppError, ErrorCode } from '../../lib/errors'
import { generateIdentitySummary } from './utils'
import { navigate } from '../navigation'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { assembleCredentials } from './index'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { assembleCredentialOffer } from './credentialOfferRequest'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'

/**
 * The function parses the interaction token and returns the respective request summary
 * @param jwt
 */
export const consumeInteractionToken = (jwt: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { identityWallet, registry, storageLib } = backendMiddleware
  // TODO Fix
  // The identityWallet is initialised before the deep link is handled. If it
  // is not initialized, then we may not even have an identity.
  if (!identityWallet) {
    return dispatch(
      navigate({
        routeName: routeList.Landing,
      }),
    )
  }

  const requestToken = JolocomLib.parse.interactionToken.fromJWT(jwt)
  await identityWallet.validateJWT(requestToken, undefined, registry)

  const issuer = await registry.resolve(keyIdToDid(requestToken.issuer))
  const issuerSummary = generateIdentitySummary(issuer)

  const handler = interactionHandlers[requestToken.interactionType]

  if (!handler) {
    throw new AppError(
      ErrorCode.ParseJWTFailed,
      new Error('Could not handle interaction token'),
    )
  }

  let assembledCredentials
  if (requestToken.interactionType === InteractionType.CredentialRequest) {
    const { did } = getState().account.did
    const {
      requestedCredentialTypes: requestedTypes,
    } = requestToken.interactionToken as CredentialRequest
    assembledCredentials = await assembleCredentials(
      storageLib,
      did,
      requestedTypes,
    )
  } else if (
    requestToken.interactionType === InteractionType.CredentialOfferRequest
  ) {
    assembledCredentials = await assembleCredentialOffer(
      backendMiddleware,
      requestToken as JSONWebToken<CredentialOfferRequest>,
      issuerSummary,
    )
  }

  return handler(requestToken, issuerSummary, assembledCredentials)
}
