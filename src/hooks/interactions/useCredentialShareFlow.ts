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
import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { isCredShareDetails } from '~/modules/interaction/guards'

export const useCredentialShareFlow = () => {
  const dispatch = useDispatch()
  const interaction = useInteraction()
  const selectedShareCredentials = useSelector(getSelectedShareCredentials)
  const attributes = useSelector(getShareAttributes)
  const interactionDetails = useSelector(getInteractionDetails)
  const { service_issued, self_issued } = useSelector(getShareCredentialTypes)
  const { documents, other } = useSelector(getShareCredentialsBySection)

  const assembleShareResponseToken = async () => {
    const mappedSelection = Object.values(selectedShareCredentials).map(
      (id) => ({
        id,
      }),
    )
    const response = await interaction.createCredentialResponse(
      // @ts-ignore is fixed in future SDK version. Should work this way, since we only need the @id
      mappedSelection,
    )
    await interaction.processInteractionToken(response)
    await interaction.send(response)
  }

  const getPreselectedAttributes = () =>
    Object.keys(attributes).reduce<{
      [key: string]: string
    }>((acc, v) => {
      const value = v as AttrKeys
      if (!acc[value]) {
        const attr = attributes[value] || []
        acc[value] = attr.length ? attr[0].id : ''
      }
      return acc
    }, {})

  const selectionReady = () => {
    const allAttributes = Object.keys(attributes).every((t) =>
      Object.keys(selectedShareCredentials).includes(t),
    )

    const allCredentials = service_issued.every((t) =>
      Object.keys(selectedShareCredentials).includes(t),
    )

    return allAttributes && allCredentials
  }

  const isFirstCredential = (id: string) => {
    if (documents.length) {
      return id === documents[0].credentials[0].id
    } else {
      return id === other[0].credentials[0].id
    }
  }

  const handleCreateAttribute = (sectionKey: AttrKeys) => {
    dispatch(setIntermediaryState(IntermediaryState.showing))
    dispatch(setAttributeInputKey(sectionKey))
  }

  const handleSelectCredential = (credential: { [key: string]: string }) => {
    dispatch(selectShareCredential(credential))
  }

  const getSingleMissingAttribute = (): AttrKeys | null => {
    if (!isCredShareDetails(interactionDetails)) return null

    const isSingleAttribute = !service_issued.length && self_issued.length === 1
    const attrKey = attrTypeToAttrKey(self_issued[0])
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
