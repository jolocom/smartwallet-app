import React from 'react'
import { useSelector } from 'react-redux'
import ScreenContainer from '~/components/ScreenContainer'
import { getAttributes } from '~/modules/attributes/selectors'

const Identity = () => {
  const attributes = useSelector(getAttributes)
  return <ScreenContainer></ScreenContainer>
}

export default Identity
