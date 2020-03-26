import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { ThunkAction } from '../../store'
import { navigationActions } from '../index'
import { routeList } from '../../routeList'
import { setClaimsForDid } from '../account'
import { checkRecoverySetup } from '../notifications/checkRecoverySetup'
import { createInfoNotification, Notification } from '../../lib/notifications'
import { scheduleNotification } from '../notifications'
import I18n from 'src/locales/i18n'
import strings from '../../locales/strings'
import {
  InteractionChannel,
  SignedCredentialWithMetadata,
} from '../../lib/interactionManager/types'
import { isEmpty, uniqBy } from 'ramda'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { CredentialMetadataSummary } from 'src/lib/storage/storage'
import { CacheEntity } from 'src/lib/storage/entities'
import { OfferWithValidity } from 'src/lib/interactionManager/types'

export const consumeCredentialOfferRequest = (
  credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
  interactionChannel: InteractionChannel,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const interaction = await interactionManager.start(
    interactionChannel,
    credentialOfferRequest,
  )

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.CredentialReceive,
      params: {
        interactionId: credentialOfferRequest.nonce,
        interactionSummary: interaction.getSummary(),
      },
    }),
  )
}

export const consumeCredentialReceive = (
  selectedSignedCredentialWithMetadata: SignedCredentialWithMetadata[],
  interactionId: string,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const interaction = interactionManager.getInteraction(interactionId)

  const credentialReceive = await interaction.send(
    await interaction.createCredentialOfferResponseToken(
      selectedSignedCredentialWithMetadata,
    ),
  )

  // @ts-ignore
  await interaction.processInteractionToken(credentialReceive)
  return dispatch(
    validateSelectionAndSave(
      selectedSignedCredentialWithMetadata,
      interaction.id,
    ),
  )
}

// TODO Should abstract away negotiation.
// Takes an array of selectedCredentials,
// where signedCredential is assumed to be populated
// Takes an interactionId, from which the state can be pulled.
//
// The selectedCredentials contains the user selection,
// i.e. first, or second, or all.
//
// We should ensure we have the matching crednetials
// We should ensure the matching credentials pass the validation rules (assumed becaue they can't be selected on the ui layer)
// We attempt to save the matching credentials

export const validateSelectionAndSave = (
  selectedCredentials: SignedCredentialWithMetadata[],
  interactionId: string,
): ThunkAction => async (
  dispatch,
  getState,
  { interactionManager, storageLib },
) => {
  const interaction = interactionManager.getInteraction(interactionId)
  const offer: OfferWithValidity[] = interaction.getSummary().state

  const selectedTypes = selectedCredentials.map(el => el.type)
  const toSave = offer.filter(el => selectedTypes.includes(el.type))

  if (toSave.length !== selectedCredentials.length) {
    // TODO Decide how to handle this
    // Means one of the selections isn't in the offer
  }

  // TODO This should be abstracted away, but not sure where to
  // TODO Inject these into the screen so they render as unselectable
  // Maybe move this in the flow after all?
  const duplicates = await isCredentialStored(toSave, id =>
    interaction.getStoredCredentialById(id),
  )

  const validationErrors = toSave.map(
    ({ validationErrors }: OfferWithValidity, i) =>
      validationErrors.invalidIssuer ||
      !!validationErrors.invalidSubject ||
      duplicates[i],
  )

  // All invalid means all contain at least one error, i.e. there is no false
  const allInvalid = !validationErrors.includes(false)
  const allValid = !validationErrors.includes(true)

  const scheduleInvalidNotification = (message: string) =>
    scheduleNotification(
      createInfoNotification({
        title: I18n.t(strings.AWKWARD),
        message,
      }),
    )

  if (allInvalid) {
    dispatch(
      scheduleInvalidNotification(
        I18n.t(strings.IT_SEEMS_LIKE_WE_CANT_DO_THIS),
      ),
    )
    return dispatch(endReceiving(interactionId))
  }

  if (allValid) {
    await interaction.storeCredential(toSave)

    await storeOfferMetadata(
      interaction.getSummary().state,
      interaction.issuerSummary.did,
      storageLib.store.credentialMetadata,
    )

    await interaction.storeIssuerProfile()

    dispatch(checkRecoverySetup)
    //TODO @mnzaki can we avoid running the FULL setClaimsForDid
    dispatch(setClaimsForDid)

    const notification: Notification = createInfoNotification({
      title: I18n.t(strings.GREAT_SUCCESS),
      message: I18n.t(
        strings.YOU_CAN_FIND_YOUR_NEW_CREDENTIAL_IN_THE_DOCUMENTS,
      ),
      interact: {
        label: I18n.t(strings.OPEN),
        onInteract: () => {
          dispatch(
            navigationActions.navigate({ routeName: routeList.Documents }),
          )
        },
      },
    })

    dispatch(scheduleNotification(notification))
    return dispatch(endReceiving(interactionId))
  }

  dispatch(
    scheduleInvalidNotification(
      I18n.t(strings.SOMETHING_WENT_WRONG_CHOOSE_AGAIN),
    ),
  )

  // The screen is borked. Save is enabled by default. Not sure what's wrong
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.CredentialReceiveNegotiate,
      params: {
        interactionId,
        interactionSummary: { ...interaction.getSummary(), state: offer },
      },
    }),
  )
}

// TODO Breaks abstraction, should be handled in Interaction.store
const isCredentialStored = async (
  offer: SignedCredentialWithMetadata[],
  getCredential: (id: string) => Promise<SignedCredential[]>,
) =>
  Promise.all(
    offer.map(async ({ signedCredential }) =>
      signedCredential
        ? !isEmpty(await getCredential(signedCredential.id))
        : false,
    ),
  )

// LEFT -> Probably not storing correctly, or not throwing.
// The flow on the wallet looks okay, but stuff is not in the documetns tab
// todo => check if the server I'm testing against isn't the problem

const storeOfferMetadata = async (
  offer: SignedCredentialWithMetadata[],
  did: string,
  storeCredentialMetadata: (
    a: CredentialMetadataSummary,
  ) => Promise<CacheEntity>,
) =>
  Promise.all(
    uniqBy(
      detail => `${detail.issuer.did}${detail.type}`,
      offer.map(({ type, renderInfo, metadata }) => ({
        // TODO Why isn't the did already in the summary type? This feels hacky
        issuer: { did },
        type,
        renderInfo: renderInfo || {},
        metadata: metadata || {},
      })),
    ).map(storeCredentialMetadata),
  )

const endReceiving = (interactionId: string): ThunkAction => (
  dispatch,
  getState,
  { interactionManager },
) => {
  const interaction = interactionManager.getInteraction(interactionId)
  const { channel } = interaction

  if (channel === InteractionChannel.Deeplink) {
    //TODO @clauxx handle deeplink properly
    return dispatch(navigationActions.navigatorResetHome())
  } else {
    return dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    )
  }
}
