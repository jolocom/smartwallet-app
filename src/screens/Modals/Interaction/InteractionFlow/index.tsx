import React from 'react'
import { useSelector } from 'react-redux'
import { FlowType } from 'react-native-jolocom'
import { useBackHandler } from '@react-native-community/hooks'
import { useIsFocused } from '@react-navigation/core'

import Authentication from './Authentication'
import Authorization from './Authorization'
import CredentialShare from './CredentialShare'
import CredentialOffer from './CredentialOffer'

import { getInteractionType } from '~/modules/interaction/selectors'

import { useFinishInteraction } from '~/hooks/interactions/handlers'
import BottomSheet from '~/components/BottomSheet'

const InteractionFlow: React.FC = () => {
  const interactionType = useSelector(getInteractionType)
  const isFocused = useIsFocused()

  const { clearInteraction, closeInteraction } = useFinishInteraction()

  useBackHandler(() => {
    if (isFocused) {
      handleDismissInteraction()
      return true
    } else {
      return false
    }
  })

  const renderInteractionBody = () => {
    switch (interactionType) {
      case FlowType.Authentication:
        return <Authentication />
      case FlowType.Authorization:
        return <Authorization />
      case FlowType.CredentialShare:
        return <CredentialShare />
      case FlowType.CredentialOffer:
        return <CredentialOffer />
      default:
        return null
    }
  }

  const handleDismissInteraction = () => {
    clearInteraction()
    closeInteraction()
  }

  // TODO: we are rendering the bottom sheet also for the full
  // screen interactions
  return (
    <BottomSheet onDismiss={handleDismissInteraction}>
      {renderInteractionBody()}
    </BottomSheet>
  )
}

export default InteractionFlow
