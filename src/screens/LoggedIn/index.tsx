import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { ScreenNames } from '~/types/screens'
import WalletAuthentication from '../Modals/WalletAuthentication'
import Main from './Main'
import LockStack from './LockStack'
import { useInitApp } from '~/hooks/init'
import ScreenContainer from '~/components/ScreenContainer'
import { screenTransitionFromBottomDisabledGestures } from '~/utils/screenSettings'

export type LoggedInStackParamList = {
  Idle: undefined
  [ScreenNames.Main]: undefined
  [ScreenNames.LockStack]: undefined
  [ScreenNames.WalletAuthentication]: undefined
}

const LoggedInStack = createStackNavigator<LoggedInStackParamList>()

const Idle = () => <ScreenContainer />

const LoggedIn = () => {
  const { showContent, showLockRegister } = useInitApp()

  return (
    <LoggedInStack.Navigator headerMode="none">
      {showLockRegister ? (
        <LoggedInStack.Screen
          name={ScreenNames.WalletAuthentication}
          component={WalletAuthentication}
          options={screenTransitionFromBottomDisabledGestures}
        />
      ) : (
        <>
          <LoggedInStack.Screen
            name={'Idle'}
            component={Idle}
            options={screenTransitionFromBottomDisabledGestures}
          />
          <LoggedInStack.Screen
            name={ScreenNames.Main}
            component={Main}
            options={screenTransitionFromBottomDisabledGestures}
          />
          {!showContent && (
            <LoggedInStack.Screen
              name={ScreenNames.LockStack}
              component={LockStack}
              options={screenTransitionFromBottomDisabledGestures}
            />
          )}
        </>
      )}
      {/* Modals -> End */}
    </LoggedInStack.Navigator>
  )
}

export default LoggedIn
