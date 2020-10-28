import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'

const Language = () => (
  <ScreenContainer hasHeaderBack>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      Language
    </JoloText>
  </ScreenContainer>
)

export default Language
