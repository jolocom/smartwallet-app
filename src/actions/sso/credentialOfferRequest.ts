import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { AppError, ErrorCode } from '../../lib/errors'
import { showErrorScreen } from '../generic'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { receiveExternalCredential, setDeepLinkLoading } from './index'
import { all, compose, isEmpty, isNil, map, mergeRight, omit } from 'ramda'
import { httpAgent } from '../../lib/http'
import { JolocomLib } from 'jolocom-lib'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { ThunkDispatch } from '../../store'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { RootState } from '../../reducers'
import { BackendMiddleware } from '../../backendMiddleware'
import { withErrorHandling, withLoading } from '../modifiers'
import { toggleLoading} from '../account'

export const consumeCredentialOfferRequest = (
  credOfferRequest: JSONWebToken<CredentialOfferRequest>,
) => async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  { keyChainLib, identityWallet, registry }: BackendMiddleware,
) => {
  try {
    await identityWallet.validateJWT(credOfferRequest, undefined, registry)
    const { interactionToken } = credOfferRequest
    const { callbackURL } = interactionToken

    if (!areRequirementsEmpty(interactionToken)) {
      throw new Error('Input requests are not yet supported on the wallet')
    }

    const { did: offerorDid, publicProfile } = await registry.resolve(
      keyIdToDid(credOfferRequest.issuer),
    )

    const parsedProfile = publicProfile
      ? omit(['id', 'did'], publicProfile.toJSON().claim)
      : {}

    const offerorInfo = mergeRight(
      { did: offerorDid },
      { publicProfile: parsedProfile },
    )
    const selectedCredentialTypes = interactionToken.offeredTypes.map(type => ({
      type,
    }))

    const selectedMetadata = interactionToken.offeredTypes.map(type => ({
      issuer: {
        did: keyIdToDid(credOfferRequest.issuer)
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
      withLoading(toggleLoading)(
        withErrorHandling(
          showErrorScreen,
          err => new AppError(ErrorCode.CredentialsReceiveFailed, err),
        )(receiveExternalCredential(credentialReceive, offerorInfo, selectedMetadata)),
      ),
    )
  } finally {
    dispatch(setDeepLinkLoading(false))
  }
}

const areRequirementsEmpty = (interactionToken: CredentialOfferRequest) =>
  compose(
    all(isNil || isEmpty),
    map(interactionToken.getRequestedInputForType.bind(interactionToken)),
  )(interactionToken.offeredTypes)