import React from 'react'

import Biometry from './Biometry'
import { strings } from '~/translations/strings'

const Fingerprint = () => {
  return <Biometry authType={strings.FINGERPRINT} />
}

export default Fingerprint
