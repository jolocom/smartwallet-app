import React from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'

import Loader from '~/modals/Loader'
import ActionSheetManager from './components/ActionSheet/ActionSheetManager'
import Toasts from './components/Toasts'
import { getInteractionType } from './modules/interaction/selectors'

const Overlays = () => {
  const isInteracting = useSelector(getInteractionType)

  return (
    <>
      <StatusBar
        backgroundColor={'transparent'}
        animated
        translucent
        barStyle="light-content"
      />
      <Loader />
      <Toasts />
      {isInteracting ? <ActionSheetManager /> : null}
    </>
  )
}

export default Overlays
