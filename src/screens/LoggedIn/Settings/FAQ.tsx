import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'

const FAQ = () => (
  <ScreenContainer hasHeaderBack>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      FAQ
    </JoloText>
  </ScreenContainer>
)

export default FAQ
