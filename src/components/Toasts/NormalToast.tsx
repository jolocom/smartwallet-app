import React from 'react'
import { useToastToShow } from './context'
import Description from './Description'
import Title from './Title'

const NormalToast = () => {
  const { toastToShow } = useToastToShow()

  if (toastToShow && toastToShow.dismiss && !toastToShow?.interact) {
    return (
      <>
        <Title />
        <Description />
      </>
    )
  }
  return null
}

export default NormalToast
