import { RootReducerI } from '~/types/reducer'
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { createSelector } from 'reselect'
import { AttrsState, AttributeI } from '../attributes/types'
import { IntermediaryState, CredReceiveI, CredShareI } from './types'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { IdentitySummary } from '@jolocom/sdk/js/src/lib/types'
import { getAllCredentials } from '../credentials/selectors'
import {
  UICredential,
  CredentialsBySection,
  ServiceIssuedCredI,
  ShareCredentialsBySection,
} from '~/types/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { uiCredentialToShareCredential } from '~/utils/dataMapping'
import { getCredentialSection } from '~/utils/credentialsBySection'

export const getInteractionAttributes = (
  state: RootReducerI,
): AttrsState<AttributeI> => state.interaction.attributes

//FIXME: Must fix the types, or re-structure the module
export const getSelectedAttributes = (
  state: RootReducerI,
): { [x: string]: string } => state.interaction.selectedAttributes

export const getIntermediaryState = (state: RootReducerI): any =>
  state.interaction.intermediaryState

export const getAttributeInputKey = (state: RootReducerI): any =>
  state.interaction.attributeInputKey

export const getInteractionCredentials = (state: RootReducerI): any =>
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

export const getAttributesToShare = (state: RootReducerI): any =>
  state.interaction.attributesToShare

export const getServiceIssuedCreds = (state: RootReducerI): any =>
  state.interaction.details.credentials
    ? state.interaction.details.credentials.service_issued
    : []

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
  CredentialsBySection<ServiceIssuedCredI>
>([getInteractionDetails], (details) =>
  details.credentials.service_issued.reduce<
    CredentialsBySection<ServiceIssuedCredI>
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
