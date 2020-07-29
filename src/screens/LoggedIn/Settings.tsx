import React, { useState } from 'react'
import AsyncStorage from '@react-native-community/async-storage'
import { useDispatch } from 'react-redux'
import { View, Switch } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import useResetKeychainValues from '~/hooks/useResetKeychainValues'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations/strings'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { accountReset } from '~/modules/account/actions'
import CredentialCard from '../Modals/Interactions/CredentialCard'
import Paragraph from '~/components/Paragraph'

const Settings = () => {
  const [isSmall, setIsSmall] = useState(true)

  const redirectToChangePin = useRedirectTo(ScreenNames.SettingsList, {
    screen: ScreenNames.ChangePin,
  })
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const dispatch = useDispatch()

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('biometry')
      resetServiceValuesInKeychain()
      dispatch(accountReset())
    } catch (err) {
      console.log('Error occured while logging out')
      console.warn({ err })
    }
  }

  return (
    <ScreenContainer>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}
      >
        <View style={{ flexDirection: 'row' }}>
          <Paragraph customStyles={{ marginRight: 10 }}>Large</Paragraph>
          <Switch value={isSmall} onValueChange={setIsSmall} />
          <Paragraph customStyles={{ marginLeft: 10 }}>Small</Paragraph>
        </View>
        <CredentialCard isSmall={isSmall}>
          <View style={{ flex: 1 }}>
            <Paragraph>This is a custom card content</Paragraph>
          </View>
        </CredentialCard>
      </View>

      <Btn onPress={redirectToChangePin}>{strings.CHANGE_PIN}</Btn>
      <Btn onPress={logout}>{strings.LOG_OUT}</Btn>
    </ScreenContainer>
  )
}

export default Settings
