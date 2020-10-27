import React from 'react'
import { useDispatch } from 'react-redux'

import ScreenContainer from '~/components/ScreenContainer'
import Btn from '~/components/Btn'
import { setLogged } from '~/modules/account/actions'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { useLoader } from '~/hooks/loader'
import { useSubmitIdentity } from '~/hooks/sdk'

const SeedPhraseRepeat: React.FC = () => {
  const dispatch = useDispatch()
  const submitIdentity = useSubmitIdentity()
  const loader = useLoader()

  const onSubmit = async () => {
    const success = await loader(submitIdentity)
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
