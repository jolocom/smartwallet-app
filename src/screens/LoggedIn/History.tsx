import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'

const History: React.FC = () => {
  return (
    <ScreenContainer>
      <JoloText kind={JoloTextKind.title} size={JoloTextSizes.big}>
        History
      </JoloText>
    </ScreenContainer>
  )
}

export default History
