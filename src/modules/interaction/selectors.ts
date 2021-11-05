import { createSelector } from 'reselect'

import { RootReducerI } from '~/types/reducer'
import {
  AttributeTypes,
  CredentialsByCategory,
  DisplayCredentialDocument,
  DisplayCredentialOther,
  OfferedCredential,
  RequestedCredentialsByCategoryByType,
  CredentialCategories,
} from '~/types/credentials'
// TODO: rename the file
import { InteractionDetails } from './types'
import {
  isAuthDetails,
  isAuthzDetails,
  isCredOfferDetails,
  isCredShareDetails,
  isNotActiveInteraction,
} from './guards'
import BP from '~/utils/breakpoints'
import {
  mapDisplayToCustomDisplay,
  reduceCustomDisplayCredentialsByType,
  transformCategoriesTo,
} from '~/hooks/signedCredentials/utils'
import { categorizedCredentials } from '~/utils/categoriedCredentials'
import { getObjectFirstValue } from '~/utils/objectUtils'
import { AttributeI } from '../attributes/types'
import { attributeConfig } from '~/config/claims'
import { getCounterpartyName } from '~/utils/dataMapping'

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
  (details) => {
    const { requestedTypes, attributes } = details
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
  (details) => details.credentials,
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

/**
 * Getting requested credentials by type and category
 * @category used to separate into Documents and Other
 * @type used to group credentials by type and present them in a carousel
 */
const getRequestedCredentialsByCategoryByType = createSelector(
  [getCredShareDetails],
  (shareDetails) => {
    const groupCategoriesByType = transformCategoriesTo(
      categorizedCredentials(shareDetails.credentials),
    )
    return groupCategoriesByType(reduceCustomDisplayCredentialsByType)
  },
)

export const getCustomRequestedCredentialsByCategoryByType = createSelector(
  [getRequestedCredentialsByCategoryByType],
  (requestedCategories) => {
    return Object.keys(requestedCategories).reduce<
      RequestedCredentialsByCategoryByType<
        DisplayCredentialDocument | DisplayCredentialOther
      >
    >(
      (categories, catName) => {
        const categoryName = catName as CredentialCategories
        categories[categoryName] = requestedCategories[categoryName].map(
          (d) => ({
            ...d,
            credentials: d.credentials.map(mapDisplayToCustomDisplay),
          }),
        )
        return categories
      },
      { [CredentialCategories.document]: [], [CredentialCategories.other]: [] },
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
  (details) => {
    const { attributes, credentials } = details
    if (Object.keys(attributes).length === 0 && credentials.length === 1) {
      return credentials[0]
    }
    return undefined
  },
)

export const getIsReadyToSubmitRequest = createSelector(
  [getCredShareDetails, getSingleRequestedAttribute],
  (details, singleAttribute) => {
    if (singleAttribute && !getObjectFirstValue(singleAttribute).length)
      return true
    return details.requestedTypes.every((c) => details.selectedCredentials[c])
  },
)

export const getAttributesToSelect = createSelector(
  [getCredShareDetails],
  (details) => {
    return Object.keys(details.attributes).reduce<Record<string, string>>(
      (acc, value) => {
        const attrType = value as AttributeTypes
        if (!acc[attrType]) {
          const attr = details.attributes || []
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
  (details) => {
    const isOnlyOneCredential = details.credentials.service_issued.length === 1

    if (isOnlyOneCredential) {
      return false
    } else {
      return true
    }
  },
)

export const getOfferedCredentials = createSelector(
  [getCredOfferDetails],
  (details) => details.credentials.service_issued,
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
    return details.credentials.service_issued.reduce<
      CredentialsByCategory<OfferedCredential>
    >(
      (acc, cred) => {
        acc[cred.category] = [...acc[cred.category], cred]

        return acc
      },
      { [CredentialCategories.document]: [], [CredentialCategories.other]: [] },
    )
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

export const getAusweisDetails = (state: RootReducerI) =>
  state.interaction.ausweisDetails
