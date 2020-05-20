import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Biometrics from './Biometrics'
import { strings } from '~/translations/strings'

const TouchId = () => {
  return (
    <ScreenContainer>
      <Biometrics authType={strings.TOUCH} />
    </ScreenContainer>
  )
}

export default TouchId
