import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { strings } from '~/translations/strings'

const Settings = () => {
  const redirectToChangePin = useRedirectTo(ScreenNames.SettingsList, {
    screen: ScreenNames.ChangePin,
  })

  return (
    <ScreenContainer>
      <Btn onPress={redirectToChangePin}>{strings.CHANGE_PIN}</Btn>
    </ScreenContainer>
  )
}

export default Settings
