import React from 'react'

import { BackArrowIcon } from '~/assets/svg'
import Arrow, { ArrowDirections } from './Arrow'

interface PropsI {
  handlePress: () => void
}

const LeftArrow: React.FC<PropsI> = ({ handlePress }) => {
  return (
    <Arrow direction={ArrowDirections.left} onPress={handlePress}>
      <BackArrowIcon />
    </Arrow>
  )
}

export default LeftArrow
