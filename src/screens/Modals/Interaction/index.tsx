import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import { ScreenNames } from '~/types/screens'
import Scanner from '~/screens/Modals/Interaction/Scanner'
import { useSelector } from 'react-redux'
import { getInteractionType } from '~/modules/interaction/selectors'
import { useNavigation } from '@react-navigation/native'
import InteractionFlow from '~/screens/Modals/Interaction/InteractionFlow'
import {
  screenTransitionSlideFromBottom,
  screenDisableGestures,
  transparentModalFadeOptions,
} from '~/utils/screenSettings'
import ServiceRedirect from './ServiceRedirect'
import eID from './eID'

export type InteractionStackParamList = {
  [ScreenNames.Scanner]: undefined
  [ScreenNames.InteractionFlow]: undefined
  [ScreenNames.eId]: undefined
  [ScreenNames.ServiceRedirect]: {
    counterparty: {
      logo?: string
      serviceName: string
      isAnonymous: boolean
    }
    redirectUrl: string
    completeRedirect: () => void
    closeOnComplete?: boolean
  }
}

const InteractionStack = createStackNavigator<InteractionStackParamList>()

const Interaction: React.FC = () => {
  const isInteracting = useSelector(getInteractionType)
  const navigation = useNavigation()

  useEffect(() => {
    if (isInteracting) {
      navigation.navigate(ScreenNames.InteractionFlow)
    }
  }, [isInteracting])

  return (
    <InteractionStack.Navigator headerMode="none" mode="modal">
      <InteractionStack.Screen
        options={{ ...transparentModalFadeOptions, ...screenDisableGestures }}
        name={ScreenNames.InteractionFlow}
        component={InteractionFlow}
      />
      <InteractionStack.Screen
        name={ScreenNames.Scanner}
        component={Scanner}
        options={screenTransitionSlideFromBottom}
      />
      <InteractionStack.Screen
        name={ScreenNames.eId}
        component={eID}
        options={{
          ...transparentModalFadeOptions,
          ...screenDisableGestures,
        }}
      />
      <InteractionStack.Screen
        options={{ ...transparentModalFadeOptions, ...screenDisableGestures }}
        name={ScreenNames.ServiceRedirect}
        component={ServiceRedirect}
      />
    </InteractionStack.Navigator>
  )
}

export default Interaction
