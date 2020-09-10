import { createSelector } from 'reselect'

import { IdentitySummary } from '@jolocom/sdk/js/src/lib/types'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

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
import { InteractionDetails, IntermediaryState } from './types'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
  isNotActiveInteraction,
} from './guards'

export const getIntermediaryState = (state: RootReducerI) =>
  state.interaction.intermediaryState

export const getAttributeInputKey = (state: RootReducerI) =>
  state.interaction.attributeInputKey

export const getInteractionId = (state: RootReducerI): string | undefined => {
  if (!isNotActiveInteraction(state.interaction.details)) {
    return state.interaction.details.id
  }
}

export const getInteractionType = (state: RootReducerI): FlowType | null =>
  state.interaction.details.flowType

export const getInteractionCounterparty = (
  state: RootReducerI,
): IdentitySummary | undefined => {
  if (!isNotActiveInteraction(state.interaction.details)) {
    return state.interaction.details.counterparty
  }
}

/**
 * Gets the mapping of all selected credentials (attributes + documents)
 */
export const getSelectedRequestedCredentialsAtrributes = (
  state: RootReducerI,
) => {
  if (isCredShareDetails(state.interaction.details)) {
    return state.interaction.details.selectedRequestedCredentialsAttributes
  }
}

/**
 * Gets the interaction details from the @interactions module
 */
export const getInteractionDetails = (
  state: RootReducerI,
): InteractionDetails => state.interaction.details

/**
 * Gets the available requested attributes from the @attributes module. If an attribute
 * of a particular type is not available, the value for the type will be an empty array.
 */
export const getShareAttributes = createSelector(
  [getAttributes, getInteractionDetails],
  (attributes, shareDetails) => {
    if (isCredShareDetails(shareDetails)) {
      const { requestedAttributes } = shareDetails

      return requestedAttributes.reduce<Record<string, AttributeI[]>>(
        (acc, v) => {
          const value = attrTypeToAttrKey(v)
          if (!value) return acc
          acc[value] = attributes[value] || []
          return acc
        },
        {},
      )
    }
    return {}
  },
)

/**
 * Gets all the available credentials for sharing. Returns an array of @ShareUICredential
 */
const getShareCredentials = createSelector(
  [getInteractionDetails, getAllCredentials],
  (details, credentials) => {
    if (isCredShareDetails(details)) {
      return details.requestedCredentials.reduce<ShareUICredential[]>(
        (acc, type) => {
          const creds = credentials.filter((cred) => cred.type === type)
          if (!creds.length) return acc
          acc = [...acc, ...creds.map(uiCredentialToShareCredential)]
          return acc
        },
        [],
      )
    }
    return []
  },
)

/**
 * Contains the logic that decides whether we need to show a full-screen ActionSheet (FAS)
 * or a bottom ActionSheet (BAS).
 */
export const getIsFullScreenInteraction = createSelector(
  [getShareAttributes, getInteractionDetails, getShareCredentials],
  (shareAttributes, details, shareCredentials) => {
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
      return availableAttributes.length > 3
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
  [getShareCredentials, getShareCredentialTypes],
  (shareCredentials, rrequestedCredTypes) => {
    const defaultSections = { documents: [], other: [] }

    return rrequestedCredTypes.requestedCredentials.reduce<
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
