import React from 'react'

import Biometry from './Biometry'
import { strings } from '~/translations/strings'

const FaceId = () => {
  return <Biometry authType={strings.FACE} />
}

export default FaceId
