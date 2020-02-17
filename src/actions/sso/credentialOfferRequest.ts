import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
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
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const interactionFlow = interactionManager
    .getInteraction(interactionId)
    .getFlow<CredentialOfferFlow>()

  await interactionFlow.createCredentialResponseToken(
    selectedCredentialOffering,
  )
  await interactionFlow.sendCredentialResponse()

  return dispatch(validateReceivedCredentials(interactionId))
}

const validateReceivedCredentials = (
  interactionId: string,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const currentDid = getState().account.did.did

  const interactionFlow = interactionManager
    .getInteraction(interactionId)
    .getFlow<CredentialOfferFlow>()

  await interactionFlow.validateOfferingDigestable()
  await interactionFlow.verifyCredentialStored()
  interactionFlow.verifyCredentialSubject(currentDid)

  const offeringValidity = interactionFlow.credentialOfferingState.map(
    offering => offering.valid,
  )

  const allInvalid = !offeringValidity.includes(true)
  const someInvalid = offeringValidity.includes(false)

  if (allInvalid) {
    // TODO @clauxx add strings
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

  if (someInvalid) {
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

  return dispatch(saveCredentialOffer(interactionId))
}

export const saveCredentialOffer = (
  interactionId: string,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const interactionFlow = interactionManager
    .getInteraction(interactionId)
    .getFlow<CredentialOfferFlow>()

  await interactionFlow.storeOfferedCredentials()
  await interactionFlow.storeOfferMetadata()
  await interactionFlow.storeIssuerProfile()

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
