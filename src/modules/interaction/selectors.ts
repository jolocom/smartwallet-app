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
} from './guards'
import { createInteractionSelector } from './utils'
import { strings } from '~/translations/strings'

export const getIntermediaryState = (state: RootReducerI) =>
  state.interaction.intermediary

export const getAttributeInputKey = createSelector(
  [getIntermediaryState],
  (state) => {
    if (state.sheetState !== IntermediarySheetState.showing)
      throw new Error("Can't get inputType without an intermediarySheet")

    return state.attributeInputKey
  },
)

/**
 * Returns the @FlowType if there is an active interaction or null otherwise.
 */
export const getInteractionType = (state: RootReducerI) =>
  state.interaction.details.flowType

/**
 * Gets the interaction details from the @interactions module
 */
const getInteractionDetails = (state: RootReducerI): InteractionDetails =>
  state.interaction.details

export const getActiveInteraction = createSelector(
  [getInteractionDetails],
  (details) => {
    if (isNotActiveInteraction(details))
      throw new Error('Interaction is not present in the store')

    return details
  },
)

export const getAuthenticationDetails = createInteractionSelector(isAuthDetails)

export const getAuthorizationDetails = createInteractionSelector(isAuthzDetails)

export const getCredShareDetails = createInteractionSelector(isCredShareDetails)

export const getCredOfferDetails = createInteractionSelector(isCredOfferDetails)

export const getInteractionId = createSelector(
  [getActiveInteraction],
  ({ id }) => id,
)

export const getInteractionCounterparty = createSelector(
  [getActiveInteraction],
  ({ counterparty }) => counterparty,
)

export const getCounterpartyName = createSelector(
  [getActiveInteraction],
  ({ counterparty }) => counterparty.publicProfile?.name ?? strings.SERVICE,
)

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
 * Contains the logic that decides whether we need to show a full-screen ActionSheet (FAS)
 * or a bottom ActionSheet (BAS).
 */
export const getIsFullScreenInteraction = createSelector(
  [
    getInteractionDetails,
    getAvailableAttributesToShare,
    getAvailableCredentialsToShare,
  ],
  (details, shareAttributes, shareCredentials) => {
    if (isAuthDetails(details) || isAuthzDetails(details)) {
      return false
    } else if (
      isCredShareDetails(details) &&
      details.requestedAttributes.length &&
      !details.requestedCredentials.length
    ) {
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
    } else if (
      isCredShareDetails(details) &&
      !details.requestedAttributes.length &&
      shareCredentials.length === 1
    ) {
      return false
    } else if (
      isCredOfferDetails(details) &&
      details.credentials.service_issued.length === 1
    ) {
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
  [getInteractionDetails],
  (details) => {
    const defaultSections = { documents: [], other: [] }

    if (isCredOfferDetails(details)) {
      return details.credentials.service_issued.reduce<
        CredentialsBySection<OfferUICredential>
      >((acc, cred) => {
        const section = getCredentialSection(cred)
        acc[section] = [...acc[section], cred]

        return acc
      }, defaultSections)
    }

    return defaultSections
  },
)

/**
 * Gets the first requested @ShareUIDocument, if available in the @credentials module.
 * Otherwise, returns @null.
 */
export const getFirstShareDocument = createSelector(
  [getInteractionDetails, getAllCredentials],
  (details, credentials) => {
    if (isCredShareDetails(details)) {
      const firstType = details.requestedCredentials[0]
      const firstCredential = credentials.find((c) => c.type === firstType)

      return firstCredential
        ? uiCredentialToShareCredential(firstCredential)
        : null
    }

    return null
  },
)

/**
 * Gets the requested credential types for CredentialShare.
 */
export const getShareCredentialTypes = createSelector(
  [getInteractionDetails],
  (details) => {
    if (isCredShareDetails(details)) {
      // return details.credentials
      const { requestedAttributes, requestedCredentials } = details
      return { requestedAttributes, requestedCredentials }
    }

    return { requestedAttributes: [], requestedCredentials: [] }
  },
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
