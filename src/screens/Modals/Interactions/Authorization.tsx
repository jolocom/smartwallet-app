import React from 'react'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import { useRootSelector } from '~/hooks/useRootSelector'
import {
  getInteractionDetails,
  isAuthzDetails,
} from '~/modules/interaction/selectors'

const Authorization = () => {
  const details = useRootSelector(getInteractionDetails)
  if (isAuthzDetails(details)) {
    const { image } = details
    return <BasWrapper />
  }
  return null
}

export default Authorization
