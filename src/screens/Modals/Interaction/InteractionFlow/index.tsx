import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { FlowType } from 'react-native-jolocom'

import Authentication from './Authentication'
import Authorization from './Authorization'
import CredentialShare from './CredentialShare'
import CredentialOffer from './CredentialOffer'

import { getInteractionType } from '~/modules/interaction/selectors'

import { useFinishInteraction } from '~/hooks/interactions/handlers'
import ScreenDismissArea from '~/components/ScreenDismissArea'
import { useBackHandler } from '@react-native-community/hooks'

const InteractionFlow: React.FC = () => {
  const interactionType = useSelector(getInteractionType)

  const finishInteraction = useFinishInteraction()

  useBackHandler(() => {
    finishInteraction()
    return true
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
    finishInteraction()
  }

  return (
    <View style={styles.fullScreen}>
      <ScreenDismissArea onDismiss={handleDismissInteraction} />
      <View style={styles.interactionBody}>{renderInteractionBody()}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    height: '100%',
  },
  tapArea: {
    flex: 1,
  },
  interactionBody: {
    flex: 0,
    alignItems: 'center',
  },
})

export default InteractionFlow