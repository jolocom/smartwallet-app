import React from 'react'

import Biometrics from './Biometrics'
import { strings } from '~/translations/strings'

const TouchId = () => {
  return <Biometrics authType={strings.TOUCH} />
}

export default TouchId
