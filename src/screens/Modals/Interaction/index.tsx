import React, { useEffect } from 'react'
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Scanner from '~/screens/Modals/Interaction/Scanner'
import { useSelector } from 'react-redux'
import { getInteractionType } from '~/modules/interaction/selectors'
import { useNavigation } from '@react-navigation/native'
import InteractionFlow from '~/screens/Modals/Interaction/InteractionFlow'
import InteractionAddCredential from './InteractionAddCredential'
import { AttributeTypes } from '~/types/credentials'

export type InteractionStackParamList = {
  [ScreenNames.Scanner]: undefined,
  [ScreenNames.InteractionFlow]: undefined,
  [ScreenNames.InteractionAddCredential]: { type: AttributeTypes },
}

const Stack = createStackNavigator<InteractionStackParamList>();

const modalStyleOptions = {
  headerShown: false,
  cardStyle: { backgroundColor: 'transparent' },
  cardOverlayEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
}

const Interactions: React.FC = () => {
  const isInteracting = useSelector(getInteractionType);
  const navigation = useNavigation()

  useEffect(() => {
    if (isInteracting) {
      navigation.navigate(ScreenNames.InteractionFlow)
    }
  }, [isInteracting])

  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={{ gestureEnabled: false}}
    >
      <Stack.Screen name={ScreenNames.Scanner} component={Scanner} />
      <Stack.Screen
        options={modalStyleOptions}
        name={ScreenNames.InteractionFlow}
        component={InteractionFlow} />
      <Stack.Screen
        options={modalStyleOptions}
        name={ScreenNames.InteractionAddCredential}
        component={InteractionAddCredential} />
    </Stack.Navigator>
  )
}

export default Interactions
