import React from 'react'

import ScreenContainer from '~/components/ScreenContainer'
import IdentityIntro from './IdentityIntro'
import { getAttributes } from '~/modules/attributes/selectors'
import { useSelector } from 'react-redux'
import IdentityCredentials from './IdentityCredentials'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  const showIdentityIntro = !Boolean(Object.keys(attributes).length)

  if (showIdentityIntro) {
    return (
      <ScreenContainer isFullscreen customStyles={{justifyContent: 'flex-start'}}>
        <IdentityIntro />
      </ScreenContainer>
    )
  }

  return (
    <ScreenContainer>
      <IdentityCredentials />
    </ScreenContainer>
  )
}

export default Identity
