import { createSelector } from 'reselect'

import { IdentitySummary } from '@jolocom/sdk/js/src/lib/types'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

import { RootReducerI } from '~/types/reducer'
import {
  CredentialsBySection,
  OfferUICredential,
  ShareCredentialsBySection,
  attrTypeToAttrKey,
} from '~/types/credentials'
import { AttributeI } from '~/modules/attributes/types'
import { getAttributes } from '~/modules/attributes/selectors'
import { getAllCredentials } from '~/modules/credentials/selectors'
import { uiCredentialToShareCredential } from '~/utils/dataMapping'
import { getCredentialSection } from '~/utils/credentialsBySection'
import { IntermediaryState, InteractionDetails } from './types'
import {
  isNotActiveInteraction,
  isCredOfferDetails,
  isCredShareDetails,
  isAuthDetails,
  isAuthzDetails,
} from './guards'

export const getSelectedShareCredentials = (
  state: RootReducerI,
): { [x: string]: string } => state.interaction.selectedShareCredentials

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

export const getInteractionDetails = (
  state: RootReducerI,
): InteractionDetails => state.interaction.details

export const getServiceIssuedCreds = (state: RootReducerI): any => {
  if (
    (isCredOfferDetails(state.interaction.details) ||
      isCredShareDetails(state.interaction.details)) &&
    !isNotActiveInteraction(state.interaction.details)
  ) {
    return state.interaction.details.credentials.service_issued
  }
  return []
}

export const getShareAttributes = createSelector(
  [getAttributes, getInteractionDetails],
  (attributes, shareDetails) => {
    if (isCredShareDetails(shareDetails)) {
      const {
        credentials: { self_issued: requestedAttributes },
      } = shareDetails

      const interactionAttributues = !requestedAttributes.length
        ? {}
        : requestedAttributes.reduce<{
            [key: string]: AttributeI[]
          }>((acc, v) => {
            const value = attrTypeToAttrKey(v)
            acc[value] = attributes[value] || []
            return acc
          }, {})

      return interactionAttributues
    }
    return {}
  },
)

export const getIsFullScreenInteraction = createSelector(
  [getIntermediaryState, getShareAttributes, getInteractionDetails],
  (intermediaryState, shareAttributes, details) => {
    if (
      intermediaryState !== IntermediaryState.absent ||
      isAuthDetails(details) ||
      isAuthzDetails(details)
    ) {
      return false
    } else if (
      isCredShareDetails(details) &&
      details.credentials.self_issued.length &&
      !details.credentials.service_issued.length
    ) {
      const availableAttributes = Object.values(shareAttributes).reduce<
        AttributeI[]
      >((acc, arr) => {
        if (!arr) return acc
        return acc.concat(arr)
      }, [])

      //TODO: add breakpoints
      if (availableAttributes.length > 3) {
        return true
      }
      return false
    } else if (
      isCredShareDetails(details) &&
      !details.credentials.self_issued.length &&
      details.credentials.service_issued.length === 1
    ) {
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

export const getFirstShareDocument = createSelector(
  [getInteractionDetails, getAllCredentials],
  (details, credentials) => {
    if (isCredShareDetails(details)) {
      const firstType = details.credentials.service_issued[0]
      const firstCredential = credentials.find((c) => c.type === firstType)

      return firstCredential
        ? uiCredentialToShareCredential(firstCredential)
        : null
    }

    return null
  },
)

export const getShareCredentialsBySection = createSelector(
  [getInteractionDetails, getAllCredentials],
  (details, credentials) => {
    const defaultSections = { documents: [], other: [] }

    if (isCredShareDetails(details)) {
      return details.credentials.service_issued.reduce<
        ShareCredentialsBySection
      >((acc, type) => {
        const creds = credentials.filter((cred) => cred.type === type)
        if (!creds.length) return acc

        // NOTE: we assume the @renderAs property is the same for all credentials
        // of the same type
        const section = getCredentialSection(creds[0])

        // TODO?: move @uiCredentialToShareCredential to @mapCredShareData when the interaction starts,
        // in order to store the proper credentials in the store instead of the types.
        acc[section] = [
          ...acc[section],
          {
            type,
            credentials: creds.map(uiCredentialToShareCredential),
          },
        ]

        return acc
      }, defaultSections)
    }

    return defaultSections
  },
)
