import { createSelector } from 'reselect'

import { RootReducerI } from '~/types/reducer'
import {
  attrTypeToAttrKey,
  CredentialsBySection,
  OfferUICredential,
  ShareCredentialsBySection,
  ShareUICredential,
} from '~/types/credentials'
import { AttributeI } from '~/modules/attributes/types'
import { getAttributes } from '~/modules/attributes/selectors'
import { getAllCredentials } from '~/modules/credentials/selectors'
import { uiCredentialToShareCredential } from '~/utils/dataMapping'
import { getCredentialSection } from '~/utils/credentialsBySection'
import { InteractionDetails, IntermediarySheetState } from './types'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
  isNotActiveInteraction,
  isResolutionDetails,
} from './guards'
import { createInteractionSelector } from './utils'
import { strings } from '~/translations/strings'

/**
 * Gets the @IntermediaryState of the @IntermediarySheet
 */
export const getIntermediaryState = (state: RootReducerI) =>
  state.interaction.intermediary

/**
 * Gets the Attribute Type that has to be created on the @IntermediarySheet. Can only
 * be used while there is an active (@showing) @IntermediarySheet
 */
export const getAttributeInputKey = createSelector(
  [getIntermediaryState],
  (state) => {
    if (state.sheetState !== IntermediarySheetState.showing)
      throw new Error("Can't get inputType without an intermediarySheet")

    return state.attributeInputKey
  },
)

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
    requestedAttributes.reduce<Record<string, AttributeI[]>>((acc, v) => {
      const value = attrTypeToAttrKey(v)
      if (!value) return acc
      acc[value] = attributes[value] || []
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

    if (onlyAttributes) {
      const availableAttributes = Object.values(shareAttributes).reduce<
        AttributeI[]
      >((acc, arr) => {
        if (!arr) return acc
        return acc.concat(arr)
      }, [])

      //TODO: add breakpoints
      return (
        availableAttributes.length > 3 || details.requestedAttributes.length > 2
      )
    } else if (isOnlyOneCredential) {
      return false
    } else {
      return true
    }
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

    return requestedCredTypes.requestedCredentials.reduce<
      ShareCredentialsBySection
    >((acc, type) => {
      const credentials = shareCredentials.filter((cred) => cred.type === type)

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
    }, defaultSections)
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
