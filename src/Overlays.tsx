import React from 'react'
import { StatusBar } from 'react-native'
import { useSelector } from 'react-redux'

import Loader from '~/modals/Loader'
import ActionSheetManager from './components/ActionSheet/ActionSheetManager'
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
      {isInteracting ? <ActionSheetManager /> : null}
    </>
  )
}

export default Overlays
