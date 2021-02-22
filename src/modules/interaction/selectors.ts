import { createSelector } from 'reselect'

import { RootReducerI } from '~/types/reducer'
import {
  CredentialsBySection,
  OfferUICredential,
  ShareCredentialsBySection,
  ShareUICredential,
} from '~/types/credentials'
import { AttributeI, AttrsState } from '~/modules/attributes/types'
import { getAttributes } from '~/modules/attributes/selectors'
import { getAllCredentials } from '~/modules/credentials/selectors'
import { uiCredentialToShareCredential } from '~/utils/dataMapping'
import { getCredentialSection } from '~/utils/credentialsBySection'
import { InteractionDetails } from './types'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
  isNotActiveInteraction,
  isResolutionDetails,
} from './guards'
import { strings } from '~/translations/strings'
import BP from '~/utils/breakpoints'

const createInteractionSelector = <T extends InteractionDetails>(
  guard: (details: InteractionDetails) => details is T,
) =>
  createSelector([getActiveInteraction], (details) => {
    if (!guard(details)) throw new Error('Wrong interaction details')

    return details
  })

/**
 * Gets the @FlowType if there is an active interaction or null otherwise.
 */
export const getInteractionType = (state: RootReducerI) =>
  state.interaction.details.flowType

/**
 * Gets the interaction details from the @interactions module.
 *
 * NOTE: Not type safe. Generally the interaction specific selector (e.g. getAuthenticationDetails, etc.)
 *       should be used.
 */
const getInteractionDetails = (state: RootReducerI): InteractionDetails =>
  state.interaction.details

/**
 * Gets the @interactionDetails if there is an active interaction, otherwise throws.
 */
export const getActiveInteraction = createSelector(
  [getInteractionDetails],
  (details) => {
    if (isNotActiveInteraction(details))
      throw new Error('Interaction is not present in the store')

    return details
  },
)

/**
 * Gets the @interactionId of the interaction that is currently active.
 */
export const getInteractionId = createSelector(
  [getActiveInteraction],
  ({ id }) => id,
)

/**
 * Gets the @counterparty of the current active interaction.
 */
export const getInteractionCounterparty = createSelector(
  [getActiveInteraction],
  ({ counterparty }) => counterparty,
)

/**
 * Gets the @name of the counterparty (from the public profile) if available. Otherwise, will
 * return a fallback string.
 */
export const getCounterpartyName = createSelector(
  [getActiveInteraction],
  ({ counterparty }) => counterparty.publicProfile?.name ?? strings.SERVICE,
)

/**
 * Gets the @interactionDetails for each type of interaction. Can only be used within the specific interaction
 * components, otherwise will throw (e.g. using @getAuthenticationDetails inside @BasWrapper will throw).
 */
export const getAuthenticationDetails = createInteractionSelector(isAuthDetails)
export const getAuthorizationDetails = createInteractionSelector(isAuthzDetails)
export const getCredShareDetails = createInteractionSelector(isCredShareDetails)
export const getCredOfferDetails = createInteractionSelector(isCredOfferDetails)
export const getResolutionDetails = createInteractionSelector(
  isResolutionDetails,
)

/** CredentialShare selectors **/

/**
 * Gets the mapping of all selected credentials (attributes + documents)
 */
export const getSelectedShareCredentials = createSelector(
  [getCredShareDetails],
  ({ selectedCredentials }) => selectedCredentials,
)

/**
 * Gets the available requested attributes from the @attributes module. If an attribute
 * of a particular type is not available, the value for the type will be an empty array.
 */
export const getAvailableAttributesToShare = createSelector(
  [getCredShareDetails, getAttributes],
  ({ requestedAttributes }, attributes) =>
    requestedAttributes.reduce<AttrsState<AttributeI>>((acc, v) => {
      acc[v] = attributes[v] || []
      return acc
    }, {}),
)

/**
 * Gets all the available credentials for sharing. Returns an array of @ShareUICredential
 */
const getAvailableCredentialsToShare = createSelector(
  [getCredShareDetails, getAllCredentials],
  ({ requestedCredentials }, credentials) =>
    requestedCredentials.reduce<ShareUICredential[]>((acc, type) => {
      const creds = credentials.filter((cred) => cred.type === type)
      if (!creds.length) return acc
      acc = [...acc, ...creds.map(uiCredentialToShareCredential)]
      return acc
    }, []),
)

/**
 * Gets a boolean value that decides whether to use the @FASWrapper or @BASWrapper for the CredentialShare
 * interaction.
 */
export const getIsFullscreenCredShare = createSelector(
  [
    getCredShareDetails,
    getAvailableAttributesToShare,
    getAvailableCredentialsToShare,
  ],
  (details, shareAttributes, shareCredentials) => {
    const onlyAttributes =
      details.requestedAttributes.length && !details.requestedCredentials.length
    const isOnlyOneCredential =
      !details.requestedAttributes.length && shareCredentials.length === 1

    const numberOfFieldsDisplayed = Object.values(shareAttributes).reduce(
      (acc, v) => {
        if (v && !!v.length) {
          acc += v.length
        } else {
          acc += 1
        }
        return acc
      },
      0,
    )

    return onlyAttributes
      ? numberOfFieldsDisplayed > BP({ default: 3, xsmall: 2 })
      : isOnlyOneCredential
      ? false
      : true
  },
)

