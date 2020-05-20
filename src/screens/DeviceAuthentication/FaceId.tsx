import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Biometrics from './Biometrics'
import { strings } from '~/translations/strings'

const FaceId = () => {
  return (
    <ScreenContainer>
      <Biometrics authType={strings.FACE} />
    </ScreenContainer>
  )
}

export default FaceId
