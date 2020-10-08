import React from 'react'
import { useSelector } from 'react-redux'

import InteractionActionSheet from './components/ActionSheet/InteractionActionSheet'
import { getInteractionType } from './modules/interaction/selectors'

const GlobalComponents = () => {
  const isInteracting = useSelector(getInteractionType)

  const shouldShowInteractionSheet = isInteracting

  return shouldShowInteractionSheet ? <InteractionActionSheet /> : null
}

export default GlobalComponents
