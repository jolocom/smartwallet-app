import React, { useEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Scanner from '~/screens/Modals/Interactions/Scanner'
import { useSelector } from 'react-redux'
import { getInteractionType } from '~/modules/interaction/selectors'
import { useNavigation } from '@react-navigation/native'
import ActionSheetManager from '~/components/ActionSheet/ActionSheetManager'

const Stack = createStackNavigator()

const Interactions: React.FC = () => {
  const isInteracting = useSelector(getInteractionType);
  const navigation = useNavigation()

  useEffect(() => {
    if (isInteracting) {
      navigation.navigate(ScreenNames.Interaction)
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
        options={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1],
              }),
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp',
              }),
            },
          }),
        }}
        name={ScreenNames.Interaction}
        component={ActionSheetManager} />
    </Stack.Navigator>
  )
}

export default Interactions
