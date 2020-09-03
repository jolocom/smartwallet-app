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
  ShareUICredential,
  attrTypeToAttrKey,
  AttrKeys,
} from '~/types/credentials'
import { uiCredentialToShareCredential } from '~/utils/dataMapping'
import { getCredentialSection } from '~/utils/credentialsBySection'
import { getAttributes } from '../attributes/selectors'

export const getAvailablaAttributesToShare = (
  state: RootReducerI,
): AttrsState<AttributeI> => state.interaction.availableAttributesToShare

//FIXME: Must fix the types, or re-structure the module
export const getSelectedShareCredentials = (
  state: RootReducerI,
): { [x: string]: string } => state.interaction.selectedShareCredentials

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

export const getShareAttributes = createSelector<
  RootReducerI,
  AttrsState<AttributeI>,
  CredShareI,
  AttrsState<AttributeI>
>([getAttributes, getInteractionDetails], (attributes, shareDetails) => {
  //FIXME @clauxx If we have to do this, then the pattern we're using is bad
  if (!shareDetails.credentials) return {}

  const {
    credentials: { self_issued: requestedAttributes },
  } = shareDetails
  //FIXME @clauxx If we have to do this, then the pattern we're using is bad
  if (!requestedAttributes) return {}

  const interactionAttributues = !requestedAttributes.length
    ? {}
    : requestedAttributes.reduce<{
        [key: string]: AttributeI[]
      }>((acc, v) => {
        //FIXME type assertion
        const value = attrTypeToAttrKey(v) as AttrKeys
        acc[value] = attributes[value] || []
        return acc
      }, {})

  return interactionAttributues
})

export const getIsFullScreenInteraction = createSelector(
  [
    getInteractionType,
    getIntermediaryState,
    getInteractionCredentials,
    getShareAttributes,
  ],
  (type, intermediaryState, credentials, shareAttributes) => {
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
      const availableAttributes = Object.values(shareAttributes).reduce<
        AttributeI[]
      >((acc, arr) => {
        if (!arr) return acc
        return acc.concat(arr)
      }, [])

      //TODO: add breakpoints
      if (availableAttributes.length > 6) {
        return true
      }
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
    },
    { documents: [], other: [] },
  )
})
