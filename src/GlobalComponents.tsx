import React from 'react'
import { useSelector } from 'react-redux'

import ActionSheetManager from './components/ActionSheet/ActionSheetManager'
import { getInteractionType } from './modules/interaction/selectors'
import { isAppLocked } from './modules/account/selectors'

const GlobalComponents = () => {
  const isInteracting = useSelector(getInteractionType)
  const isLocked = useSelector(isAppLocked)

  const shouldShowActionSheets = !isLocked && isInteracting

  return shouldShowActionSheets ? <ActionSheetManager /> : null
}

export default GlobalComponents
