import React, { useEffect } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Keychain from 'react-native-keychain'
import { useDispatch } from 'react-redux'

import { ScreenNames } from '~/types/screens'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { setLocalAuth } from '~/modules/account/actions'

import Claims from './Claims'
import Documents from './Documents'
import History from './History'
import Settings from './Settings'
import useRedirectTo from '~/hooks/useRedirectTo'

const MainTabs = createBottomTabNavigator()

const LoggedInTabs: React.FC = () => {
  const redirectToDeviceAuth = useRedirectTo(ScreenNames.DeviceAuth)
  const dispatch = useDispatch()

  //check the keychain of PIN was setup display Claims, otherwise display DeviceAuth screen
  useEffect(() => {
    checkIfPasscodeWasSetup()
  }, [])

  const checkIfPasscodeWasSetup = async () => {
    try {
      const response = await Keychain.getGenericPassword({
        service: PIN_SERVICE,
      })
      if (!response) {
        redirectToDeviceAuth()
      } else {
        dispatch(setLocalAuth())
      }
    } catch (err) {
      // ✍🏼 todo: how should we handle this error ?
      console.log({ err })
    }
  }

  return (
    <MainTabs.Navigator>
      <MainTabs.Screen name={ScreenNames.Claims} component={Claims} />
      <MainTabs.Screen name={ScreenNames.Documents} component={Documents} />
      <MainTabs.Screen name={ScreenNames.History} component={History} />
      <MainTabs.Screen name={ScreenNames.Settings} component={Settings} />
    </MainTabs.Navigator>
  )
}

export default LoggedInTabs
