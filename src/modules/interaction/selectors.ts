import { RootReducerI } from '~/types/reducer'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { createSelector } from 'reselect'
import { AttrsState, AttributeI } from '../attributes/types'
import { IntermediaryState, CredReceiveI, CredShareI } from './types'
import { IdentitySummary } from '@jolocom/sdk/js/src/lib/types'
import { getAllCredentials } from '../credentials/selectors'
import {
  UICredential,
  CredentialsBySection,
  OfferUICredential,
  ShareCredentialsBySection,
} from '~/types/credentials'
import { uiCredentialToShareCredential } from '~/utils/dataMapping'
import { getCredentialSection } from '~/utils/credentialsBySection'

export const getAvailablaAttributesToShare = (
  state: RootReducerI,
): AttrsState<AttributeI> => state.interaction.availableAttributesToShare

//FIXME: Must fix the types, or re-structure the module
export const getSelectedAttributes = (
  state: RootReducerI,
): { [x: string]: string } => state.interaction.selectedAttributes

export const getIntermediaryState = (state: RootReducerI) =>
  state.interaction.intermediaryState

export const getAttributeInputKey = (state: RootReducerI) =>
  state.interaction.attributeInputKey

export const getInteractionCredentials = (state: RootReducerI) =>
  state.interaction.details.credentials

export const getInteractionId = (state: RootReducerI): string =>
  state.interaction.details.id

export const getInteractionType = (state: RootReducerI): FlowType | null =>
  state.interaction.details.flowType

export const getInteractionCounterparty = (
  state: RootReducerI,
): IdentitySummary => state.interaction.details.counterparty

export const getInteractionDetails = <T>(state: RootReducerI): T =>
  state.interaction.details

export const getServiceIssuedCreds = (state: RootReducerI) =>
  state.interaction.details.credentials
    ? state.interaction.details.credentials.service_issued
    : []

export const getIsFullScreenInteraction = createSelector(
  [getInteractionType, getIntermediaryState, getInteractionCredentials],
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
      type === FlowType.CredentialOffer &&
      credentials.service_issued.length === 1
    ) {
      return false
    } else {
      return true
    }
  },
)

export const getOfferCredentialsBySection = createSelector<
  RootReducerI,
  CredReceiveI,
  CredentialsBySection<OfferUICredential>
>([getInteractionDetails], (details) =>
  details.credentials.service_issued.reduce<
    CredentialsBySection<OfferUICredential>
  >(
    (acc, cred) => {
      const section = getCredentialSection(cred)
      acc[section] = [...acc[section], cred]

      return acc
    },
    { documents: [], other: [] },
  ),
)

export const getShareCredentialsBySection = createSelector<
  RootReducerI,
  CredShareI,
  UICredential[],
  ShareCredentialsBySection
>([getInteractionDetails, getAllCredentials], (details, credentials) => {
  return details.credentials.service_issued.reduce<ShareCredentialsBySection>(
    (acc, type) => {
      const creds = credentials.filter((cred) => cred.type === type)

      if (!creds.length) {
        acc.missingTypes.push(type)
        return acc
      }

      // NOTE: we assume the @renderAs property is the same for all credentials
      // of the same type
      const section = getCredentialSection(creds[0])

      // TODO: move @uiCredentialToShareCredential to @mapCredShareData when the interaction starts,
      // in order to store the proper credentials in the store instead of the types.
      acc[section] = [
        ...acc[section],
        creds.length === 1
          ? uiCredentialToShareCredential(creds[0])
          : {
              type,
              credentials: creds.map(uiCredentialToShareCredential),
            },
      ]

      return acc
    },
    { documents: [], other: [], missingTypes: [] },
  )
})
