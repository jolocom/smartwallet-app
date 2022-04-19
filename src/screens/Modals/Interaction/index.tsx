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
import { screenTransitionSlideFromBottom } from '~/utils/screenSettings'

export type InteractionStackParamList = {
  [ScreenNames.Scanner]: undefined
  [ScreenNames.InteractionFlow]: undefined
}

const Stack = createStackNavigator<InteractionStackParamList>()

const modalStyleOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
}

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
        options={modalStyleOptions}
        name={ScreenNames.InteractionFlow}
        component={InteractionFlow}
      />
      <Stack.Screen
        name={ScreenNames.Scanner}
        component={Scanner}
        options={{
          ...screenTransitionSlideFromBottom,
        }}
      />
    </Stack.Navigator>
  )
}

export default Interaction
