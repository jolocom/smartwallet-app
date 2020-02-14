import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { uniqBy } from 'ramda'
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
import I18n from 'src/locales/i18n'
import strings from '../../locales/strings'
import { CredentialOfferNavigationParams } from '../../ui/sso/containers/credentialReceive'
import {
  CredentialOffering,
  InteractionChannel,
} from '../../lib/interactionManager/credentialOfferFlow'
import { CredentialMetadataSummary } from '../../lib/storage/storage'

export const consumeCredentialOfferRequest = (
  credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  interactionChannel: InteractionChannel,
): ThunkAction => async (
  dispatch,
  getState,
  { identityWallet, registry, interactionManager },
) => {
  interactionManager.start(interactionChannel)

  // @mnzaki include in Interaction
  await identityWallet.validateJWT(credentialOfferRequest, undefined, registry)

  const issuerDid = keyIdToDid(credentialOfferRequest.issuer)
  const requester = await registry.resolve(issuerDid)
  const requesterSummary = generateIdentitySummary(requester)

  // Interaction offer specific
  const { interactionToken } = credentialOfferRequest
  const credentialOfferDetails: CredentialOffering[] = interactionToken.offeredCredentials.map(
    credential => ({
      ...credential,
      valid: true,
    }),
  )

  interactionManager.setOfferDetails(
    credentialOfferRequest,
    requesterSummary,
    credentialOfferDetails,
  )

  // pass the nonce(interaction id) to the container
  // import backendMiddleware in containers
  const params: CredentialOfferNavigationParams = {
    requesterSummary,
    credentialOffering: credentialOfferDetails,
  }

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.CredentialReceive,
      params,
    }),
  )
}

export const consumeCredentialReceive = (
  selectedCredentialOffering: CredentialOffering[],
): ThunkAction => async (
  dispatch,
  getState,
  { interactionManager, keyChainLib, identityWallet, registry },
) => {
  const { credentialOfferRequest } = interactionManager.getOfferDetails()

  const { callbackURL } = credentialOfferRequest.interactionToken

  const password = await keyChainLib.getPassword()

  // NOTE not returning providedInput since it's not used
  const selectedTypes: CredentialOfferResponseSelection[] = selectedCredentialOffering.map(
    offer => ({ type: offer.type }),
  )
  const credOfferResponse = await identityWallet.create.interactionTokens.response.offer(
    { callbackURL, selectedCredentials: selectedTypes },
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

  interactionManager.setCredentialOffering(selectedCredentialOffering)
  interactionManager.updateOfferingWithCredentials(providedCredentials)

  return dispatch(validateReceivedCredentials)
}

const validateReceivedCredentials: ThunkAction = async (
  dispatch,
  getState,
  { interactionManager, storageLib },
) => {
  const {
    credentialOffering,
    issuerSummary,
  } = interactionManager.getOfferDetails()

  const currentDid = getState().account.did.did
  const validAcc: boolean[] = []
  const validatedCredentialOffering = await Promise.all(
    credentialOffering.map(async offering => {
      if (!offering.credential) {
        validAcc.push(false)
        offering.valid = false
      } else {
        const { credential } = offering
        const validated = await JolocomLib.util.validateDigestable(credential)
        const storedCredential = await storageLib.get.verifiableCredential({
          id: credential.id,
        })
        const owned = credential.subject === currentDid
        const isValid = owned && validated && !storedCredential.length
        validAcc.push(isValid)
        offering.valid = isValid
      }

      return offering
    }),
  )

  interactionManager.setCredentialOffering(validatedCredentialOffering)

  // TODO @clauxx add strings
  if (!validAcc.includes(true)) {
    dispatch(
      scheduleNotification(
        createInfoNotification({
          title: 'Oh uh',
          message: 'Nothing we received makes sense',
        }),
      ),
    )
    return dispatch(endReceiving)
  }

  if (validAcc.includes(false)) {
    const params: CredentialOfferNavigationParams = {
      credentialOffering: validatedCredentialOffering,
      requesterSummary: issuerSummary,
    }

    // TODO @clauxx add strings
    dispatch(
      scheduleNotification(
        createInfoNotification({
          title: 'Oh uh',
          message: 'Some of this stuff is not right.',
        }),
      ),
    )

    return dispatch(
      navigationActions.navigate({
        routeName: routeList.CredentialReceiveInvalid,
        params,
      }),
    )
  }

  return dispatch(saveCredentialOffer(validatedCredentialOffering))
}

export const saveCredentialOffer = (
  credentialOffering: CredentialOffering[],
): ThunkAction => async (
  dispatch,
  getState,
  { storageLib, interactionManager },
) => {
  const { issuerSummary } = interactionManager.getOfferDetails()

  await Promise.all(
    credentialOffering.map(async offering => {
      if (offering.credential) {
        const credential = offering.credential
        await storageLib.delete.verifiableCredential(credential.id)
        await storageLib.store.verifiableCredential(credential)
      }
    }),
  )

  const offerCredentialDetails: CredentialMetadataSummary[] = credentialOffering.map(
    ({ type, renderInfo, metadata }) => ({
      issuer: {
        did: issuerSummary.did,
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
      uniqCredentialDetails.map(storageLib.store.credentialMetadata),
    )
  }

  if (issuerSummary.publicProfile) {
    await storageLib.store.issuerProfile(issuerSummary)
  }

  dispatch(checkRecoverySetup)
  //TODO @mnzaki can we avoid running the FULL setClaimsForDid
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
  return dispatch(endReceiving)
}

const endReceiving: ThunkAction = (
  dispatch,
  getState,
  { interactionManager },
) => {
  const interactionChannel = interactionManager.getChannel()
  interactionManager.end()

  if (interactionChannel === InteractionChannel.Deeplink) {
    // handle deeplink properly
    return dispatch(navigationActions.navigatorResetHome())
  } else {
    return dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    )
  }
}
