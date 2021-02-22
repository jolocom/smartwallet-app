import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSelector } from 'react-redux'

import { FlowType } from 'react-native-jolocom'

import Authentication from './flows/Authentication'
import Authorization from './flows/Authorization'
import CredentialShare from './flows/CredentialShare'
import CredentialOffer from './flows/CredentialOffer'

import {
  getInteractionType,
} from '~/modules/interaction/selectors'

import Resolution from '~/screens/Modals/Interaction/InteractionFlow/Resolution'
import { useFinishInteraction } from '~/hooks/interactions'
import ScreenDismissArea from '~/components/ScreenDismissArea'

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
      <ScreenDismissArea onDismiss={handleDismissInteraction} />
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
  },
  tapArea: {
    flex: 1,  
  },
  interactionBody: {
    flex: 0,
    alignItems: 'center'
  }
})

export default InteractionFlow
