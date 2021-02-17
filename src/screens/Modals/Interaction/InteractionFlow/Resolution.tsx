import React from 'react'
import { useSelector } from 'react-redux'

import BasWrapper from '~/components/ActionSheet/BasWrapper'
import { getResolutionDetails } from '~/modules/interaction/selectors'
import InteractionHeader from './components/InteractionHeader'
import InteractionFooter from './components/InteractionFooter'
import useResolutionSubmit from '~/hooks/interactions/useResolutionSubmit'

const Resolution = () => {
  const { description } = useSelector(getResolutionDetails)
  const onSubmit = useResolutionSubmit()

  return (
    <BasWrapper>
      <InteractionHeader
        title={'Resolution'}
        description={
          description || 'You are introducing yourself with the service'
        }
      />
      <InteractionFooter cta={'Introduce'} onSubmit={onSubmit} />
    </BasWrapper>
  )
}

export default Resolution
