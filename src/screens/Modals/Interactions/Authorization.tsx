import React from 'react'
import { Image } from 'react-native'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import { useRootSelector } from '~/hooks/useRootSelector'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import { AuthorizationDetailsI } from '~/modules/interaction/types'

const Authorization = () => {
  const { imageURL } = useRootSelector<AuthorizationDetailsI>(
    getInteractionDetails,
  )

  return (
    <BasWrapper>
      <Image source={{ uri: imageURL }} style={{ width: 260, height: 230 }} />
    </BasWrapper>
  )
}

export default Authorization
