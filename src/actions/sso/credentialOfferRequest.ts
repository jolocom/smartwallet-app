import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { uniqBy } from 'ramda'
import { httpAgent } from '../../lib/http'
import { JolocomLib } from 'jolocom-lib'
import { CredentialsReceive } from 'jolocom-lib/js/interactionTokens/credentialsReceive'
import { ThunkAction } from 'src/store'
import { navigationActions } from '../index'
import { routeList } from '../../routeList'
import { setClaimsForDid } from '../account'
import { checkRecoverySetup } from '../notifications/checkRecoverySetup'
import { createInfoNotification, Notification } from '../../lib/notifications'
import { scheduleNotification } from '../notifications'
import I18n from 'src/locales/i18n'
import strings from '../../locales/strings'
import {
  CredentialOfferFlow,
  CredentialOffering,
  InteractionChannel,
} from '../../lib/interactionManager/credentialOfferFlow'
import { CredentialMetadataSummary } from '../../lib/storage/storage'

export const consumeCredentialOfferRequest = (
  credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  interactionChannel: InteractionChannel,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const { id } = await interactionManager.start(
    interactionChannel,
    credentialOfferRequest,
  )

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.CredentialReceive,
      params: { interactionId: id },
    }),
  )
}

export const consumeCredentialReceive = (
  selectedCredentialOffering: CredentialOffering[],
  interactionId: string,
): ThunkAction => async (
  dispatch,
  getState,
  { interactionManager, keyChainLib, identityWallet, registry },
) => {
  const interactionFlow = interactionManager.getInteraction(interactionId)
    .flow as CredentialOfferFlow
  const credentialOfferResponse = await interactionFlow.createCredentialResponseToken(
    selectedCredentialOffering,
  )

  const { callbackURL } = interactionFlow
  const res = await httpAgent.postRequest<{ token: string }>(
    callbackURL,
    { 'Content-Type': 'application/json' },
    { token: credentialOfferResponse.encode() },
  )
  const credentialReceive = JolocomLib.parse.interactionToken.fromJWT<
    CredentialsReceive
  >(res.token)

  await interactionManager.addToken(credentialReceive)
  return dispatch(validateReceivedCredentials(interactionId))
}

const validateReceivedCredentials = (
  interactionId: string,
): ThunkAction => async (
  dispatch,
  getState,
  { interactionManager, storageLib },
) => {
  const interaction = interactionManager.getInteraction(interactionId)
  const interactionFlow = interaction.flow as CredentialOfferFlow

  const currentDid = getState().account.did.did
  const validAcc: boolean[] = []

  const validatedCredentialOffering = await interactionFlow.setOfferingAsync(
    offeringState =>
      Promise.all(
        offeringState.map(async offering => {
          if (!offering.credential) {
            validAcc.push(false)
            offering.valid = false
          } else {
            const { credential } = offering
            const validated = await JolocomLib.util.validateDigestable(
              credential,
            )
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
      ),
  )

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
    return dispatch(endReceiving(interactionId))
  }

  if (validAcc.includes(false)) {
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
        params: { interactionId },
      }),
    )
  }

  return dispatch(
    saveCredentialOffer(validatedCredentialOffering, interactionId),
  )
}

export const saveCredentialOffer = (
  credentialOffering: CredentialOffering[],
  interactionId: string,
): ThunkAction => async (
  dispatch,
  getState,
  { storageLib, interactionManager },
) => {
  const { issuerSummary } = interactionManager.getInteraction(interactionId)

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
  return dispatch(endReceiving(interactionId))
}

const endReceiving = (interactionId: string): ThunkAction => (
  dispatch,
  getState,
  { interactionManager },
) => {
  const interaction = interactionManager.getInteraction(interactionId)
  const { channel } = interaction

  if (channel === InteractionChannel.Deeplink) {
    // handle deeplink properly
    return dispatch(navigationActions.navigatorResetHome())
  } else {
    return dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    )
  }
}
