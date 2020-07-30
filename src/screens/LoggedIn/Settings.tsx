import React, { useState, Dispatch, SetStateAction } from 'react'
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
import { Colors } from '~/utils/colors'

interface SwitcherPropsI {
  value: boolean
  onValueChange: Dispatch<SetStateAction<boolean>>
  leftTitle: string
  rightTitle: string
}
const Switcher: React.FC<SwitcherPropsI> = ({
  value,
  onValueChange,
  leftTitle,
  rightTitle,
}) => {
  return (
    <View style={{ flexDirection: 'row' }}>
      <Paragraph customStyles={{ marginRight: 10 }}>{leftTitle}</Paragraph>
      <Switch value={value} onValueChange={onValueChange} />
      <Paragraph customStyles={{ marginLeft: 10 }}>{rightTitle}</Paragraph>
    </View>
  )
}

const Settings = () => {
  const [isSmall, setIsSmall] = useState(true)
  const [isDisabled, setIsDisabled] = useState(true)

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
        <Switcher
          value={isSmall}
          onValueChange={setIsSmall}
          leftTitle="Large"
          rightTitle="Small"
        />
        <Switcher
          value={isDisabled}
          onValueChange={setIsDisabled}
          leftTitle="Active"
          rightTitle="Disabled"
        />
        <CredentialCard isSmall={isSmall} disabled={isDisabled}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Paragraph color={Colors.black}>
              This is a custom card content
            </Paragraph>
          </View>
        </CredentialCard>
      </View>

      <Btn onPress={redirectToChangePin}>{strings.CHANGE_PIN}</Btn>
      <Btn onPress={logout}>{strings.LOG_OUT}</Btn>
    </ScreenContainer>
  )
}

export default Settings
