import React from 'react'
import { useSelector } from 'react-redux'

import InteractionActionSheet from './components/ActionSheet/InteractionActionSheet'
import { getInteractionType } from './modules/interaction/selectors'
import { isAppLocked } from './modules/account/selectors'

const GlobalComponents = () => {
  const isInteracting = useSelector(getInteractionType)
  const isLocked = useSelector(isAppLocked)

  const shouldShowInteractionSheet = !isLocked && isInteracting

  return shouldShowInteractionSheet ? <InteractionActionSheet /> : null
}

export default GlobalComponents
