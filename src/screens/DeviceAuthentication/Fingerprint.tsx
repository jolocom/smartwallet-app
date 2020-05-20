import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import Biometrics from './Biometrics'
import { strings } from '~/translations/strings'

const Fingerprint = () => {
  return (
    <ScreenContainer>
      <Biometrics authType={strings.FINGERPRINT} />
    </ScreenContainer>
  )
}

export default Fingerprint
