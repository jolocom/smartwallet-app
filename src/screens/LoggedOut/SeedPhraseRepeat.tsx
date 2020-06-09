import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Header from '~/components/Header'
import Btn from '~/components/Btn'

import { useDispatch } from 'react-redux'
import { setLogged } from '~/modules/account/actions'

const SeedPhraseRepeat: React.FC = () => {
  const dispatch = useDispatch()

  const onPress = () => {
    dispatch(setLogged(true))
  }

  return (
    <ScreenContainer>
      <Header>Seed Phrase Repeat</Header>
      <Btn onPress={onPress}>Done</Btn>
    </ScreenContainer>
  )
}

export default SeedPhraseRepeat
