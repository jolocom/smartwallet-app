import React, { useEffect } from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'

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

const Stack = createStackNavigator<InteractionStackParamList>()

const Interaction: React.FC = () => {
  const isInteracting = useSelector(getInteractionType)
  const navigation = useNavigation()

  useEffect(() => {
    if (isInteracting) {
      navigation.navigate(ScreenNames.InteractionFlow)
    }
  }, [isInteracting])

  return (
    <Stack.Navigator headerMode="none" mode="modal">
      <Stack.Screen
        options={{ ...transparentModalFadeOptions, ...screenDisableGestures }}
        name={ScreenNames.InteractionFlow}
        component={InteractionFlow}
      />
      <Stack.Screen
        name={ScreenNames.Scanner}
        component={Scanner}
        options={screenTransitionSlideFromBottom}
      />
      <Stack.Screen
        name={ScreenNames.eId}
        component={eID}
        options={{
          ...transparentModalFadeOptions,
          ...screenDisableGestures,
        }}
      />
      <Stack.Screen
        options={{ ...transparentModalFadeOptions, ...screenDisableGestures }}
        name={ScreenNames.ServiceRedirect}
        component={ServiceRedirect}
      />
    </Stack.Navigator>
  )
}

export default Interaction
