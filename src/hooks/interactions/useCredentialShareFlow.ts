import { useSelector, useDispatch } from 'react-redux'
import { useInteraction } from '../sdk'
import {
  getSelectedShareCredentials,
  getShareAttributes,
  getShareCredentialsBySection,
  getShareCredentialTypes,
  getInteractionDetails,
} from '~/modules/interaction/selectors'
import { AttrKeys, attrTypeToAttrKey } from '~/types/credentials'
import { IntermediaryState } from '~/modules/interaction/types'
import {
  setIntermediaryState,
  setAttributeInputKey,
  selectShareCredential,
} from '~/modules/interaction/actions'
import { isCredShareDetails } from '~/modules/interaction/guards'

/**
 * A custom hook which exposes a collection of utils for the Credential Share interaction
 */
export const useCredentialShareFlow = () => {
  const dispatch = useDispatch()
  const interaction = useInteraction()
  const selectedShareCredentials = useSelector(getSelectedShareCredentials)
  const attributes = useSelector(getShareAttributes)
  const interactionDetails = useSelector(getInteractionDetails)
  const { requestedAttributes, requestedCredentials } = useSelector(
    getShareCredentialTypes,
  )
  const { documents, other } = useSelector(getShareCredentialsBySection)

  /**
   * Assembles a @CredentialRequestResponse token with the selected
   * credentials, processes it and sends it to the @counterparty.
   */
  const assembleShareResponseToken = async () => {
    const mappedSelection = Object.values(selectedShareCredentials).map(id => ({
      id,
    }))
    const response = await interaction.createCredentialResponse(
      // @ts-ignore is fixed in future SDK version. Should work this way, since we only need the @id
      mappedSelection,
    )
    //TODO: uncomment when the constraints bug on the SDK is fixed
    //await interaction.processInteractionToken(response)
    await interaction.send(response)
  }

  /**
   * Returns the @id for the first available attribute of each type.
   */
  const getPreselectedAttributes = () =>
    Object.keys(attributes).reduce<Record<string, string>>((acc, v) => {
      const value = v as AttrKeys
      if (!acc[value]) {
        const attr = attributes[value] || []
        acc[value] = attr.length ? attr[0].id : ''
      }
      return acc
    }, {})

  /**
   * Assures all requested credentials & attributes are selected.
   */
  const selectionReady = () => {
    const allAttributes = Object.keys(attributes).every(t =>
      Object.keys(selectedShareCredentials).includes(t),
    )

    const allCredentials = requestedCredentials.every(t =>
      Object.keys(selectedShareCredentials).includes(t),
    )

    return allAttributes && allCredentials
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
    dispatch(setIntermediaryState(IntermediaryState.showing))
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
    if (!isCredShareDetails(interactionDetails)) return null

    const isSingleAttribute =
      !requestedCredentials.length && requestedAttributes.length === 1
    const attrKey = attrTypeToAttrKey(requestedAttributes[0])
    if (!attrKey) return null

    const typeAttributes = attributes[attrKey]
    const isMissing = !typeAttributes || !typeAttributes.length

    return isSingleAttribute && isMissing ? attrKey : null
  }

  return {
    assembleShareResponseToken,
    getPreselectedAttributes,
    selectionReady,
    isFirstCredential,
    handleCreateAttribute,
    handleSelectCredential,
    getSingleMissingAttribute,
  }
}
