import React from 'react'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import { setLogged } from '~/modules/account/actions'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const SeedPhraseRepeat: React.FC = () => {
  const dispatch = useDispatch()

  const onSubmit = async () => {
    dispatch(setLogged(true))
  }

  return (
    <ScreenContainer>
      <JoloText kind={JoloTextKind.title} size={JoloTextSizes.big}>
        Seed Phrase Repeat
      </JoloText>
      <Btn onPress={onSubmit}>Done</Btn>
    </ScreenContainer>
  )
}

export default SeedPhraseRepeat
