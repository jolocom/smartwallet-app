import React from 'react'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { setLogged } from '~/modules/account/actions'

const SeedPhraseRepeat: React.FC = () => {
  
  const redirectToDeviceAuth = useRedirectTo(ScreenNames.DeviceAuth)
  const dispatch = useDispatch()

  const onPress = () => {
    dispatch(setLogged(true))
    redirectToDeviceAuth();
  }

  return (
    <ScreenContainer>
      <Header>Seed Phrase Repeat</Header>
      <Btn onPress={onPress}>Done</Btn>
    </ScreenContainer>
  )
}

export default SeedPhraseRepeat
