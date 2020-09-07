import { useSelector } from 'react-redux'
import React from 'react'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import { getInteractionDetails } from '~/modules/interaction/selectors'
import { isAuthzDetails } from '~/modules/interaction/guards'

const Authorization = () => {
  const details = useSelector(getInteractionDetails)
  if (isAuthzDetails(details)) {
    const { image } = details
    return <BasWrapper />
  }
  return null
}

export default Authorization
