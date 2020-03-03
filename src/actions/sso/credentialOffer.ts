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
  CredentialOffering,
  InteractionChannel,
} from '../../lib/interactionManager/types'
import { JolocomLib } from 'jolocom-lib'
import { isEmpty, uniqBy } from 'ramda'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { CredentialMetadataSummary } from 'src/lib/storage/storage'
import { CacheEntity } from 'src/lib/storage/entities'

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
        credentialOfferingSummary: interaction.getState(),
      },
    }),
  )
}

export const consumeCredentialReceive = (
  selectedCredentialOffering: CredentialOffering[],
  interactionId: string,
): ThunkAction => async (dispatch, getState, { interactionManager }) => {
  const interaction = interactionManager.getInteraction(interactionId)
  const currentDid = getState().account.did.did
  debugger

  await interaction.processInteractionToken(
    await interaction.createCredentialOfferResponseToken(
      selectedCredentialOffering,
    ),
  )

  // TODO These should be handled in flow?
  const validSubjects = verifyCredentialSubject(
    interaction.getState(),
    currentDid,
  )

  const validSignatures = await validateOfferingDigestable(
    interaction.getState(),
  )

  const duplicates = await isCredentialStored(interaction.getState(), id =>
    interaction.getStoredCredentialById(id),
  )

  const all = validSubjects.map(
    (el, i) => el && validSignatures[i] && !duplicates[i],
  )

  const allInvalid = !all.includes(true)
  const someInvalid = all.includes(false)

  const scheduleInvalidNotification = (message: string) =>
    dispatch(
      scheduleNotification(
        createInfoNotification({
          title: I18n.t(strings.AWKWARD),
          message,
        }),
      ),
    )

  if (allInvalid) {
    scheduleInvalidNotification(I18n.t(strings.IT_SEEMS_LIKE_WE_CANT_DO_THIS))
    return dispatch(endReceiving(interactionId))
  }

  if (someInvalid) {
    scheduleInvalidNotification(
      I18n.t(strings.SOMETHING_WENT_WRONG_CHOOSE_AGAIN),
    )

    return dispatch(
      navigationActions.navigate({
        routeName: routeList.CredentialReceiveInvalid,
        params: { interactionId },
      }),
    )
  }

  // TODO This already happens in the next 
  // await interaction.storeCredentialMetadataFromOffer(interaction)
  return dispatch(saveCredentialOffer(interactionId))
}

const validateOfferingDigestable = async (offer: CredentialOffering[]) =>
  Promise.all(offer.map(async ({ credential }) =>
        credential && (await JolocomLib.util.validateDigestable(credential)),
    ),
  )

// TODO Breaks abstraction, should be handled in Interaction.store
const isCredentialStored = async (
  offer: CredentialOffering[],
  getCredential: (id: string) => Promise<SignedCredential[]>,
) =>
  Promise.all(
    offer.map(
      async ({ credential }) =>
        credential && !isEmpty(await getCredential(credential.id)),
    ),
  )

const verifyCredentialSubject = (offer: CredentialOffering[], did: string) =>
  offer.map(({ credential }) => credential && credential.subject === did)

// TODO Why isn't the did already in the summary type? This feels hacky
const storeOfferMetadata = async (
  offer: CredentialOffering[],
  did: string,
  storeCredentialMetadata: (a: CredentialMetadataSummary) => Promise<CacheEntity>,
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

export const saveCredentialOffer = (
  interactionId: string,
): ThunkAction => async (
  dispatch,
  getState,
  { interactionManager, storageLib },
) => {
  const interaction = interactionManager.getInteraction(interactionId)

  // TODO These should be handled on the interaction layer, like the issuer profile
  await interaction.storeCredential()
  await storeOfferMetadata(
    interaction.getState(),
    interaction.issuerSummary.did,
    storageLib.store.credentialMetadata,
  )
  await interaction.storeIssuerProfile()

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
    //TODO @clauxx handle deeplink properly
    return dispatch(navigationActions.navigatorResetHome())
  } else {
    return dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    )
  }
}
