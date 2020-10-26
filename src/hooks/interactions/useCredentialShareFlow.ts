import { useSelector, useDispatch } from 'react-redux'
import { useInteraction } from '../sdk'
import {
  getSelectedShareCredentials,
  getAvailableAttributesToShare,
  getShareCredentialsBySection,
  getShareCredentialTypes,
  getCounterpartyName,
} from '~/modules/interaction/selectors'
import { AttrKeys, attrTypeToAttrKey, ATTR_UI_NAMES } from '~/types/credentials'
import { IntermediarySheetState } from '~/modules/interaction/types'
import {
  setIntermediaryState,
  setAttributeInputKey,
  selectShareCredential,
} from '~/modules/interaction/actions'
import { strings } from '~/translations/strings'

/**
 * A custom hook which exposes a collection of utils for the Credential Share interaction
 */
export const useCredentialShareFlow = () => {
  const dispatch = useDispatch()
  const interaction = useInteraction()
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
    if (selectedShareCredentials) {
      const mappedSelection = Object.values(selectedShareCredentials).map(
        (id) => id,
      )
      const response = await interaction.createCredentialResponse(
        mappedSelection,
      )

      await interaction.processInteractionToken(response)
      await interaction.send(response)
    }
  }

  /**
   * Returns the @id for the first available attribute of each type.
   */
  const getPreselectedAttributes = () =>
    Object.keys(attributes).reduce<Record<string, string>>((acc, value) => {
      if (!acc[value]) {
        const attr = attributes[value] || []
        if (attr.length) {
          acc[value] = attr[0].id
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
   * Shows the Intermediary ActionSheet for creating a new attribute.
   */
  const handleCreateAttribute = (sectionKey: AttrKeys) => {
    dispatch(setIntermediaryState(IntermediarySheetState.showing))
    dispatch(setAttributeInputKey(sectionKey))
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
  const getSingleMissingAttribute = (): AttrKeys | null => {
    const isSingleAttribute =
      !requestedCredentials.length && requestedAttributes.length === 1
    if (!isSingleAttribute) return null

    const attrKey = attrTypeToAttrKey(requestedAttributes[0])
    if (!attrKey) return null

    const typeAttributes = attributes[attrKey]
    const isMissing = !typeAttributes || !typeAttributes.length

    return isMissing ? attrKey : null
  }

  const getHeaderText = () => {
    const missingAttr = getSingleMissingAttribute()
    const title = missingAttr
      ? strings.SERVICE_REQUESTS_ATTRIBUTE(
          serviceName,
          ATTR_UI_NAMES[missingAttr],
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
    handleCreateAttribute,
    handleSelectCredential,
    getSingleMissingAttribute,
    getHeaderText,
    getCtaText,
  }
}
