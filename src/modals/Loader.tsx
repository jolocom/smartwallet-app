import React from 'react'
import { Modal, StatusBar } from 'react-native'
import { useSelector } from 'react-redux'

import { getLoaderState } from '~/modules/loader/selectors'
import { Colors } from '~/utils/colors'

import { getIsAppLocked, isLocalAuthSet } from '~/modules/account/selectors'
import { LoaderComponent } from '~/components/LoaderAnimation/LoaderAnimation'

interface LoaderI {
  bgColor?: Colors
}

const Loader: React.FC<LoaderI> = ({ bgColor = Colors.black }) => {
  const { msg, type } = useSelector(getLoaderState)

  // NOTE: @StatusBar component is here (aside from the one in @Overlays) b/c there is an issue
  // with translucent status bars and the @Modal component
  return (
    <Modal animationType="fade" visible presentationStyle="overFullScreen">
      <StatusBar backgroundColor={Colors.black} barStyle="light-content" />
      <LoaderComponent bgColor={bgColor} type={type} msg={msg} />
    </Modal>
  )
}

export default function () {
  const { isVisible: isLoaderVisible } = useSelector(getLoaderState)
  const isAuthSet = useSelector(isLocalAuthSet)
  const isAppLocked = useSelector(getIsAppLocked)

  // isVisible && isLocked && !isAuthSet => Logged out section
  if ((isLoaderVisible && !isAppLocked) || (isLoaderVisible && !isAuthSet)) {
    return <Loader />
  }
  return null
}
