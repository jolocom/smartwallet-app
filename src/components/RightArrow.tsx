import React from 'react'

import Arrow, { ArrowDirections } from './Arrow'
import { ForthArrowIcon } from '~/assets/svg'

interface PropsI {
  handlePress: () => void
}

const RightArrow: React.FC<PropsI> = ({ handlePress }) => {
  return (
    <Arrow direction={ArrowDirections.right} onPress={handlePress}>
      <ForthArrowIcon />
    </Arrow>
  )
}

export default RightArrow
