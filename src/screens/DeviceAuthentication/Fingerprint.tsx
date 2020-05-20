import React from 'react'

import Biometrics from './Biometrics'
import { strings } from '~/translations/strings'

const Fingerprint = () => {
  return <Biometrics authType={strings.FINGERPRINT} />
}

export default Fingerprint
