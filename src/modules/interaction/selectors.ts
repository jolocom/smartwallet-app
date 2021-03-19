import { createSelector } from 'reselect'

import { RootReducerI } from '~/types/reducer'
import {
  AttributeTypes,
  CredentialsByCategory,
  DisplayCredential,
  OfferedCredential,
  OtherCategory,
  RequestedCredentialsByCategoryByType,
} from '~/types/credentials'
import { AttributeI, AttrsState } from '~/modules/attributes/types'
import { getAttributes } from '~/modules/attributes/selectors'
import { getAllCredentials } from '~/modules/credentials/selectors'
// TODO: rename the file
import { getCredentialCategory } from '~/utils/credentialsBySection'
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

const makeInteractionSelector = <T extends InteractionDetails>(
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

/**
 * Gets the available requested attributes from the @attributes module. If an attribute
 * of a particular type is not available, the value for the type will be an empty array.
 */
export const getAvailableRequestedAttributes = createSelector(
  [getCredShareDetails, getAttributes],
  ({ requestedAttributes }, attributes) =>
    requestedAttributes.reduce<AttrsState<AttributeI>>((acc, v) => {
      acc[v] = attributes[v] || []
      return acc
    }, {}),
)

/**
 * Gets all available requested credentials. 
 */
const getAvailableRequestedCredentials = createSelector(
  [getCredShareDetails, getAllCredentials],
  ({ requestedCredentials }, credentials) =>
    requestedCredentials.reduce<DisplayCredential[]>((acc, type) => {
      const credentialsOfType = credentials.filter((cred) => cred.type[1] === type)
      if (!credentialsOfType.length) return acc
      acc = [...acc, ...credentialsOfType]
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
    getAvailableRequestedAttributes,
    getAvailableRequestedCredentials,
  ],
  (details, shareAttributes, availableRequestedCredentials) => {
    const onlyAttributes =
      details.requestedAttributes.length && !details.requestedCredentials.length
    const isOnlyOneCredential =
      !details.requestedAttributes.length && availableRequestedCredentials.length === 1

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
  * Getting requested credentials by type and category  
  * @category used to separate into Documents and Other
  * @type used to group credentials by type and present them in a carousel
*/
export const getRequestedCredentialsByCategoryByType = createSelector(
  [getAvailableRequestedCredentials, getCredShareDetails],
  (availableRequestedCredentials, {requestedCredentials}) => {
    return requestedCredentials.reduce<RequestedCredentialsByCategoryByType<DisplayCredential>>(
      (acc, type) => {
        const credentials = availableRequestedCredentials.filter(
          (cred) => cred.type[1] === type,
        )

        // NOTE: we assume the category property is the same for all credentials
        // of the same type
        const section = getCredentialCategory(credentials[0])

        acc[section] = [
          ...acc[section],
          {
            type,
            credentials,
          },
        ]

        return acc
      },
      {[CredentialRenderTypes.document]: [], [OtherCategory.other]: []},
    )
  },
)

const getSingleRequestedAttribute = createSelector(
  [getCredShareDetails, getAttributes],
  (details, attributes) => {
    const { requestedAttributes, requestedCredentials } = details
    if (
      requestedAttributes.length === 1 &&
      requestedCredentials.length === 0 &&
      !attributes[requestedAttributes[0]]
    ) {
      return requestedAttributes[0]
    }
  },
)

const getSingleRequestedCredential = createSelector(
  [getCredShareDetails, getAllCredentials],
  (details, credentials) => {
    const { requestedAttributes, requestedCredentials } = details
    if (requestedAttributes.length === 0 && requestedCredentials.length === 1) {
      const availableCreds = credentials.filter(
        (c) => c.type[1] === requestedCredentials[0],
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
    getAvailableRequestedAttributes,
    getSelectedShareCredentials,
    getSingleRequestedAttribute,
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
  [getAvailableRequestedAttributes],
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
 * Gets the categorized @OfferedCredential from the @interactionDetails.
 */
export const getOfferedCredentialsByCategories = createSelector(
  [getCredOfferDetails],
  (details) => {
    // TODO: will be moving away from the `credentials.service_issued` structure in favor of
    // just credentials, since during this flow we only receive "service issued" credentials
    // anyways
    return details.credentials.service_issued.reduce<CredentialsByCategory<OfferedCredential>>((acc, cred) => {
      const section = getCredentialCategory(cred)
      acc[section] = [...acc[section], cred]

      return acc
    }, {[CredentialRenderTypes.document]: [], [OtherCategory.other]: []})
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

export const getAuthzUIDetails = createSelector(
  [getAuthorizationDetails],
  (details) => {
    const { flowType, ...rest } = details
    return {
      ...rest,
    }
  },
)

export const getRequestedCredentialDetailsBAS = createSelector(
  [
    getSingleRequestedAttribute,
    getSingleRequestedCredential,
    getIsReadyToSubmitRequest,
  ],
  (singleRequestedAttribute, singleRequestedCredential) => ({
    singleRequestedAttribute,
    singleRequestedCredential,
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
