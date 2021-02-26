import { useSelector, useDispatch } from 'react-redux'

import {
  getSelectedShareCredentials,
  getAvailableAttributesToShare,
  getShareCredentialsBySection,
  getShareCredentialTypes,
  getCounterpartyName,
} from '~/modules/interaction/selectors'
import { AttributeTypes } from '~/types/credentials'
import { selectShareCredential } from '~/modules/interaction/actions'
import { strings } from '~/translations/strings'
import { useInteraction } from './handlers'
import { attributeConfig } from '~/config/claims'
import { useAgent } from '../sdk'

/**
 * A custom hook which exposes a collection of utils for the Credential Share interaction
 */
export const useCredentialShareFlow = () => {
  const dispatch = useDispatch()
  const getInteraction = useInteraction()
  const agent = useAgent()
  const selectedShareCredentials = useSelector(getSelectedShareCredentials)
  const attributes = useSelector(getAvailableAttributesToShare)
  const { requestedAttributes, requestedCredentials } = useSelector(
    getShareCredentialTypes,
  )
  const { documents, other } = useSelector(getShareCredentialsBySection)
  const serviceName = useSelector(getCounterpartyName)

  /**
   * Assembles a @CredentialRequestResponse token with the selected
   * credentials, processes it and sends it to the @counterparty.
   */
  const assembleShareResponseToken = async () => {
    const interaction = await getInteraction()
    if (selectedShareCredentials) {
      const mappedSelection = Object.values(selectedShareCredentials).map(
        (id) => id,
      )
      const response = await interaction.createCredentialResponse(
        mappedSelection,
      )

      await agent.processJWT(response)
      await interaction.send(response)
    }
  }

  /**
   * Returns the @id for the first available attribute of each type.
   */
  const getPreselectedAttributes = () =>
    Object.keys(attributes).reduce<Record<string, string>>((acc, value) => {
      const attrType = value as AttributeTypes
      if (!acc[attrType]) {
        const attr = attributes[attrType] || []
        if (attr.length) {
          acc[attrType] = attr[0].id
        }
      }
      return acc
    }, {})

  /**
   * Assures all requested credentials & attributes are selected.
   */
  const selectionReady = () => {
    if (selectedShareCredentials) {
      const allAttributes = Object.keys(attributes).every((t) =>
        Object.keys(selectedShareCredentials).includes(t),
      )

      const allCredentials = requestedCredentials.every((t) =>
        Object.keys(selectedShareCredentials).includes(t),
      )

      return allAttributes && allCredentials
    }

    return false
  }

  /**
   * Returns @true if the credential @id is the first in the list of available credentials.
   * Used for knowing where to show the selection instruction animation.
   */
  const isFirstCredential = (id: string) => {
    if (documents.length) {
      return id === documents[0].credentials[0].id
    } else {
      return id === other[0].credentials[0].id
    }
  }

  /**
   * Selects a credential in the @interactions module
   */
  const handleSelectCredential = (credential: Record<string, string>) => {
    dispatch(selectShareCredential(credential))
  }

  /**
   * Returns the attribute type if only one attribute is requested, and it's not
   * available in the @attributes module. Otherwise returns @null.
   */
  const getSingleMissingAttribute = (): AttributeTypes | null => {
    const isSingleAttribute =
      !requestedCredentials.length && requestedAttributes.length === 1
    if (!isSingleAttribute) return null

    const attrType = requestedAttributes[0]
    const attributesOfType = attributes[attrType]
    const isMissing = !attributesOfType || !attributesOfType.length

    return isMissing ? attrType : null
  }

  const getHeaderText = () => {
    const missingAttr = getSingleMissingAttribute()
    const title = missingAttr
      ? strings.SERVICE_REQUESTS_ATTRIBUTE(
          serviceName,
          attributeConfig[missingAttr].label.toLowerCase(),
        )
      : strings.INCOMING_REQUEST
    const description = strings.CHOOSE_ONE_OR_MORE_DOCUMETS_REQUESTED_BY_SERVICE_TO_PROCEED(
      serviceName,
    )

    return { title, description }
  }

  const getCtaText = () => {
    return getSingleMissingAttribute() ? strings.ADD_INFO : strings.SHARE
  }

  return {
    assembleShareResponseToken,
    getPreselectedAttributes,
    selectionReady,
    isFirstCredential,
    handleSelectCredential,
    getSingleMissingAttribute,
    getHeaderText,
    getCtaText,
  }
}
