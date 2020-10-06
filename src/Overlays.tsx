import React from 'react'
import { useSelector } from 'react-redux'

import Loader from '~/modals/Loader'
import Lock from '~/modals/Lock'
import ActionSheetManager from './components/ActionSheet/ActionSheetManager'
import { getInteractionType } from './modules/interaction/selectors'
import { isAppLocked } from './modules/account/selectors'

const Overlays = () => {
  const isInteracting = useSelector(getInteractionType)
  const isLocked = useSelector(isAppLocked)

  const shouldShowActionSheets = !isLocked && isInteracting

  return (
    <>
      <Loader />
      <Lock />
      {shouldShowActionSheets ? <ActionSheetManager /> : null}
    </>
  )
}

export default Overlays
