import React from 'react'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import { setLogged } from '~/modules/account/actions'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { useSubmitSeedphraseBackup } from '~/hooks/sdk'
import { useLoader } from '~/hooks/useLoader'

const SeedPhraseRepeat: React.FC = () => {
  const dispatch = useDispatch()
  const submitBackup = useSubmitSeedphraseBackup()
  const loader = useLoader()

  const onSubmit = async () => {
    const success = await loader(submitBackup)
    if (success) dispatch(setLogged(true))
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
