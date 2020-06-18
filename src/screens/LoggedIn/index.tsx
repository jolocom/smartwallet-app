import React, { useEffect, useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Keychain from 'react-native-keychain'
import { useDispatch, useSelector } from 'react-redux'
import { ActivityIndicator } from 'react-native'

import { ScreenNames } from '~/types/screens'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { setLocalAuth } from '~/modules/account/actions'
import { getLoaderState } from '~/modules/loader/selectors'
import { isLocalAuthSet } from '~/modules/account/selectors'
import ScreenContainer from '~/components/ScreenContainer'
import useRedirectTo from '~/hooks/useRedirectTo'

import Claims from './Claims'
import Documents from './Documents'
import History from './History'
import Settings from './Settings'

const MainTabs = createBottomTabNavigator()

const LoggedInTabs: React.FC = () => {
  const redirectToDeviceAuth = useRedirectTo(ScreenNames.DeviceAuth)
  const dispatch = useDispatch()
  const { isVisible } = useSelector(getLoaderState)
  const isAuthSet = useSelector(isLocalAuthSet)

  const [isLoading, setIsLoading] = useState(true)

  //check the keychain of PIN was setup display Claims, otherwise display DeviceAuth screen
  useEffect(() => {
    checkIfPasscodeWasSetup()
  }, [])

  // this hook is responsible for displaying device auth screen only after the Loader modal is hidden
  // otherwise, the keyboard appear on top loader modal
  useEffect(() => {
    if (!isVisible && !isAuthSet) {
      setIsLoading(false)
      redirectToDeviceAuth()
    }
  }, [isVisible])

  const checkIfPasscodeWasSetup = async () => {
    try {
      const response = await Keychain.getGenericPassword({
        service: PIN_SERVICE,
      })
      if (!response && !isLoading) {
        redirectToDeviceAuth()
      } else if (response) {
        dispatch(setLocalAuth())
      }
    } catch (err) {
      // ✍🏼 todo: how should we handle this error ?
      console.log({ err })
    } finally {
      if (!isVisible) {
        setIsLoading(false)
      }
    }
  }

  if (isLoading) {
    return (
      <ScreenContainer>
        <ActivityIndicator />
      </ScreenContainer>
    )
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
