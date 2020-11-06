import React from 'react'
import { TouchableOpacity } from 'react-native'

import { useToastToShow } from './context'
import Description from './Description'
import Title from './Title'

const StickyToast = () => {
  const { toastToShow, toastColor, invokeInteract } = useToastToShow()
  if (toastToShow && !toastToShow?.dismiss && !toastToShow.interact) {
    return (
      <TouchableOpacity onPress={invokeInteract}>
        <Title />
        <Description />
      </TouchableOpacity>
    )
  }
  return null
}

export default StickyToast
