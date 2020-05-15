import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Btn from '~/components/Btn'

import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'

const SeedPhraseRepeat: React.FC = () => {
  const redirectToDeviceAuth = useRedirectTo(ScreenNames.DeviceAuth)

  return (
    <ScreenContainer>
      <Header>Seed Phrase Repeat</Header>
      <Btn onPress={redirectToDeviceAuth}>Done</Btn>
    </ScreenContainer>
  )
}

export default SeedPhraseRepeat
