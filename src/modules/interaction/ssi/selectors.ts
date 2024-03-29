import { createSelector } from 'reselect'

import { attributeConfig } from '~/config/claims'
import { Document } from '~/hooks/documents/types'
import { AttributeI } from '~/modules/attributes/types'
import { AttributeTypes, CredentialsByType } from '~/types/credentials'
import { RootReducerI } from '~/types/reducer'
import BP from '~/utils/breakpoints'
import { getCounterpartyName } from '~/utils/dataMapping'
import { getObjectFirstValue } from '~/utils/objectUtils'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
  isNotActiveInteraction,
} from './guards'
import { InteractionDetails } from './types'

const makeInteractionSelector = <T extends InteractionDetails>(
  guard: (ssi: InteractionDetails) => ssi is T,
) =>
  createSelector([getActiveInteraction], (ssi) => {
    if (!guard(ssi)) throw new Error('Wrong interaction ssi')

    return ssi
  })

/**
 * Gets the @FlowType if there is an active interaction or null otherwise.
 */
export const getInteractionType = (state: RootReducerI) =>
  state.interaction.ssi.flowType

/**
 * Gets the interaction ssi from the @interactions module.
 *
 * NOTE: Not type safe. Generally the interaction specific selector (e.g. getAuthenticationDetails, etc.)
 *       should be used.
 */
const getInteractionDetails = (state: RootReducerI): InteractionDetails =>
  state.interaction.ssi

/**
 * Gets the @interactionDetails if there is an active interaction, otherwise throws.
 */
export const getActiveInteraction = createSelector(
  [getInteractionDetails],
  (ssi) => {
    if (isNotActiveInteraction(ssi))
      throw new Error('Interaction is not present in the store')

    return ssi
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
 * Gets the @counterparty's name, with the truncated DID as a fallback
 */
export const getInteractionCounterpartyName = createSelector(
  [getInteractionCounterparty],
  getCounterpartyName,
)

/**
 * Gets the @interactionDetails for each type of interaction. Can only be used within the specific interaction
 * components, otherwise will throw (e.g. using @getAuthenticationDetails inside @BasWrapper will throw).
 */
export const getAuthenticationDetails = makeInteractionSelector(isAuthDetails)
export const getAuthorizationDetails = makeInteractionSelector(isAuthzDetails)
export const getCredShareDetails = makeInteractionSelector(isCredShareDetails)
export const getCredOfferDetails = makeInteractionSelector(isCredOfferDetails)

/** CredentialShare selectors **/

/**
 * Gets the mapping of all selected credentials (attributes + documents)
 */
export const getSelectedShareCredentials = createSelector(
  [getCredShareDetails],
  ({ selectedCredentials }) => selectedCredentials,
)

export const getRequestedAttributes = createSelector(
  [getCredShareDetails],
  (ssi) => {
    const { requestedTypes, attributes } = ssi
    // NOTE: sorting the requested types according to the order from the @AttributeConfig
    const sortedRequestedTypes = Object.keys(attributeConfig).filter((type) =>
      requestedTypes.includes(type),
    )
    const updatedAttributes = sortedRequestedTypes.reduce<
      Partial<Record<AttributeTypes, AttributeI[]>>
    >((attrs, t) => {
      // add missing attribute
      if (Object.values(AttributeTypes).includes(t)) {
        const type = t as AttributeTypes
        attrs[type] = Object.keys(attributes).includes(t)
          ? attributes[type]
          : []
      }
      return attrs
    }, {})
    return updatedAttributes
  },
)

export const getRequestedCredentials = createSelector(
  [getCredShareDetails],
  (ssi) => ssi.credentials,
)

/**
 * Gets a boolean value that decides whether to use the @FASWrapper or @BASWrapper for the CredentialShare
 * interaction.
 */
export const getIsFullscreenCredShare = createSelector(
  [getRequestedAttributes, getRequestedCredentials],
  (attributes, credentials) => {
    const onlyAttributes = Object.keys(attributes).length && !credentials.length
    const isOnlyOneCredential =
      !Object.keys(attributes).length && credentials.length === 1

    const numberOfFieldsDisplayed = Object.values(attributes).reduce(
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

export const getRequestedDocumentsByType = createSelector(
  [getRequestedCredentials],
  (requestedDocuments) => {
    return requestedDocuments.reduce<Array<CredentialsByType<Document>>>(
      (acc, document) => {
        const specificType = document.type[document.type.length - 1]
        const typeObject = acc.find((t) => t.value === specificType)

        if (!typeObject) {
          acc = [
            ...acc,
            { key: 'type', value: specificType, credentials: [document] },
          ]
        } else {
          typeObject.credentials.push(document)
          acc = acc.filter((t) => t.value !== specificType)
          acc = [...acc, typeObject]
        }

        return acc
      },
      [],
    )
  },
)

const getSingleRequestedAttribute = createSelector(
  [getRequestedAttributes, getRequestedCredentials],
  (attributes, credentials) => {
    if (Object.keys(attributes).length === 1 && credentials.length === 0) {
      return attributes
    }
  },
)

const getSingleRequestedCredential = createSelector(
  [getCredShareDetails],
  (ssi) => {
    const { attributes, credentials } = ssi
    if (Object.keys(attributes).length === 0 && credentials.length === 1) {
      return credentials[0]
    }
    return undefined
  },
)

export const getIsReadyToSubmitRequest = createSelector(
  [getCredShareDetails, getSingleRequestedAttribute],
  (ssi, singleAttribute) => {
    if (singleAttribute && !getObjectFirstValue(singleAttribute).length)
      return true
    return ssi.requestedTypes.every((c) => ssi.selectedCredentials[c])
  },
)

export const getRequestedCredentialDetailsBAS = createSelector(
  [getSingleRequestedAttribute, getSingleRequestedCredential],
  (singleRequestedAttribute, singleRequestedCredential) => ({
    singleRequestedAttribute,
    singleRequestedCredential,
  }),
)

/** CredentialOffer selectors **/

/**
 * Gets a boolean value that decides whether to use the @FASWrapper or @BASWrapper for the CredentialOffer
 * interaction.
 */
export const getIsFullscreenCredOffer = createSelector(
  [getCredOfferDetails],
  (ssi) => {
    const isOnlyOneCredential = ssi.credentials.service_issued.length === 1

    if (isOnlyOneCredential) {
      return false
    } else {
      return true
    }
  },
)

export const getOfferedCredentials = createSelector(
  [getCredOfferDetails],
  (ssi) => ssi.credentials.service_issued,
)

export const getServiceDescription = createSelector(
  [getInteractionCounterparty],
  (counterparty) => {
    return {
      did: counterparty.did,
      name: counterparty.publicProfile?.name,
      image: counterparty.publicProfile?.image,
      serviceUrl: counterparty.publicProfile?.url,
      isAnonymous: counterparty.publicProfile === undefined,
    }
  },
)

export const getAuthzUIDetails = createSelector(
  [getAuthorizationDetails],
  (ssi) => {
    const { flowType, ...rest } = ssi
    return {
      ...rest,
    }
  },
)
