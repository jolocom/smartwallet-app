import React from 'react'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import ScreenContainer from '~/components/ScreenContainer'
import { JoloTextSizes } from '~/utils/fonts'

const Imprint = () => (
  <ScreenContainer hasHeaderBack>
    <JoloText kind={JoloTextKind.title} size={JoloTextSizes.middle}>
      Imprint
    </JoloText>
  </ScreenContainer>
)

export default Imprint
