import React from 'react'

import Biometrics from './Biometrics'
import { strings } from '~/translations/strings'

const FaceId = () => {
  return <Biometrics authType={strings.FACE} />
}

export default FaceId
