import { createSelector } from 'reselect'

import { RootReducerI } from '~/types/reducer'
import {
  AttributeTypes,
  CredentialsBySection,
  OfferUICredential,
  ShareCredentialsBySection,
  ShareUICredential,
} from '~/types/credentials'
import { AttributeI, AttrsState } from '~/modules/attributes/types'
import { getAttributes } from '~/modules/attributes/selectors'
import { getAllCredentials } from '~/modules/credentials/selectors'
import { uiCredentialToShareCredential } from '~/utils/dataMapping'
import { getCredentialSection } from '~/utils/credentialsBySection'
import { InteractionDetails } from './types'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
  isNotActiveInteraction,
} from './guards'
import BP from '~/utils/breakpoints'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'

const createInteractionSelector = <T extends InteractionDetails>(
  guard: (details: InteractionDetails) => details is T,
) =>
  createSelector([getActiveInteraction], (details) => {
    if (!guard(details)) throw new Error('Wrong interaction details')

    return details
  })

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
 * Gets the @interactionDetails for each type of interaction. Can only be used within the specific interaction
 * components, otherwise will throw (e.g. using @getAuthenticationDetails inside @BasWrapper will throw).
 */
export const getAuthenticationDetails = createInteractionSelector(isAuthDetails)
export const getAuthorizationDetails = createInteractionSelector(isAuthzDetails)
export const getCredShareDetails = createInteractionSelector(isCredShareDetails)
export const getCredOfferDetails = createInteractionSelector(isCredOfferDetails)

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
    requestedAttributes.reduce<Partial<AttrsState<AttributeI>>>((acc, v) => {
      acc[v] = attributes[v] || []
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

    const numberOfFieldsDisplayed = Object.values(shareAttributes).reduce(
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

    return requestedCredTypes.requestedCredentials.reduce<ShareCredentialsBySection>(
      (acc, type) => {
        const credentials = shareCredentials.filter(
          (cred) => cred.type === type,
        )

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
      },
      defaultSections,
    )
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

export const getServiceImage = createSelector(
  [getInteractionCounterparty],
  (counterparty) => {
    return counterparty.publicProfile?.image
  },
)

export const getServiceDescription = createSelector(
  [getInteractionCounterparty],
  (counterparty) => {
    return {
      did: counterparty.did,
      name: counterparty.publicProfile?.name,
      isAnonymous: counterparty.publicProfile === undefined,
    }
  },
)

export const getSingleMissingAttribute = createSelector(
  [getInteractionDetails, getAttributes],
  (details, attributes) => {
    if (isCredShareDetails(details)) {
      const { requestedAttributes, requestedCredentials } = details
      if (
        requestedAttributes.length === 1 &&
        requestedCredentials.length === 0 &&
        !attributes[requestedAttributes[0]]
      ) {
        return requestedAttributes[0]
      }
    }
    return undefined
  },
)

export const getSingleCredentialToShare = createSelector(
  [getCredShareDetails, getAllCredentials],
  (details, credentials) => {
    const { requestedAttributes, requestedCredentials } = details
    if (requestedAttributes.length === 0 && requestedCredentials.length === 1) {
      const availableCreds = credentials.filter(
        (c) => c.type === requestedCredentials[0],
      )
      if (availableCreds.length === 1) {
        return availableCreds[0]
      }
    }
    return undefined
  },
)

export const getIsReadyToSubmitRequest = createSelector(
  [
    getCredShareDetails,
    getAvailableAttributesToShare,
    getSelectedShareCredentials,
    getSingleMissingAttribute,
  ],
  (details, attributes, selectedShareCredentials, singleMissingAttribute) => {
    if (singleMissingAttribute !== undefined) return true
    if (Object.keys(selectedShareCredentials).length) {
      const { requestedCredentials } = details
      const allAttributes = Object.keys(attributes).every((t) =>
        Object.keys(selectedShareCredentials).includes(t),
      )

      const allCredentials = requestedCredentials.every((t) =>
        Object.keys(selectedShareCredentials).includes(t),
      )

      return allAttributes && allCredentials
    }

    return false
  },
)

export const getAttributesToSelect = createSelector(
  [getAvailableAttributesToShare],
  (attributes) => {
    return Object.keys(attributes).reduce<Record<string, string>>(
      (acc, value) => {
        const attrType = value as AttributeTypes
        if (!acc[attrType]) {
          const attr = attributes[attrType] || []
          if (attr.length) {
            acc[attrType] = attr[0].id
          }
        }
        return acc
      },
      {},
    )
  },
)

export const getAuthzUIDetails = createSelector(
  [getAuthorizationDetails],
  (details) => {
    const { flowType, ...rest } = details
    return {
      ...rest,
    }
  },
)

export const getCredShareUIDetailsBAS = createSelector(
  [
    getSingleMissingAttribute,
    getSingleCredentialToShare,
    getIsReadyToSubmitRequest,
  ],
  (singleMissingAttribute, singleCredential) => ({
    singleMissingAttribute,
    singleCredential,
  }),
)

export const getCredByType = createSelector(
  [getCredOfferDetails],
  (details) => {
    const {
      credentials: { service_issued },
    } = details
    return service_issued.reduce<
      Record<string, CredentialRenderTypes.document | 'other'>
    >((credByType, c) => {
      credByType[c.type] =
        c.renderInfo?.renderAs === CredentialRenderTypes.document
          ? c.renderInfo?.renderAs
          : 'other'
      return credByType
    }, {})
  },
)
