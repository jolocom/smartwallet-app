import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { uniqBy } from 'ramda'
import { httpAgent } from '../../lib/http'
import { JolocomLib } from 'jolocom-lib'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { ThunkAction } from 'src/store'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import {
  areRequirementsEmpty,
  assembleCredentialDetails,
  generateIdentitySummary,
} from './utils'
import {
  CredentialOfferRenderInfo,
  CredentialOfferResponseSelection,
} from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { navigationActions } from '../index'
import { routeList } from '../../routeList'
import { setClaimsForDid } from '../account'
import { checkRecoverySetup } from '../notifications/checkRecoverySetup'
import { createInfoNotification, Notification } from '../../lib/notifications'
import { scheduleNotification } from '../notifications'
import I18n from 'src/locales/i18n'
import strings from '../../locales/strings'
import { CredentialOfferNavigationParams } from '../../ui/home/containers/credentialReceive'

export interface CredentialOfferRenderDetails {
  renderInfo: CredentialOfferRenderInfo | undefined
  type: string
}

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
  const credentialRenderDetails: CredentialOfferRenderDetails[] = interactionToken.offeredTypes.map(
    type => ({
      type,
      renderInfo: interactionToken.getRenderInfoForType(type),
    }),
  )
  const requesterSummary = generateIdentitySummary(requester)

  const params: CredentialOfferNavigationParams = {
    credentialOfferRequest,
    requesterSummary,
    credentialRenderDetails,
    isDeepLink: isDeepLinkInteraction,
  }

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.CredentialDialog,
      params,
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

  if (!providedCredentials.length) throw new Error('No credentials received')

  const validationResults = await JolocomLib.util.validateDigestables(
    providedCredentials,
  )

  // TODO Error Code
  if (validationResults.includes(false)) {
    throw new Error('Invalid credentials received')
  }

  providedCredentials.map(async credential => {
    await storageLib.delete.verifiableCredential(credential.id)
    await storageLib.store.verifiableCredential(credential)
  })

  const issuerDid = keyIdToDid(credentialOfferRequest.issuer)
  const offerCredentialDetails = assembleCredentialDetails(
    interactionToken,
    issuerDid,
    selectedCredentialTypes,
  )

  if (offerCredentialDetails) {
    const uniqCredentialDetails = uniqBy(
      detail => `${detail.issuer.did}${detail.type}`,
      offerCredentialDetails,
    )

    await Promise.all(
      uniqCredentialDetails.map(storageLib.store.credentialMetadata),
    )
  }

  const requester = await registry.resolve(issuerDid)
  const requesterSummary = generateIdentitySummary(requester)
  if (requesterSummary) {
    await storageLib.store.issuerProfile(requesterSummary)
  }

  dispatch(checkRecoverySetup)
  dispatch(setClaimsForDid)

  const notification: Notification = createInfoNotification({
    title: I18n.t(strings.GREAT_SUCCESS),
    message: I18n.t(strings.YOU_CAN_FIND_YOUR_NEW_CREDENTIAL_IN_THE_DOCUMENTS),
    interact: {
      label: I18n.t(strings.OPEN),
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
