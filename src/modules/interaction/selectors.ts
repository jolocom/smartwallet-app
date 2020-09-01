import { RootReducerI } from '~/types/reducer'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { createSelector } from 'reselect'
import { AttrsState, AttributeI } from '../attributes/types'
import {
  IntermediaryState,
  CredOfferI,
  InteractionCredentialsBySection,
  InteractionDetails,
  AuthorizationDetailsI,
  AuthenticationDetailsI,
  CredShareI,
  SelectedAttributesT,
} from './types'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { IdentitySummary } from '@jolocom/sdk/js/src/lib/types'

export function isAuthDetails(
  details: InteractionDetails,
): details is AuthenticationDetailsI {
  return details.flowType === FlowType.Authentication
}
export function isAuthzDetails(
  details: InteractionDetails,
): details is AuthorizationDetailsI {
  return details.flowType === FlowType.Authorization
}
export function isCredOfferDetails(
  details: InteractionDetails,
): details is CredOfferI {
  return details.flowType === FlowType.CredentialOffer
}
export function isCredShareDetails(
  details: InteractionDetails,
): details is CredShareI {
  return details.flowType === FlowType.CredentialShare
}
export function isNotActiveInteraction(
  details: InteractionDetails,
): details is { flowType: null } {
  return details.flowType === null
}

export const getInteractionAttributes = (
  state: RootReducerI,
): AttrsState<AttributeI> => state.interaction.attributes

//FIXME: Must fix the types, or re-structure the module
export const getSelectedAttributes = (
  state: RootReducerI,
): SelectedAttributesT => state.interaction.selectedAttributes

export const getIntermediaryState = (state: RootReducerI) =>
  state.interaction.intermediaryState

export const getAttributeInputKey = (state: RootReducerI) =>
  state.interaction.attributeInputKey

export const getCredentials = (state: RootReducerI) => {
  if (!isNotActiveInteraction(state.interaction.details)) {
    return state.interaction.details.credentials
  }
}

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

export const getAttributesToShare = (state: RootReducerI): any =>
  state.interaction.attributesToShare

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

export const getIsFullScreenInteraction = createSelector(
  [getIntermediaryState, getInteractionDetails],
  (intermediaryState, details) => {
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

export const getCredentialsBySection = createSelector<
  RootReducerI,
  InteractionDetails,
  InteractionCredentialsBySection
>([getInteractionDetails], (details) => {
  if (isCredOfferDetails(details)) {
    return details.credentials.service_issued.reduce<
      InteractionCredentialsBySection
    >(
      (acc, v) => {
        if (
          v.renderInfo &&
          v.renderInfo.renderAs === CredentialRenderTypes.document
        ) {
          acc.documents = [...acc.documents, v]
        } else {
          acc.other = [...acc.other, v]
        }
        return acc
      },
      { documents: [], other: [] },
    )
  }
  return { documents: [], other: [] }
})
