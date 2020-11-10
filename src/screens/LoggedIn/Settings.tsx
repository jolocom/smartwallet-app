import React from 'react'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'

import { useRedirectTo } from '~/hooks/navigation'
import { useResetKeychainValues } from '~/hooks/deviceAuth'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations/strings'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { accountReset } from '~/modules/account/actions'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { useAgent } from '~/hooks/sdk'

const Settings = () => {
  const redirectToChangePin = useRedirectTo(ScreenNames.SettingsList, {
    screen: ScreenNames.ChangePin,
  })
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const dispatch = useDispatch()
  const agent = useAgent()

  const logout = async () => {
    try {
      await agent.storage.store.setting('biometry', {
        type: '',
      })
      resetServiceValuesInKeychain()
      dispatch(accountReset())
    } catch (err) {
      console.log('Error occured while logging out')
      console.warn({ err })
    }
  }

  return (
    <ScreenContainer>
      <JoloText kind={JoloTextKind.title} size={JoloTextSizes.big}>
        Settings
      </JoloText>
      <Btn onPress={redirectToChangePin}>{strings.CHANGE_PIN}</Btn>
      <Btn onPress={logout}>{strings.LOG_OUT}</Btn>
    </ScreenContainer>
  )
}

export default Settings
