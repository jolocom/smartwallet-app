import React, { useEffect } from 'react'
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import Scanner from '~/screens/Modals/Interaction/Scanner'
import { useSelector } from 'react-redux'
import { getInteractionType } from '~/modules/interaction/selectors'
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'
import InteractionFlow from '~/screens/Modals/Interaction/InteractionFlow'
import { screenDisableGestures } from '~/utils/screenSettings'
import { MainStackParamList } from '~/screens/LoggedIn/Main'

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

const Interactions: React.FC = () => {
  const isInteracting = useSelector(getInteractionType)
  const navigation = useNavigation()

  const { params } =
    useRoute<RouteProp<MainStackParamList, ScreenNames.Interaction>>()

  useEffect(() => {
    if (isInteracting) {
      navigation.navigate(ScreenNames.InteractionFlow)
    }
  }, [isInteracting])

  return (
    <Stack.Navigator
      headerMode="none"
      mode="modal"
      screenOptions={screenDisableGestures}
    >
      {params.isScannerShown ? (
        <Stack.Screen name={ScreenNames.Scanner} component={Scanner} />
      ) : null}
      <Stack.Screen
        options={modalStyleOptions}
        name={ScreenNames.InteractionFlow}
        component={InteractionFlow}
      />
    </Stack.Navigator>
  )
}

export default Interactions
