import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import WelcomeSheet from './WelcomeSheet'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSelector } from 'react-redux'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const showWelcomeSheet = !Boolean(Object.keys(attributes).length)

  return (
    <ScreenContainer isFullscreen>
      {showWelcomeSheet && <WelcomeSheet />}
    </ScreenContainer>
  )
}

export default Identity
