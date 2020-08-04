import { RootReducerI } from '~/types/reducer'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { createSelector } from 'reselect'
import { AttrsState, AttributeI } from '../attributes/types'
import { IntermediaryState } from './types'
import { ServiceIssuedCredI } from '~/types/attributes'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

export const getInteractionId = (state: RootReducerI): string =>
  state.interaction.details.id
export const getInteractionType = (state: RootReducerI): FlowType | null =>
  state.interaction.details.flowType

export const getInteractionAttributes = (
  state: RootReducerI,
): AttrsState<AttributeI> => state.interaction.attributes
export const getSelectedAttributes = (
  state: RootReducerI,
): { [x: string]: string } => state.interaction.selectedAttributes

export const getIntermediaryState = (state: RootReducerI): any =>
  state.interaction.intermediaryState

export const getAttributeInputKey = (state: RootReducerI): any =>
  state.interaction.attributeInputKey

export const getCredentials = (state: RootReducerI): any =>
  state.interaction.details.credentials

export const getInteractionDescription = (state: RootReducerI): any =>
  state.interaction.details.description

export const getInteractionAction = (state: RootReducerI): any =>
  state.interaction.details.action

export const getInteractionDetails = (state: RootReducerI): any =>
  state.interaction.details

export const getIsFullScreenInteraction = createSelector(
  [getInteractionType, getIntermediaryState, getCredentials],
  (type, intermediaryState, credentials) => {
    if (
      intermediaryState !== IntermediaryState.absent ||
      type === FlowType.Authentication ||
      type === FlowType.Authorization
    ) {
      return false
    } else if (
      type === FlowType.CredentialShare &&
      credentials.self_issued.length &&
      !credentials.service_issued.length
    ) {
      return false
    } else if (
      type === FlowType.CredentialShare &&
      !credentials.self_issued.length &&
      credentials.service_issued.length === 1
    ) {
    } else if (
      type === FlowType.CredentialReceive &&
      credentials.service_issued.length === 1
    ) {
      return false
    } else {
      return true
    }
  },
)

export const getCredentialsBySection = createSelector(
  [getInteractionDetails],
  (details) => {
    return details.credentials.service_issued.reduce(
      (
        acc: { documents: ServiceIssuedCredI[]; other: ServiceIssuedCredI[] },
        v: ServiceIssuedCredI,
      ) => {
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
  },
)
