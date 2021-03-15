import React, { RefObject } from 'react'
import { StatusBar } from 'react-native'

import Loader from '~/modals/Loader'
import Toasts from './components/Toasts'
import { NavigationContextProvider } from './NavigationProvider'
import { NavigationContainerRef } from '@react-navigation/native'

interface Props {
  navRef: RefObject<NavigationContainerRef>
}

const Overlays: React.FC<Props> = ({ navRef }) => {
  return (
    <NavigationContextProvider navRef={navRef}>
      <StatusBar
        backgroundColor={'transparent'}
        animated
        translucent
        barStyle="light-content"
      />
      <Toasts />
      <Loader />
    </NavigationContextProvider>
  )
}

export default Overlays
