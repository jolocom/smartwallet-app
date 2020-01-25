import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { all, compose, isEmpty, isNil, map, either } from 'ramda'
import { httpAgent } from '../../lib/http'
import { JolocomLib } from 'jolocom-lib'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { ThunkAction } from 'src/store'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { generateIdentitySummary } from './utils'
import { CredentialOfferResponseSelection } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { navigationActions } from '../index'
import { routeList } from '../../routeList'
import { setClaimsForDid } from '../account'
import { checkRecoverySetup } from '../notifications/checkRecoverySetup'
import { createInfoNotification, Notification } from '../../lib/notifications'
import { scheduleNotification } from '../notifications'

export const consumeCredentialOfferRequest = (
  credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  isDeepLinkInteraction: boolean = false,
): ThunkAction => async (dispatch, getState, { identityWallet, registry }) => {
  await identityWallet.validateJWT(credentialOfferRequest, undefined, registry)

  const { interactionToken } = credentialOfferRequest

  if (!areRequirementsEmpty(interactionToken)) {
    throw new Error('Input requests are not yet supported on the wallet')
  }

  const issuerDid = keyIdToDid(credentialOfferRequest.issuer)
  const requester = await registry.resolve(issuerDid)
  const offerMetadata = assembleCredentialMetadata(interactionToken, issuerDid)
  const requesterSummary = generateIdentitySummary(requester)

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.CredentialDialog,
      params: {
        credentialOfferRequest,
        requesterSummary,
        offerMetadata,
        isDeepLinkInteraction,
      },
    }),
  )
}

export const acceptSelectedCredentials = (
  selectedCredentialTypes: CredentialOfferResponseSelection[],
  credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  isDeepLink: boolean,
): ThunkAction => async (
  dispatch,
  getState,
  { keyChainLib, identityWallet, registry, storageLib },
) => {
  const { interactionToken } = credentialOfferRequest
  const { callbackURL } = interactionToken

  if (!areRequirementsEmpty(interactionToken)) {
    throw new Error('Input requests are not yet supported on the wallet')
  }
  const password = await keyChainLib.getPassword()

  const credOfferResponse = await identityWallet.create.interactionTokens.response.offer(
    { callbackURL, selectedCredentials: selectedCredentialTypes },
    password,
    credentialOfferRequest,
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

  if (!providedCredentials.length) throw new Error('No credentials received')

  providedCredentials.map(async credential => {
    await storageLib.delete.verifiableCredential(credential.id)
    await storageLib.store.verifiableCredential(credential)
  })

  const issuerDid = keyIdToDid(credentialOfferRequest.issuer)
  const offerMetadata = assembleCredentialMetadata(interactionToken, issuerDid)
  if (offerMetadata) {
    await Promise.all(offerMetadata.map(storageLib.store.credentialMetadata))
  }

  const requester = await registry.resolve(issuerDid)
  const requesterSummary = generateIdentitySummary(requester)
  if (requesterSummary) {
    await storageLib.store.issuerProfile(requesterSummary)
  }

  dispatch(checkRecoverySetup)
  dispatch(setClaimsForDid)

  const notification: Notification = createInfoNotification({
    title: 'Great success!',
    message: 'You can find your new credential at the documents',
    interact: {
      label: 'Open',
      onInteract: () => {
        dispatch(navigationActions.navigate({ routeName: routeList.Documents }))
      },
    },
  })

  dispatch(scheduleNotification(notification))

  if (isDeepLink) {
    return dispatch(navigationActions.navigatorResetHome())
  } else {
    return dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    )
  }
}

const areRequirementsEmpty = (interactionToken: CredentialOfferRequest) =>
  compose(
    all(either(isNil, isEmpty)),
    map(interactionToken.getRequestedInputForType.bind(interactionToken)),
  )(interactionToken.offeredTypes)

const assembleCredentialMetadata = (
  interactionToken: CredentialOfferRequest,
  issuerDid: string,
) =>
  interactionToken.offeredTypes.map(type => ({
    issuer: {
      did: issuerDid,
    },
    type,
    renderInfo: interactionToken.getRenderInfoForType(type) || {},
    metadata: interactionToken.getMetadataForType(type) || {},
  }))
