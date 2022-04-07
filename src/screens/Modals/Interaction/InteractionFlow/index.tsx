import React from 'react'
import { StyleSheet, View } from 'react-native'
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
import ScreenDismissArea from '~/components/ScreenDismissArea'
import { Colors } from '~/utils/colors'

const InteractionFlow: React.FC = () => {
  const interactionType = useSelector(getInteractionType)
  const isFocused = useIsFocused()

  const finishInteraction = useFinishInteraction()

  useBackHandler(() => {
    if (isFocused) {
      finishInteraction()
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
    backgroundColor: Colors.black65,
  },
  interactionBody: {
    flex: 0,
    alignItems: 'center',
  },
})

export default InteractionFlow
