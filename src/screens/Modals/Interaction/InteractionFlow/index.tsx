import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { FlowType } from 'react-native-jolocom'

import Authentication from './Authentication'
import Authorization from './Authorization'
import CredentialShare from './CredentialShare'
import CredentialOffer from './CredentialOffer'

import {
  getInteractionType,
} from '~/modules/interaction/selectors'

import Resolution from '~/screens/Modals/Interaction/InteractionFlow/Resolution'
import { useFinishInteraction } from '~/hooks/interactions'
import ScreenDismissable from '~/components/ScreenDismissArea'

const InteractionFlow: React.FC = () => {
  const interactionType = useSelector(getInteractionType)

  const finishInteraction = useFinishInteraction();

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
      case FlowType.Resolution:
        return <Resolution />
      default:
        return null
    }
  }

  const handleDismissInteraction = () => {    
      finishInteraction()
  }

  return (
    <View style={styles.fullScreen}>
      <ScreenDismissable onDismiss={handleDismissInteraction} />
      <View style={styles.interactionBody}>
        {renderInteractionBody()}
      </View>
    </View>      
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  tapArea: {
    flex: 1,  
  },
  interactionBody: {
    flex: 0,
  }
})

export default InteractionFlow