/**
 * Gets the first requested @ShareUIDocument, if available in the @credentials module.
 * Otherwise, returns @null.
 */
export const getFirstShareDocument = createSelector(
  [getCredShareDetails, getAllCredentials],
  ({ requestedCredentials }, credentials) => {
    const firstType = requestedCredentials[0]
    const firstCredential = credentials.find((c) => c.type === firstType)

    return firstCredential
      ? uiCredentialToShareCredential(firstCredential)
      : null
  },
)

/**
 * Gets the requested credential types for CredentialShare.
 */
export const getShareCredentialTypes = createSelector(
  [getCredShareDetails],
  ({ requestedAttributes, requestedCredentials }) => ({
    requestedAttributes,
    requestedCredentials,
  }),
)

/**
 * Gets the categorized @ShareUICredentials from the @credentials module
 * based on the @interactionDetails.
 */
export const getShareCredentialsBySection = createSelector(
  [getAvailableCredentialsToShare, getShareCredentialTypes],
  (shareCredentials, requestedCredTypes) => {
    const defaultSections = { documents: [], other: [] }

    return requestedCredTypes.requestedCredentials.reduce<ShareCredentialsBySection>(
      (acc, type) => {
        const credentials = shareCredentials.filter(
          (cred) => cred.type === type,
        )

        // NOTE: we assume the @renderAs property is the same for all credentials
        // of the same type
        const section = getCredentialSection(credentials[0])

        acc[section] = [
          ...acc[section],
          {
            type,
            credentials,
          },
        ]

        return acc
      },
      defaultSections,
    )
  },
)

/** CredentialOffer selectors **/

/**
 * Gets a boolean value that decides whether to use the @FASWrapper or @BASWrapper for the CredentialOffer
 * interaction.
 */
export const getIsFullscreenCredOffer = createSelector(
  [getCredOfferDetails],
  (details) => {
    const isOnlyOneCredential = details.credentials.service_issued.length === 1

    if (isOnlyOneCredential) {
      return false
    } else {
      return true
    }
  },
)

/**
 * Gets the categorized @OfferUICredentials from the @interactionDetails.
 */
export const getOfferCredentialsBySection = createSelector(
  [getCredOfferDetails],
  (details) => {
    const defaultSections = { documents: [], other: [] }

    // NOTE: will be moving away from the `credentials.service_issued` structure in favor of
    // just credentials, since during this flow we only receive "service issued" credentials
    // anyways
    return details.credentials.service_issued.reduce<
      CredentialsBySection<OfferUICredential>
    >((acc, cred) => {
      const section = getCredentialSection(cred)
      acc[section] = [...acc[section], cred]

      return acc
    }, defaultSections)
  },
)

/*
  Supportive selectors for components 
*/

export const getInteractionTitle = createSelector(
  [getInteractionDetails],
  (details) => {
    if (isAuthDetails(details)) {
      return strings.IS_IT_REALLY_YOU
    } else if (isAuthzDetails(details)) {
      return strings.WOULD_YOU_LIKE_TO_ACTION(details.action);
    } else if (isCredOfferDetails(details)) {
      return strings.INCOMING_OFFER
    } else if (isCredShareDetails(details)) {
      return strings.INCOMING_REQUEST
    } else {
      return strings.UNKNOWN_TITLE
    }
  }
)

export const getInteractionDescription = createSelector(
  [getInteractionDetails, getInteractionCounterparty],
  (details, counterparty) => {
    const { did, publicProfile } = counterparty;
    const counterpartyName = publicProfile?.name ?? ''
    const res = { isAnonymous: !Boolean(publicProfile?.name) }
    if (!Boolean(publicProfile?.name)) {
      return {
        ...res,
        description: strings.THIS_PUBLIC_PROFILE_CHOSE_TO_REMAIN_ANONYMOUS(did)
      }
    } else {
      if (isAuthDetails(details)) {
        return {
          ...res,
          description: strings.SERVICE_WOULD_LIKE_TO_CONFIRM_YOUR_DIGITAL_IDENTITY(counterpartyName),
        }
      } else if (isAuthzDetails(details)) {
        return {
          ...res,
          description: strings.SERVICE_IS_NOW_READY_TO_GRANT_YOU_ACCESS(counterpartyName)
        }
      } else if (isCredOfferDetails(details)) {
        return {
          ...res,
          description: strings.SERVICE_SENT_YOUR_WALLET_THE_FOLLOWING_DOCUMENTS(counterpartyName)
        }
      } else if (isCredShareDetails(details)) {
        return {
          ...res,
          description: strings.CHOOSE_ONE_OR_MORE_DOCUMETS_REQUESTED_BY_SERVICE_TO_PROCEED(counterpartyName)
        }
      } else {
        return {
          ...res,
          description: strings.UNKNOWN_DESCRIPTION
        }
      }
    }
  }
)

export const getInteractionImage = createSelector(
  [getInteractionDetails],
  (details) => {
    if (isAuthzDetails(details)) {
      return details.imageURL
    }
    return undefined;
  }
)
