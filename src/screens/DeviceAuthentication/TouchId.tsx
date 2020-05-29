import React from 'react'

import Biometry from './Biometry'
import { strings } from '~/translations/strings'

const TouchId = () => {
  return <Biometry authType={strings.TOUCH} />
}

export default TouchId
