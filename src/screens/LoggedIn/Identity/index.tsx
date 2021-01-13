import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import IdentityIntro from './IdentityIntro'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSelector } from 'react-redux'
import IdentityCredentials from './IdentityCredentials'
import IdentityBusinessCard from './IdentityBusinessCard'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const showIdentityIntro = !Boolean(Object.keys(attributes).length)

  return (
    <ScreenContainer isFullscreen>
      {showIdentityIntro ? <IdentityIntro /> : <IdentityCredentials />}
      <IdentityBusinessCard />
    </ScreenContainer>
  )
}

export default Identity
